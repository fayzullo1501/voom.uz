import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './VerifyPhone.css';

const VerifyPhone = () => {
  const { lang } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  const sendCode = async () => {
    setSendingCode(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/users/send-phone-code`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) {
        throw new Error('Ошибка отправки SMS');
      }

      setCodeSent(true);
    } catch (err) {
      setError('Не удалось отправить код. Попробуйте позже.');
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async () => {
    if (code.length !== 6) {
      setError('Введите 6-значный код');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/users/verify-phone-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ code }),
      });

      if (!res.ok) {
        throw new Error('Неверный код или срок действия истёк');
      }

      alert('Номер успешно подтверждён!');
      navigate(`/${lang}/profile/menu?phone_verified=true`);
    } catch (err) {
      setError(err.message || 'Ошибка подтверждения');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="phone-verify-wrapper">
      <h2 className="phone-verify-title">Подтверждение номера</h2>

      {!codeSent ? (
        <>
          <p className="phone-verify-text">
            Мы отправим вам 6-значный код по SMS для подтверждения.
          </p>
          {error && <div className="phone-verify-error">{error}</div>}
          <button className="phone-verify-btn" onClick={sendCode} disabled={sendingCode}>
            {sendingCode ? 'Отправка...' : 'Отправить код'}
          </button>
        </>
      ) : (
        <>
          <label className="phone-verify-label" htmlFor="code-input">
            Введите код из SMS
          </label>

          <input
            id="code-input"
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="123456"
            className="phone-verify-input"
          />

          {error && <div className="phone-verify-error">{error}</div>}

          <button className="phone-verify-btn" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Проверка...' : 'Продолжить'}
          </button>
        </>
      )}
    </div>
  );
};

export default VerifyPhone;
