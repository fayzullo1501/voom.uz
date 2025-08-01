import React, { useEffect, useRef, useState } from 'react';
import './LocationModal.css'; // используем стили Hero
import geoIcon from '../../assets/location.svg';

const LocationModal = ({ isOpen, onClose, onSave, mode, initialLocation }) => {
  const [searchText, setSearchText] = useState('');
  const [address, setAddress] = useState(initialLocation?.address || '');
  const [coords, setCoords] = useState(initialLocation?.coords || [41.3111, 69.2797]); // Tashkent

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const ymapsRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !window.ymaps) return;

    window.ymaps.ready(() => {
      ymapsRef.current = window.ymaps;

      const map = new ymapsRef.current.Map(mapRef.current, {
        center: coords,
        zoom: 12,
        controls: []
      });

      const marker = new ymapsRef.current.Placemark(coords, {}, { draggable: true });
      map.geoObjects.add(marker);

      marker.events.add('dragend', () => {
        const newCoords = marker.geometry.getCoordinates();
        setCoords(newCoords);
        updateAddressFromCoords(newCoords);
      });

      mapInstance.current = map;
      markerRef.current = marker;
    });
  }, [isOpen]);

  const updateAddressFromCoords = (coords) => {
    ymapsRef.current.geocode(coords).then((res) => {
      const name = res.geoObjects.get(0)?.getAddressLine();
      if (name) setAddress(name);
    });
  };

  const handleSearch = () => {
    if (!searchText) return;
    ymapsRef.current.geocode(searchText).then((res) => {
      const result = res.geoObjects.get(0);
      if (result) {
        const newCoords = result.geometry.getCoordinates();
        setCoords(newCoords);
        markerRef.current.geometry.setCoordinates(newCoords);
        mapInstance.current.setCenter(newCoords, 14);
        updateAddressFromCoords(newCoords);
      }
    });
  };

  const handleGeo = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const newCoords = [pos.coords.latitude, pos.coords.longitude];
      setCoords(newCoords);
      markerRef.current.geometry.setCoordinates(newCoords);
      mapInstance.current.setCenter(newCoords, 14);
      updateAddressFromCoords(newCoords);
    });
  };

  const handleSave = () => {
    if (!address || !coords) {
      alert('Выберите точку');
      return;
    }
    onSave({ address, coords });
  };

  if (!isOpen) return null;

  return (
    <div className="location-modal-overlay">
      <div className="location-modal">
        {/* Заголовок в зависимости от 'mode' */}
        <h3 className="location-title">
          {mode === 'from' ? 'Выберите точку отправления' : 'Выберите точку назначения'}
        </h3>

        <div className="location-input-wrapper">
          <input
            type="text"
            className="location-input"
            placeholder="Введите адрес"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button className="location-search-btn" onClick={handleSearch}>Найти</button>
        </div>

        <div className="custom-map" ref={mapRef} />
        <button className="geo-fab" onClick={handleGeo}>
          <img src={geoIcon} alt="geo" />
        </button>

        <div className="location-display">{address}</div>

        <div className="location-buttons">
          <button className="cancel" onClick={onClose}>Отмена</button>
          <button className="save" onClick={handleSave}>Сохранить</button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
