import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useNavigate } from 'react-router-dom';
import googleIcon from '../../assets/google.svg';
import facebookIcon from '../../assets/facebook.svg';
import logovoom from '../../assets/logo.svg';
import '../Auth.css';

const RegisterPage = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidGmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const handleContinue = async () => {
    setError('');
    if (!isValidGmail(email.trim())) {
      return setError(t('auth.invalidEmail') || 'Введите корректный Gmail');
    }

    try {
      setLoading(true);

      const res = await fetch(`${process.env.REACT_APP_API_BASE}/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });

      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        return setError(data.message || t('auth.sendCodeError'));
      }

      localStorage.setItem('register_email', email.trim().toLowerCase());
      navigate(`/${lang}/register/code`);
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

      <h2 className="auth-title">{t('auth.register')}</h2>

      <button className="auth-btn">
        <img src={googleIcon} alt="Google" />
        {t('auth.google')}
      </button>
      <button className="auth-btn">
        <img src={facebookIcon} alt="Facebook" />
        {t('auth.facebook')}
      </button>

      <div className="divider"></div>

      <label className="auth-label">Gmail</label>
      <input
        type="email"
        className="auth-input"
        placeholder="example@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {error && <div className="error-text">{error}</div>}

      <button className="submit-btn" onClick={handleContinue}>
        {t('auth.continue')}
      </button>

      <div className="auth-links">
        <div>
          {t('auth.haveAccount')}{' '}
          <Link to={`/${lang}/login`}>{t('auth.login')}</Link>
        </div>
      </div>

      <p className="auth-disclaimer">{t('auth.disclaimer')}</p>
    </div>
  );
};

export default RegisterPage;
