import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logovoom from '../../assets/logo.svg';
import '.././Auth.css';

const ForgotCodePage = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // получаем email из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('forgot_email');
    if (!saved) {
      navigate(`/${lang}/forgot-password`);
    } else {
      setEmail(saved);
    }
  }, [lang, navigate]);

  const handleVerify = async () => {
    setError('');
    if (code.length !== 6) {
      return setError(t('auth.codeError') || 'Введите корректный 6-значный код');
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message || t('auth.verifyError'));

      navigate(`/${lang}/forgot-password/reset`);
    } catch (err) {
      console.error(err);
      setError(t('auth.serverError') || 'Ошибка сервера');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-logo-top">
        <Link to={`/${lang}`}>
          <img src={logovoom} alt="VOOM" />
        </Link>
      </div>

      <h2 className="auth-title">{t('auth.enterCode')}</h2>

      <label className="auth-label">{t('auth.codeLabel')}</label>
      <input
        type="text"
        className="auth-input"
        placeholder="123456"
        value={code}
        maxLength={6}
        onChange={(e) => setCode(e.target.value)}
      />

      {error && <div className="error-text">{error}</div>}

      <button className="submit-btn" onClick={handleVerify}>
        {t('auth.continue')}
      </button>

      <p className="auth-disclaimer">{t('auth.disclaimer')}</p>
    </div>
  );
};

export default ForgotCodePage;
