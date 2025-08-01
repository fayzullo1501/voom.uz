import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logovoom from '../../assets/logo.svg';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { lang } = useParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password) {
      return setError('Введите Gmail и пароль');
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password })
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message || 'Ошибка входа');

      localStorage.setItem('adminToken', data.token);
      navigate(`/${lang}/admin/dashboard`);
    } catch (err) {
      console.error(err);
      setError('Ошибка сервера');
    }
  };

  return (
    <div className="admin-auth-page">
      <div className="auth-logo-top">
        <img src={logovoom} alt="VOOM" />
      </div>

      <h2 className="auth-title">Вход администратора</h2>

      <label className="auth-label">Gmail</label>
      <input
        type="email"
        className="auth-input"
        placeholder="admin@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label className="auth-label">Пароль</label>
      <div className="auth-input-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          className="auth-input"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span
          className="input-icon"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? '🙈' : '👁️'}
        </span>
      </div>

      {error && <div className="error-text">{error}</div>}

      <button className="submit-btn" onClick={handleLogin}>
        Войти
      </button>
    </div>
  );
};

export default AdminLogin;
