import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LocationModal from '../../components/route/LocationModal';
import TimePickerModal from '../../components/route/TimePickerModal';
import SeatModal from '../../components/route/SeatModal';
import PriceModal from '../../components/route/PriceModal';
import CommentModal from '../../components/route/CommentModal';

import fromIcon from '../../assets/from.svg';
import toIcon from '../../assets/to.svg';
import calendarIcon from '../../assets/calendar.svg';
import userIcon from '../../assets/user.svg';
import cashIcon from '../../assets/cash.svg';
import noteIcon from '../../assets/note.svg';

import './CreateRoute.css';

const CreateRoute = () => {
  const { lang } = useParams();
  const navigate = useNavigate();

  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState('12:00');
  const [frontSeats, setFrontSeats] = useState(0);
  const [backSeats, setBackSeats] = useState(0);
  const [frontPrice, setFrontPrice] = useState('');
  const [backPrice, setBackPrice] = useState('');
  const [comment, setComment] = useState('');

  const [modal, setModal] = useState(null);

  const handleCreate = async () => {
    if (!from || !to || !date || !time) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    const payload = {
      from,
      to,
      date,
      time,
      frontSeats,
      backSeats,
      frontPrice,
      backPrice,
      comment
    };

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/routes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Ошибка при создании маршрута');
        return;
      }

      alert('Маршрут успешно создан!');
      navigate(`/${lang}/profile/menu`);
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Сервер недоступен');
    }
  };

  return (
    <div className="create-route-page">
      <h2>Создать маршрут</h2>

      <div className="route-field" onClick={() => setModal('from')}>
        <img src={fromIcon} alt="from" />
        <span>{from?.address || 'Откуда'}</span>
      </div>

      <div className="route-field" onClick={() => setModal('to')}>
        <img src={toIcon} alt="to" />
        <span>{to?.address || 'Куда'}</span>
      </div>

      <div className="route-field" onClick={() => setModal('time')}>
        <img src={calendarIcon} alt="calendar" />
        <span>{date ? `${date} в ${time}` : 'Дата и время'}</span>
      </div>

      <div className="route-field" onClick={() => setModal('seats')}>
        <img src={userIcon} alt="seats" />
        <span>
          {frontSeats + backSeats > 0
            ? `Мест: ${frontSeats} перед + ${backSeats} зад`
            : 'Свободные места'}
        </span>
      </div>

      <div className="route-field" onClick={() => setModal('price')}>
        <img src={cashIcon} alt="price" />
        <span>
          {frontPrice || backPrice
            ? `Цена: ${frontPrice}₮ перед / ${backPrice}₮ зад`
            : 'Цена за пассажира'}
        </span>
      </div>

      <div className="route-field" onClick={() => setModal('comment')}>
        <img src={noteIcon} alt="comment" />
        <span>{comment ? comment : 'Комментарий (необязательно)'}</span>
      </div>

      <button className="create-route-btn" onClick={handleCreate}>
        Создать маршрут
      </button>

      {/* Модальные окна */}
      {modal === 'from' && (
        <LocationModal
          isOpen
          mode="from"
          initialLocation={from}
          onSave={(loc) => {
            setFrom(loc);
            setModal(null);
          }}
          onClose={() => setModal(null)}
        />
      )}

      {modal === 'to' && (
        <LocationModal
          isOpen
          mode="to"
          initialLocation={to}
          onSave={(loc) => {
            setTo(loc);
            setModal(null);
          }}
          onClose={() => setModal(null)}
        />
      )}

      {modal === 'time' && (
        <TimePickerModal
          isOpen
          initialDate={date}
          initialTime={time}
          onSave={(d, t) => {
            setDate(d);
            setTime(t);
            setModal(null);
          }}
          onClose={() => setModal(null)}
        />
      )}

      {modal === 'seats' && (
        <SeatModal
          isOpen
          front={frontSeats}
          back={backSeats}
          onSave={(f, b) => {
            setFrontSeats(f);
            setBackSeats(b);
            setModal(null);
          }}
          onClose={() => setModal(null)}
        />
      )}

      {modal === 'price' && (
        <PriceModal
          isOpen
          front={frontPrice}
          back={backPrice}
          onSave={(f, b) => {
            setFrontPrice(f);
            setBackPrice(b);
            setModal(null);
          }}
          onClose={() => setModal(null)}
        />
      )}

      {modal === 'comment' && (
        <CommentModal
          isOpen
          initial={comment}
          onSave={(c) => {
            setComment(c);
            setModal(null);
          }}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default CreateRoute;
