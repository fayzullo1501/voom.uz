import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './ProfileTabs.css';

const ProfileTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useParams();

  const isMenu = location.pathname.includes('/profile/menu');
  const isAccount = location.pathname.includes('/profile/account');

  return (
    <div className="profile-tabs">
      <button
        className={isMenu ? 'tab active' : 'tab'}
        onClick={() => navigate(`/${lang}/profile/menu`)}
      >
        О себе
      </button>
      <button
        className={isAccount ? 'tab active' : 'tab'}
        onClick={() => navigate(`/${lang}/profile/account`)}
      >
        Учётная запись
      </button>
    </div>
  );
};

export default ProfileTabs;
