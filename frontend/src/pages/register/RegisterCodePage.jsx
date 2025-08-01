import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import logovoom from '../../assets/logo.svg';
import '../Auth.css';

const RegisterCodePage = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('register_email');
    if (!savedEmail) {
      navigate(`/${lang}/register`);
    } else {
      setEmail(savedEmail);
    }
  }, [lang, navigate]);

  const handleVerifyCode = async () => {
    setError('');

    if (!code || code.length !== 6) {
      return setError(t('auth.invalidCode') || 'Введите корректный 6-значный код');
    }

    try {
      setLoading(true);

      const res = await fetch(`${process.env.REACT_APP_API_BASE}/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        return setError(data.message || t('auth.codeVerifyError'));
      }

      navigate(`/${lang}/register/password`);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError(t('auth.serverError') || 'Ошибка сервера');
    }
  };

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-logo-top">
          <img src={logovoom} alt="VOOM" />
        </div>
        <h2 className="auth-title">{t('auth.loading')}</h2>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-logo-top">
        <Link to={`/${lang}`}>
          <img src={logovoom} alt="VOOM" />
        </Link>
      </div>

      <h2 className="auth-title">{t('auth.verifyEmail')}</h2>

      <label className="auth-label">{t('auth.emailCode')}</label>
      <input
        type="text"
        className="auth-input"
        placeholder="123456"
        maxLength={6}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      {error && <div className="error-text">{error}</div>}

      <button className="submit-btn" onClick={handleVerifyCode}>
        {t('auth.continue')}
      </button>

      <p className="auth-disclaimer">{t('auth.disclaimer')}</p>
    </div>
  );
};

export default RegisterCodePage;
