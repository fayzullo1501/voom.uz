import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import logovoom from '../../assets/logo.svg';
import '../Auth.css';

const RegisterPasswordPage = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
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

  const handleSetPassword = async () => {
    setError('');

    if (!password || password.length < 6) {
      return setError(t('auth.passwordTooShort') || 'Пароль должен быть не менее 6 символов');
    }
    if (password !== confirm) {
      return setError(t('auth.passwordsDontMatch') || 'Пароли не совпадают');
    }

    try {
      setLoading(true);

      const res = await fetch(`${process.env.REACT_APP_API_BASE}/auth/set-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        return setError(data.message || t('auth.setPasswordError'));
      }

      localStorage.removeItem('register_email');
      navigate(`/${lang}/login`, { state: { accountCreated: true } });
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

      <h2 className="auth-title">{t('auth.setPassword')}</h2>

      <label className="auth-label">{t('auth.password')}</label>
      <input
        type="password"
        className="auth-input"
        placeholder={t('auth.password')}
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

      <button className="submit-btn" onClick={handleSetPassword}>
        {t('auth.continue')}
      </button>

      <p className="auth-disclaimer">{t('auth.disclaimer')}</p>
    </div>
  );
};

export default RegisterPasswordPage;
