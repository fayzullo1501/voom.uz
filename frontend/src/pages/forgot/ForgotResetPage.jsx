import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logovoom from '../../assets/logo.svg';
import '.././Auth.css';

const ForgotResetPage = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('forgot_email');
    if (!saved) {
      navigate(`/${lang}/forgot-password`);
    } else {
      setEmail(saved);
    }
  }, [lang, navigate]);

  const handleReset = async () => {
    setError('');
    if (!password || password.length < 6) {
      return setError(t('auth.passwordShort'));
    }
    if (password !== confirm) {
      return setError(t('auth.passwordMismatch'));
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/auth/set-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message || t('auth.setError'));

      localStorage.removeItem('forgot_email');
      navigate(`/${lang}/profile`);
    } catch (err) {
      console.error(err);
      setError(t('auth.serverError'));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-logo-top">
        <Link to={`/${lang}`}>
          <img src={logovoom} alt="VOOM" />
        </Link>
      </div>

      <h2 className="auth-title">{t('auth.resetPassword')}</h2>

      <label className="auth-label">{t('auth.passwordLabel')}</label>
      <input
        type="password"
        className="auth-input"
        placeholder={t('auth.passwordLabel')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <label className="auth-label">{t('auth.confirmPassword')}</label>
      <input
        type="password"
        className="auth-input"
        placeholder={t('auth.confirmPassword')}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      {error && <div className="error-text">{error}</div>}

      <button className="submit-btn" onClick={handleReset}>
        {t('auth.continue')}
      </button>

      <p className="auth-disclaimer">{t('auth.disclaimer')}</p>
    </div>
  );
};

export default ForgotResetPage;
