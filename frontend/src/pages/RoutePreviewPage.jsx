import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import i18n from '../i18n';
import './RoutePreviewPage.css';
import logo from '../assets/logo.svg';

const RoutePreviewPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const routeMap = useRef(null);

  const { from, to, date, type, passengers, packageName, weight } = state || {};

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
        type,
        packageName,
        weight
      }
    });
  };

  if (!from || !to) return <div>Недостаточно данных</div>;

  return (
    <div className="preview-wrapper">
      <header className="preview-header">
        <img src={logo} alt="VOOM" />
      </header>

      <main className="preview-content">
        <div className="preview-map" ref={mapRef} />

        <h1 className="preview-title">
          {from.address} — {to.address}
        </h1>

        <div className="preview-details">
          <p><strong>Детали:</strong></p>
          <p>Тип – {type === 'trip' ? 'поездка' : 'доставка'}</p>
          <p>Дата – {new Date(date).toLocaleDateString('ru-RU')}</p>
          {type === 'trip' ? (
            <p>Кол-во пассажиров – {passengers}</p>
          ) : (
            <>
              <p>Название – {packageName || '—'}</p>
              <p>Вес – {weight || '—'} кг</p>
            </>
          )}
        </div>
      </main>

      <footer className="preview-footer">
        <button className="btn back" onClick={() => navigate(-1)}>Назад</button>
        <button className="btn search" onClick={handleSearch}>Поиск</button>
      </footer>
    </div>
  );
};

export default RoutePreviewPage;
