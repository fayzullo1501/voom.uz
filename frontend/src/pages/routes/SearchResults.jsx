import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { from, to, date, type, passengers } = location.state || {};

  const [routes, setRoutes] = useState([]);
  const [sortBy, setSortBy] = useState('earliest');

  useEffect(() => {
    if (!from || !to || !date || !type) {
      navigate(-1);
      return;
    }

    const fetchRoutes = async () => {
      try {
        const res = await axios.post('/api/routes/search', {
          from,
          to,
          date,
          type,
          passengers
        });
        setRoutes(res.data);
      } catch (err) {
        console.error('Ошибка при загрузке маршрутов:', err);
      }
    };

    fetchRoutes();
  }, [from, to, date, type, passengers, navigate]);

  const sortedRoutes = [...routes].sort((a, b) => {
    if (sortBy === 'cheapest') return a.frontPrice - b.frontPrice;
    if (sortBy === 'earliest') return a.time.localeCompare(b.time);
    return 0;
  });

  return (
    <div className="search-results-page">
      <aside className="filters">
        <h4>Сортировка</h4>
        <ul>
          <li className={sortBy === 'earliest' ? 'active' : ''} onClick={() => setSortBy('earliest')}>
            Самые ранние
          </li>
          <li className={sortBy === 'cheapest' ? 'active' : ''} onClick={() => setSortBy('cheapest')}>
            Самые дешёвые
          </li>
        </ul>
      </aside>

      <main className="results-list">
        {sortedRoutes.length === 0 ? (
          <p>Нет маршрутов по заданным параметрам</p>
        ) : (
          sortedRoutes.map(route => (
            <div key={route._id} className="route-card" onClick={() => navigate(`/ru/route/${route._id}`)}>
              <div className="route-left">
                <img src="/avatar-default.jpg" alt="avatar" className="avatar" />
                <div className="driver-info">
                  <strong>
                    {route.userId?.firstName || 'Имя'} {route.userId?.lastName || ''}
                  </strong>
                  <span>⭐ 5.0</span>
                </div>
              </div>

              <div className="route-middle">
                <p><strong>{route.from.address} → {route.to.address}</strong></p>
                <p>{new Date(route.date).toLocaleDateString('ru-RU')}, {route.time}</p>
                {route.comment && <p className="comment">💬 {route.comment}</p>}
              </div>

              <div className="route-right">
                <p><strong>{route.frontPrice.toLocaleString()} сум</strong></p>
                <p>🪑 {route.frontSeats + route.backSeats} мест</p>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default SearchResults;
