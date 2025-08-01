import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UserDetails.css';
import placeholderAvatar from '../../../assets/avatar-placeholder.svg';

const UserDetails = () => {
  const { id, lang } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const fetchUser = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        }
      });
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error('Ошибка загрузки пользователя:', err);
    }
  };

  const fetchAdmin = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/users/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        }
      });
      const data = await res.json();
      setAdmin(data);
    } catch (err) {
      console.error('Ошибка получения админа:', err);
    }
  };

  const handlePassportDecision = async (action) => {
    try {
      const url = `${process.env.REACT_APP_API_BASE}/users/${id}/${action === 'confirm' ? 'confirm-passport' : 'reject-passport'}`;
      const body = action === 'reject' ? { reason: rejectReason } : null;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Ошибка');

      fetchUser();
      setShowRejectModal(false);
      setRejectReason('');
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchAdmin();
  }, [id]);

  if (!user) return <div className="user-details">Загрузка...</div>;

  return (
    <div className="user-details">
      {/* Header */}
      <div className="users-topbar">
        <h2 className="page-title">Детали пользователя</h2>
        <div className="admin-info">
          <span>{admin?.firstName || 'Администратор'}</span>
          <img
            src={admin?.avatar?.startsWith('/uploads/')
              ? `${process.env.REACT_APP_API_BASE.replace('/api', '')}${admin.avatar}`
              : placeholderAvatar}
            alt="admin"
            className="admin-avatar"
          />
        </div>
      </div>

      {/* Назад */}
      <button className="user-back" onClick={() => navigate(`/${lang}/admin/dashboard/users`)}>
        ← Назад к списку пользователей
      </button>

      {/* Фото + ФИО */}
      <div className="user-header">
        <img
          src={user.avatar?.startsWith('/uploads/')
            ? `${process.env.REACT_APP_API_BASE.replace('/api', '')}${user.avatar}`
            : placeholderAvatar}
          alt="avatar"
          className="user-avatar"
        />
        <h2>{user.firstName || '-'} {user.lastName || ''}</h2>
      </div>

      {/* Детали */}
      <div className="user-info">
        <p><strong>Телефон:</strong> {user.phone || '-'}</p>
        <p>
          <strong>Подтверждение телефона:</strong>{' '}
          <span className={user.isPhoneVerified ? 'text-yes' : 'text-no'}>
            {user.isPhoneVerified ? 'Да' : 'Нет'}
          </span>
        </p>
        <p><strong>Почта:</strong> {user.email}</p>
        <p>
          <strong>Подтверждение почты:</strong>{' '}
          <span className={user.isEmailVerified ? 'text-yes' : 'text-no'}>
            {user.isEmailVerified ? 'Да' : 'Нет'}
          </span>
        </p>
        <p><strong>Дата рождения:</strong> {user.birthDate ? new Date(user.birthDate).toLocaleDateString() : '-'}</p>
        <p><strong>О себе:</strong> {user.about || '-'}</p>
        <p>
          <strong>Водитель:</strong>{' '}
          <span className={user.isDriver ? 'text-yes' : 'text-no'}>
            {user.isDriver ? 'Да' : 'Нет'}
          </span>
        </p>
        <p>
          <strong>Подтверждение статуса водителя:</strong>{' '}
          <span className={user.isVerified ? 'text-yes' : 'text-no'}>
            {user.isVerified ? 'Да' : 'Нет'}
          </span>
        </p>
        <p><strong>Роль:</strong> {user.role}</p>
        <p><strong>Зарегистрирован:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>

        {/* Паспорт */}
        <p>
          <strong>Паспорт:</strong>{' '}
          {user.passportFile ? (
            <>
              <a
                href={`${process.env.REACT_APP_API_BASE.replace('/api', '')}${user.passportFile}`}
                target="_blank"
                rel="noreferrer"
                className="link-download"
              >
                📄 Скачать
              </a>
              {' '}
              {user.passportStatus === 'pending' && (
                <>
                  <button className="btn-confirm" onClick={() => handlePassportDecision('confirm')}>Подтвердить</button>
                  <button className="btn-reject" onClick={() => setShowRejectModal(true)}>Отклонить</button>
                </>
              )}
              {user.passportStatus === 'confirmed' && <span className="text-yes">Подтверждён</span>}
              {user.passportStatus === 'rejected' && <span className="text-no">Отклонён: {user.passportRejectReason}</span>}
            </>
          ) : (
            <span>-</span>
          )}
        </p>
      </div>

      {/* Модалка отклонения */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Причина отклонения</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Например: нечёткое фото"
            />
            <div className="modal-buttons">
              <button onClick={() => handlePassportDecision('reject')}>Отклонить</button>
              <button onClick={() => setShowRejectModal(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
