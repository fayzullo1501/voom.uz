import React, { useState } from 'react';
import './TimePickerModal.css';

const TimePickerModal = ({ isOpen, initialDate, initialTime, onSave, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(initialDate || '');
  const [selectedTime, setSelectedTime] = useState(initialTime || '12:00');

  const handleSave = () => {
    if (!selectedDate || !selectedTime) {
      alert('Укажите дату и время');
      return;
    }
    onSave(selectedDate, selectedTime);
  };

  if (!isOpen) return null;

  return (
    <div className="time-modal-overlay">
      <div className="time-modal">
        <div className="modal-header">
          <span>Дата и время</span>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="time-modal-body">
          <label>Дата:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />

          <label>Время:</label>
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          />
        </div>

        <div className="time-modal-footer">
          <button className="save-btn" onClick={handleSave}>Сохранить</button>
        </div>
      </div>
    </div>
  );
};

export default TimePickerModal;
