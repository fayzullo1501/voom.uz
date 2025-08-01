import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Header.css';

import logo from '../assets/logo.svg';
import plusIcon from '../assets/plus-icon.svg';
import flagRu from '../assets/ru-flag.svg';
import flagUz from '../assets/uz-flag.svg';
import flagEn from '../assets/en-flag.svg';
import placeholderAvatar from '../assets/avatar-placeholder.svg';

const flags = {
  ru: flagRu,
  uz: flagUz,
  en: flagEn
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [langOpen, setLangOpen] = useState(false);

  const languages = [
    { code: 'ru', label: 'Русский' },
    { code: 'uz', label: "O'zbekcha" },
    { code: 'en', label: 'English' }
  ];

  const currentLang = location.pathname.split('/')[1] || 'ru';
  const selected = languages.find(l => l.code === currentLang) || languages[0];

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Не авторизован');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('Ошибка при получении данных пользователя:', err);
        setUser(null);
      }
    };

    fetchUser();
  }, [location.pathname]);

  // ✅ Показываем alert при успешной верификации email
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('email_verified') === 'true') {
      alert('Почта успешно подтверждена');
      // Удаляем параметр из URL, чтобы не появлялся снова
      const cleanUrl = location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [location.search, location.pathname]);

  const handleLangChange = (code) => {
    const cleanPath = location.pathname.replace(/^\/(ru|uz|en)/, '') || '/';
    navigate(`/${code}${cleanPath}`);
    i18n.changeLanguage(code);
    setLangOpen(false);
  };

  const handleAuthClick = () => {
    if (user) {
      navigate(`/${currentLang}/profile/menu`);
    } else {
      navigate(`/${currentLang}/login`);
    }
  };

  const avatarUrl = user?.avatar?.startsWith('/uploads/')
    ? `${process.env.REACT_APP_API_BASE.replace('/api', '')}${user.avatar}`
    : placeholderAvatar;

  return (
    <header className="header">
      <div className="header-left">
        <img
          src={logo}
          alt="VOOM"
          className="logo-img"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(`/${currentLang}`)}
        />

        <nav className="nav">
          <span onClick={() => navigate(`/${currentLang}`)}>{t('nav.home')}</span>
          <span onClick={() => navigate(`/${currentLang}/about`)}>{t('nav.about')}</span>
          <span onClick={() => navigate(`/${currentLang}/news`)}>{t('nav.news')}</span>
          <span onClick={() => navigate(`/${currentLang}/contact`)}>{t('nav.contact')}</span>

          <div className="lang-container" onClick={() => setLangOpen(!langOpen)}>
            <div className="lang-current">
              <img src={flags[selected.code]} alt={selected.label} className="lang-flag" />
              <span>{selected.label}</span>
            </div>
            {langOpen && (
              <div className="lang-dropdown">
                {languages.map(lang => (
                  <div key={lang.code} onClick={() => handleLangChange(lang.code)}>
                    <img src={flags[lang.code]} alt={lang.label} className="lang-flag" />
                    <span>{lang.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="header-right">
        <button className="create-route-button" onClick={() => navigate(`/${currentLang}/create-route`)}>
          <img src={plusIcon} alt="+" className="btn-icon" />
          {t('buttons.create')}
        </button>

        <div className="auth-block" onClick={handleAuthClick}>
          <span className="auth-name">
            {user?.firstName || t('buttons.login')}
          </span>
          <img
            src={avatarUrl}
            alt="avatar"
            className="auth-avatar"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
