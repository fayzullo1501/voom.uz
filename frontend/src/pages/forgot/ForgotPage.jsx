import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logovoom from '../../assets/logo.svg';
import '.././Auth.css';

const ForgotPage = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const API = process.env.REACT_APP_API_BASE;

  const isValidGmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const handleSubmit = async () => {
    setError('');
    if (!isValidGmail(email.trim())) {
      return setError(t('auth.invalidGmail'));
    }

    try {
      const res = await fetch(`${API}/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message || t('auth.sendError'));

      localStorage.setItem('forgot_email', email.trim().toLowerCase());
      navigate(`/${lang}/forgot-password/code`);
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

      <h2 className="auth-title">{t('auth.forgotTitle')}</h2>

      <label className="auth-label">{t('auth.emailLabel')}</label>
      <input
        type="email"
        className="auth-input"
        placeholder="yourname@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {error && <div className="error-text">{error}</div>}

      <button className="submit-btn" onClick={handleSubmit}>
        {t('auth.continue')}
      </button>

      <p className="auth-disclaimer">{t('auth.disclaimer')}</p>
    </div>
  );
};

export default ForgotPage;
