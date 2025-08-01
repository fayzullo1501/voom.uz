import React, { useState } from 'react';
import './PriceModal.css';

const PriceModal = ({ isOpen, front, back, onSave, onClose }) => {
  const [frontPrice, setFrontPrice] = useState(front || '');
  const [backPrice, setBackPrice] = useState(back || '');

  const handleSave = () => {
    if (!frontPrice && !backPrice) {
      alert('Укажите хотя бы одну цену');
      return;
    }

    onSave(frontPrice, backPrice);
  };

  if (!isOpen) return null;

  return (
    <div className="price-modal-overlay">
      <div className="price-modal">
        <div className="modal-header">
          <span>Цена за пассажира</span>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="price-body">
          <div className="price-group">
            <label>Переднее место (UZS):</label>
            <input
              type="number"
              min="0"
              value={frontPrice}
              onChange={(e) => setFrontPrice(e.target.value)}
              placeholder="например, 30000"
            />
          </div>

          <div className="price-group">
            <label>Заднее место (UZS):</label>
            <input
              type="number"
              min="0"
              value={backPrice}
              onChange={(e) => setBackPrice(e.target.value)}
              placeholder="например, 20000"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="save-btn" onClick={handleSave}>Сохранить</button>
        </div>
      </div>
    </div>
  );
};

export default PriceModal;
