import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import i18n from '../i18n';
import './RoutePreview.css';

const RoutePreview = ({ from, to, date, type, passengers, onBack }) => {
  const mapRef = useRef(null);
  const routeMap = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.ymaps || !from || !to) return;

    window.ymaps.ready(() => {
      if (routeMap.current) routeMap.current.destroy();

      routeMap.current = new window.ymaps.Map(mapRef.current, {
        center: from.coords,
        zoom: 9,
        controls: [],
      });

      window.ymaps.route([from.coords, to.coords]).then((route) => {
        routeMap.current.geoObjects.add(route);
        routeMap.current.setBounds(route.getBounds(), { checkZoomRange: true });
      });
    });
  }, [from, to]);

  const handleSearch = () => {
    navigate(`/${i18n.language}/routes`, {
      state: {
        from,
        to,
        date,
        passengers,
        type // ✅ обязательно передаём тип: 'trip' или 'delivery'
      }
    });
  };

  return (
    <div className="route-preview">
      <h3>Маршрут от {from.address} до {to.address}</h3>

      <div className="route-details">
        <p><strong>Тип:</strong> {type === 'trip' ? 'Поездка' : 'Доставка'}</p>
        <p><strong>Дата:</strong> {new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        {type === 'trip' ? (
          <p><strong>Пассажиров:</strong> {passengers}</p>
        ) : (
          <>
            <p><strong>Название груза:</strong> —</p>
            <p><strong>Вес:</strong> — кг</p>
          </>
        )}
      </div>

      <div ref={mapRef} className="route-map" />

      <div className="route-buttons">
        <button className="back-btn" onClick={onBack}>← Назад</button>
        <button className="search-btn" onClick={handleSearch}>Поиск</button>
      </div>
    </div>
  );
};

export default RoutePreview;
