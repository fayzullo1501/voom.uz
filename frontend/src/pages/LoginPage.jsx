import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, X } from 'lucide-react';

import googleIcon from '../assets/google.svg';
import facebookIcon from '../assets/facebook.svg';
import logovoom from '../assets/logo.svg';
import './Auth.css';

const LoginPage = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.accountCreated) {
      alert('Аккаунт успешно создан. Пожалуйста, войдите.');
    }
  }, [location]);

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password) {
      return setError(t('auth.enterEmailPassword') || 'Введите Gmail и пароль');
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password })
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message || t('auth.loginError'));

      localStorage.setItem('token', data.token);
      navigate(`/${lang}/profile/menu`);
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

      <h2 className="auth-title">{t('auth.login')}</h2>

      <button className="auth-btn"><img src={googleIcon} alt="Google" /> {t('auth.google')}</button>
      <button className="auth-btn"><img src={facebookIcon} alt="Facebook" /> {t('auth.facebook')}</button>

      <div className="divider"></div>

      <label className="auth-label">{t('auth.emailLabel')}</label>
      <div className="auth-input-wrapper">
        <input
          type="email"
          className="auth-input"
          placeholder="yourname@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {email && <X className="input-icon" onClick={() => setEmail('')} />}
      </div>

      <label className="auth-label">{t('auth.passwordLabel')}</label>
      <div className="auth-input-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          className="auth-input"
          placeholder={t('auth.passwordLabel')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {password && (
          showPassword
            ? <EyeOff className="input-icon" onClick={() => setShowPassword(false)} />
            : <Eye className="input-icon" onClick={() => setShowPassword(true)} />
        )}
      </div>

      {error && <div className="error-text">{error}</div>}

      <button className="submit-btn" onClick={handleLogin}>
        {t('auth.login')}
      </button>

      <div className="auth-links">
        <div>
          <Link to={`/${lang}/forgot-password`}>{t('auth.forgotPassword')}</Link>
        </div>
        <div>
          {t('auth.noAccount')} <Link to={`/${lang}/register`}>{t('auth.registerLink')}</Link>
        </div>
      </div>

      <p className="auth-disclaimer">{t('auth.disclaimer')}</p>
    </div>
  );
};

export default LoginPage;
