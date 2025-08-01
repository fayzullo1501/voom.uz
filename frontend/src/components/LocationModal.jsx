// LocationModal.jsx
import React, { useEffect, useRef, useState } from 'react';
import locationIcon from '../assets/location.svg';

const LocationModal = ({ isOpen, onClose, onSave, mode, initialLocation }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [placemark, setPlacemark] = useState(null);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isOpen || !window.ymaps) return;

    const timeout = setTimeout(() => {
      window.ymaps.ready(() => {
        if (!mapRef.current) return;

        const center = initialLocation?.coords || [41.311081, 69.240562];

        const instance = new window.ymaps.Map(mapRef.current, {
          center,
          zoom: 13,
          controls: [],
        });

        if (initialLocation?.coords && initialLocation?.address) {
          updatePlacemark(instance, initialLocation.coords, initialLocation.address);
        }

        instance.events.add('click', (e) => {
          const coords = e.get('coords');
          window.ymaps.geocode(coords).then((res) => {
            const address = res.geoObjects.get(0).getAddressLine();
            updatePlacemark(instance, coords, address);
          });
        });

        setMap(instance);
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, [isOpen, initialLocation]);

  const updatePlacemark = (mapInstance, coords, address) => {
    setSelectedCoords(coords);
    setSearchQuery(address);

    if (placemark) {
      mapInstance.geoObjects.remove(placemark);
    }

    const newPlacemark = new window.ymaps.Placemark(coords, {}, {
      preset: 'islands#violetIcon',
      draggable: true,
    });

    newPlacemark.events.add('dragend', () => {
      const newCoords = newPlacemark.geometry.getCoordinates();
      window.ymaps.geocode(newCoords).then((res) => {
        const newAddress = res.geoObjects.get(0).getAddressLine();
        setSelectedCoords(newCoords);
        setSearchQuery(newAddress);
      });
    });

    mapInstance.geoObjects.add(newPlacemark);
    mapInstance.setCenter(coords, 14);
    setPlacemark(newPlacemark);
  };

  const handleGeoClick = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        window.ymaps.geocode(coords).then((res) => {
          const address = res.geoObjects.get(0).getAddressLine();
          updatePlacemark(map, coords, address);
        });
      },
      () => console.warn('Геолокация недоступна')
    );
  };

  const handleSearch = () => {
    if (!searchQuery || !window.ymaps) return;

    window.ymaps.geocode(searchQuery).then((res) => {
      const first = res.geoObjects.get(0);
      if (!first) return;

      const coords = first.geometry.getCoordinates();
      const address = first.getAddressLine();
      updatePlacemark(map, coords, address);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="location-modal-overlay">
      <div className="location-modal">
        <h3>{mode === 'from' ? 'Выберите точку отправления' : 'Выберите точку назначения'}</h3>

        <div className="location-input-wrapper">
          <input
            type="text"
            className="location-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Введите адрес"
          />
          <button className="location-search-btn" onClick={handleSearch}>Найти</button>
        </div>

        <div ref={mapRef} className="custom-map" />

        {mode === 'from' && (
          <button className="geo-fab" onClick={handleGeoClick}>
            <img src={locationIcon} alt="geo" />
          </button>
        )}

        <div className="location-buttons">
          <button onClick={onClose} className="cancel">Отмена</button>
          <button
            className="save"
            onClick={() => {
              if (selectedCoords && searchQuery) {
                onSave({ coords: selectedCoords, address: searchQuery });
                onClose();
              } else {
                alert('Выберите точку на карте или через поиск');
              }
            }}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
