import React, { useState } from 'react';
import './CommentModal.css';

const CommentModal = ({ isOpen, initial, onSave, onClose }) => {
  const [comment, setComment] = useState(initial || '');

  const handleSave = () => {
    onSave(comment.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="comment-modal-overlay">
      <div className="comment-modal">
        <div className="modal-header">
          <span>Комментарий</span>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="comment-body">
          <textarea
            placeholder="Например: могу заехать по пути или не беру животных"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
          />
        </div>

        <div className="modal-footer">
          <button className="save-btn" onClick={handleSave}>Сохранить</button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
