import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../i18n';

import './Hero.css';
import calendarIcon from '../assets/calendar.svg';
import userIcon from '../assets/user.svg';
import fromIcon from '../assets/from.svg';
import toIcon from '../assets/to.svg';
import boxIcon from '../assets/luggage.svg';
import weightIcon from '../assets/weight.svg';

import LocationModal from './LocationModal';

const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('trip');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [isPassengerOpen, setIsPassengerOpen] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [mapMode, setMapMode] = useState('from');
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const calendarRef = useRef(null);
  const calendarBtnRef = useRef(null);
  const passengerRef = useRef(null);
  const passengerBtnRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target) &&
        !calendarBtnRef.current.contains(e.target)
      ) setIsCalendarOpen(false);

      if (
        passengerRef.current &&
        !passengerRef.current.contains(e.target) &&
        !passengerBtnRef.current.contains(e.target)
      ) setIsPassengerOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };

  const increment = () => setPassengerCount(prev => Math.min(prev + 1, 8));
  const decrement = () => setPassengerCount(prev => Math.max(prev - 1, 1));

  const nextMonth = (e) => {
    e.stopPropagation();
    const current = new Date();
    const lastAllowed = new Date(current.getFullYear(), 11, 31);
    const next = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
    if (next <= lastAllowed) setCalendarMonth(next);
  };

  const prevMonth = (e) => {
    e.stopPropagation();
    const today = new Date();
    const prev = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
    if (prev >= new Date(today.getFullYear(), today.getMonth(), 1)) setCalendarMonth(prev);
  };

  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();
  const today = new Date();

  const generateDays = () => {
    const days = [];
    const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    for (let i = 0; i < offset; i++) {
      days.push(<span key={`empty-${i}`} className="calendar-day empty"></span>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), i);
      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isSelected = selectedDate.toDateString() === date.toDateString();
      days.push(
        <span
          key={i}
          className={`calendar-day ${isPast ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => !isPast && handleDateSelect(date)}
        >
          {i}
        </span>
      );
    }
    return days;
  };

  const handleNext = () => {
    if (!fromLocation || !toLocation || !selectedDate) {
      alert('Пожалуйста, заполните все поля маршрута');
      return;
    }

    navigate(`/${i18n.language}/preview`, {
      state: {
        from: fromLocation,
        to: toLocation,
        date: selectedDate,
        type: activeTab,
        passengers: passengerCount,
        packageName: '',
        weight: ''
      }
    });
  };

  return (
    <div className="hero-wrapper">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 dangerouslySetInnerHTML={{ __html: t('hero.title') }} />
          </div>

          <div className="search-box">
            <div className="search-fields">
              <div className="tabs">
                <span className={`tab ${activeTab === 'trip' ? 'active' : ''}`} onClick={() => setActiveTab('trip')}>
                  {t('hero.trip')}
                </span>
                <span className={`tab ${activeTab === 'delivery' ? 'active' : ''}`} onClick={() => setActiveTab('delivery')}>
                  {t('hero.delivery')}
                </span>
              </div>

              <div className="inputs">
                <div className="input-field" onClick={() => {
                  setMapMode('from');
                  setLocationModalOpen(true);
                }}>
                  <img src={fromIcon} alt="from" />
                  <input type="text" placeholder={t('hero.from')} value={fromLocation?.address || ''} readOnly />
                </div>

                <div className="input-field" onClick={() => {
                  setMapMode('to');
                  setLocationModalOpen(true);
                }}>
                  <img src={toIcon} alt="to" />
                  <input type="text" placeholder={t('hero.to')} value={toLocation?.address || ''} readOnly />
                </div>

                <div className="input-field" ref={calendarBtnRef} onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
                  <img src={calendarIcon} alt="calendar" />
                  <input
                    type="text"
                    value={selectedDate.toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long'
                    })}
                    readOnly
                  />
                  {isCalendarOpen && (
                    <div className="calendar-popup" ref={calendarRef}>
                      <div className="calendar-header">
                        <span className="calendar-nav-btn" onClick={prevMonth}>‹</span>
                        <span>
                          {calendarMonth.toLocaleDateString('ru-RU', {
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="calendar-nav-btn" onClick={nextMonth}>›</span>
                      </div>
                      <div className="calendar-grid">
                        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d, i) => (
                          <span key={i} className="calendar-day-name">{d}</span>
                        ))}
                        {generateDays()}
                      </div>
                    </div>
                  )}
                </div>

                {activeTab === 'trip' ? (
                  <div className="input-field" ref={passengerBtnRef} onClick={() => setIsPassengerOpen(!isPassengerOpen)}>
                    <img src={userIcon} alt="user" />
                    <input
                      type="text"
                      value={`${passengerCount} ${t('hero.passenger')}`}
                      readOnly
                    />
                    {isPassengerOpen && (
                      <div className="passenger-popup" ref={passengerRef}>
                        <span>{t('hero.passengers')}</span>
                        <div className="counter">
                          <button onClick={(e) => { e.stopPropagation(); decrement(); }}>−</button>
                          <span>{passengerCount}</span>
                          <button className="plus" onClick={(e) => { e.stopPropagation(); increment(); }}>+</button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="input-field">
                      <img src={boxIcon} alt="box" />
                      <input type="text" placeholder={t('hero.package')} />
                    </div>
                    <div className="input-field">
                      <img src={weightIcon} alt="weight" />
                      <input type="text" placeholder={t('hero.weight')} />
                    </div>
                  </>
                )}
              </div>
            </div>

            <button className="search-button" onClick={handleNext}>
              {t('hero.next') || 'Далее'}
            </button>
          </div>
        </div>
      </section>

      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onSave={(loc) => {
          if (mapMode === 'from') setFromLocation(loc);
          else setToLocation(loc);
        }}
        mode={mapMode}
        initialLocation={mapMode === 'from' ? fromLocation : toLocation}
      />
    </div>
  );
};

export default Hero;
