import React, { useState } from 'react';
import './SeatModal.css';

const SeatModal = ({ isOpen, front, back, onSave, onClose }) => {
  const [frontSeats, setFrontSeats] = useState(front || 0);
  const [backSeats, setBackSeats] = useState(back || 0);

  const handleSave = () => {
    if (frontSeats === 0 && backSeats === 0) {
      alert('Укажите хотя бы одно место');
      return;
    }
    onSave(frontSeats, backSeats);
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('seat-modal-overlay')) {
      onClose();
    }
  };

  return (
    <div className="seat-modal-overlay" onClick={handleOverlayClick}>
      <div className="seat-modal">
        <h3 className="seat-title">Свободные места</h3>

        <div className="seat-group">
          <label>Передние места (макс 1):</label>
          <div className="seat-counter">
            <button onClick={() => setFrontSeats(Math.max(0, frontSeats - 1))}>−</button>
            <span>{frontSeats}</span>
            <button onClick={() => setFrontSeats(Math.min(1, frontSeats + 1))}>+</button>
          </div>
        </div>

        <div className="seat-group">
          <label>Задние места (макс 6):</label>
          <div className="seat-counter">
            <button onClick={() => setBackSeats(Math.max(0, backSeats - 1))}>−</button>
            <span>{backSeats}</span>
            <button onClick={() => setBackSeats(Math.min(6, backSeats + 1))}>+</button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Отмена</button>
          <button className="save-btn" onClick={handleSave}>Сохранить</button>
        </div>
      </div>
    </div>
  );
};

export default SeatModal;
