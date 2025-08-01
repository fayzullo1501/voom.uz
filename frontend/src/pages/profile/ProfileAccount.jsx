import React, { useEffect, useState } from 'react';
import './ProfileAccount.css';
import { useParams, useNavigate } from 'react-router-dom';
import ProfileTabs from '../profile/ProfileTabs';

const ProfileAccount = () => {
  const { lang } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('Ошибка при загрузке профиля:', err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
  localStorage.removeItem('token');
  navigate(`/${lang}`);
  setTimeout(() => {
    window.location.reload();
  }, 100);
};


  return (
    <div className="profile-account">
      <ProfileTabs />

      <div className="account-content">
        <div className="account-row">
          <span className="label">Gmail:</span>
          <span>{user.email || '—'}</span>
        </div>

        <div className="account-row">
          <span className="label">Статус водителя:</span>
          <span>{user.isDriver ? 'Да' : 'Нет'}</span>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
};

export default ProfileAccount;
