import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProfileEditInfo.css';
import { X } from 'lucide-react';

const ProfileEditInfo = () => {
  const { lang } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    phone: '',
    about: ''
  });

  const [initialUser, setInitialUser] = useState(user);
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const loaded = {
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          birthDate: data.birthDate ? data.birthDate.slice(0, 10) : '',
          email: data.email || '',
          phone: data.phone || '',
          about: data.about || '',
        };
        setUser(loaded);
        setInitialUser(loaded);
      } catch (err) {
        console.error('Ошибка при загрузке профиля', err);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      // Отклоняем ввод, если не начинается с +998
      if (!value.startsWith('+998')) return;

      // Оставляем только цифры
      const digits = value.replace(/\D/g, '');

      // Ограничиваем до 9 цифр после +998
      const clean = '+998' + digits.slice(3, 12);
      setUser({ ...user, phone: clean });
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  const handleGoBack = () => {
    navigate(`/${lang}/profile/menu`);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      if (!res.ok) throw new Error('Ошибка сохранения');

      const data = await res.json();
      setInitialUser({
        firstName: data.user.firstName || '',
        lastName: data.user.lastName || '',
        birthDate: data.user.birthDate ? data.user.birthDate.slice(0, 10) : '',
        email: data.user.email || '',
        phone: data.user.phone || '',
        about: data.user.about || '',
      });

      alert('Изменения сохранены');
      navigate(`/${lang}/profile/menu`);
    } catch (err) {
      console.error('Ошибка при сохранении:', err);
      alert('Не удалось сохранить изменения');
    }
  };

  const renderField = (label, name, type = 'text') => (
    <div className="profile-readonly-field">
      <label>{label}</label>
      {editingField === name ? (
        type === 'textarea' ? (
          <textarea
            name={name}
            value={user[name]}
            onChange={handleChange}
            onBlur={() => setEditingField(null)}
            placeholder={`Введите ${label.toLowerCase()}`}
            rows={4}
            autoFocus
          />
        ) : (
          <input
            type={type}
            name={name}
            value={user[name]}
            onChange={handleChange}
            onFocus={() => {
              if (name === 'phone' && !user.phone) {
                setUser({ ...user, phone: '+998' });
              }
            }}
            onBlur={() => setEditingField(null)}
            placeholder={`Введите ${label.toLowerCase()}`}
            autoFocus
          />
        )
      ) : (
        <div className="value" onClick={() => setEditingField(name)}>
          {user[name] || <span className="placeholder">Введите {label.toLowerCase()}</span>}
        </div>
      )}
    </div>
  );

  return (
    <div className="edit-profile-page">
      <button className="close-btn" onClick={handleGoBack}>
        <X size={24} />
      </button>

      <h1 className="edit-profile-title">Информация о себе</h1>

      {renderField('Имя', 'firstName')}
      {renderField('Фамилия', 'lastName')}
      {renderField('Дата рождения', 'birthDate', 'date')}

      <div className="profile-readonly-field">
        <label>Адрес эл. почты</label>
        <div className="value inactive">{user.email}</div>
      </div>

      {renderField('Номер телефона', 'phone')}
      {renderField('О себе', 'about', 'textarea')}

      {JSON.stringify(user) !== JSON.stringify(initialUser) && (
        <button className="save-btn" onClick={handleSave}>
          Сохранить
        </button>
      )}
    </div>
  );
};

export default ProfileEditInfo;
