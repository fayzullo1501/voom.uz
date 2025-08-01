import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Plus, Check } from 'lucide-react';
import './ProfileMenu.css';
import placeholderAvatar from '../../assets/avatar-placeholder.svg';
import ProfileTabs from './ProfileTabs';

const ProfileMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useParams();

  const [user, setUser] = useState({});
  const [showEmailVerifiedBanner, setShowEmailVerifiedBanner] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sendError, setSendError] = useState(null);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
      if (data.isEmailVerified) {
        setEmailSent(false);
      }
    } catch (err) {
      console.error('Ошибка при загрузке профиля:', err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const verified = params.get('email_verified');

    if (verified === 'true') {
      setShowEmailVerifiedBanner(true);
      setTimeout(() => {
        fetchUser();
      }, 500);
      setTimeout(() => {
        setShowEmailVerifiedBanner(false);
        navigate(location.pathname, { replace: true });
      }, 1500);
    }
  }, [location.search]);

  const handleSendVerification = async () => {
    const token = localStorage.getItem('token');
    setSending(true);
    setSendError(null);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/users/verify-email`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Ошибка отправки письма');
      setEmailSent(true);
    } catch (err) {
      console.error('Ошибка при отправке:', err);
      setSendError('Не удалось отправить письмо. Попробуйте позже.');
    } finally {
      setSending(false);
    }
  };

  const avatarUrl = user.avatar?.startsWith('/uploads/')
    ? `${process.env.REACT_APP_API_BASE.replace('/api', '')}${user.avatar}`
    : placeholderAvatar;

  return (
    <div className="profile-menu">
      <ProfileTabs />

      <div className="profile-header">
        <img src={avatarUrl} alt="avatar" className="profile-avatar" />
        <div className="profile-name">
          {user.firstName ? <strong>{user.firstName}</strong> : <span className="placeholder-name">Имя</span>}
        </div>
      </div>

      <div className="profile-actions">
        <button className="add-photo-btn" onClick={() => navigate(`/${lang}/profile/add-photo`)}>
          <span className="verify-icon">
            <Plus size={14} />
          </span>
          <span className="verify-text">Добавить фото профиля</span>
        </button>

        <button className="edit-info-btn no-icon" onClick={() => navigate(`/${lang}/profile/edit-info`)}>
          <span className="icon-placeholder" />
          <span className="verify-text">Редактировать информацию о себе</span>
        </button>
      </div>

      <div className="verify-section">
        <div className="verify-title">Подтвердите свой профиль</div>

        {/* паспорт */}
        {user.passportStatus === 'pending' ? (
          <div className="verify-item inactive">
            <div className="verify-icon" style={{ borderColor: '#f0c000', backgroundColor: '#fff8dc', color: '#f0c000' }}>
              <div className="spinner small" />
            </div>
            <span className="verify-text">Ожидание подтверждения паспорта</span>
          </div>
        ) : user.passportStatus === 'confirmed' ? (
          <div className="verify-item inactive phone-verified">
            <div className="verify-icon">
              <Check />
            </div>
            <span className="verify-text">Паспорт подтверждён</span>
          </div>
        ) : (
          <div
            className="verify-item"
            onClick={() => navigate(`/${lang}/profile/upload-passport`)}
          >
            <div className="verify-icon" style={user.passportStatus === 'rejected' ? {
              borderColor: '#e74c3c',
              backgroundColor: '#fdecea',
              color: '#e74c3c'
            } : {}}>
              {user.passportStatus === 'rejected' ? '✖' : <Plus size={14} />}
            </div>
            <span className="verify-text">
              {user.passportStatus === 'rejected'
                ? <>Подтверждение паспорта отклонено{user.passportRejectReason ? ` (${user.passportRejectReason})` : ''}</>
                : 'Подтвердить паспорт'}
            </span>
          </div>
        )}

        {/* email */}
        <div
          className={`verify-item email-verified ${user.isEmailVerified ? 'inactive' : ''}`}
          onClick={!user.isEmailVerified && !sending ? handleSendVerification : null}
        >
          <div className="verify-icon">
            {user.isEmailVerified ? (
              <Check />
            ) : sending ? (
              <div className="spinner small" />
            ) : (
              <Plus size={14} />
            )}
          </div>
          <span className="verify-text">
            {user.isEmailVerified ? (
              <span className="verified">{user.email}</span>
            ) : emailSent ? (
              <span className="verify-sent">Ссылка отправлена на {user.email}</span>
            ) : (
              <span className="verify-link">Подтвердить почту ({user.email})</span>
            )}
          </span>
        </div>

        {/* номер телефона */}
        <div
          className={`verify-item phone-verified ${user.isPhoneVerified ? 'inactive' : ''}`}
          onClick={!user.isPhoneVerified ? () => navigate(`/${lang}/verify-phone`) : null}
        >
          <div className="verify-icon">
            {user.isPhoneVerified ? <Check /> : <Plus size={14} />}
          </div>
          <span className="verify-text">
            {user.isPhoneVerified ? (
              <span className="verified">{user.phone}</span>
            ) : (
              <span className="verify-link">Подтвердить номер телефона ({user.phone || '+998 XX XXX XX XX'})</span>
            )}
          </span>
        </div>

        {sendError && <div className="verify-error">{sendError}</div>}

        {showEmailVerifiedBanner && (
          <div className="email-success-banner">
            Ваша почта успешно подтверждена!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileMenu;
