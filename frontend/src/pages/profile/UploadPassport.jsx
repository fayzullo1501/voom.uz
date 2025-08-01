import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UploadPassport.css';
import passportExample from '../../assets/passport-example.svg'; // замени на своё имя файла

const UploadPassport = () => {
  const { lang } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg',
  ];

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && allowedTypes.includes(selected.type)) {
      setFile(selected);
      setError('');
    } else {
      setFile(null);
      setError('Допустимые форматы: PDF, DOCX, PNG, JPG');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Пожалуйста, выберите файл');
      return;
    }

    const formData = new FormData();
    formData.append('passport', file);

    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/users/upload-passport`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Ошибка загрузки файла');

      navigate(`/${lang}/profile/menu`);
    } catch (err) {
      console.error(err);
      setError('Ошибка загрузки. Попробуйте снова.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-passport">
      <img src={passportExample} alt="Пример паспорта" className="passport-preview" />
      <p className="upload-instruction">Загрузите скан или фото паспорта</p>

      <form onSubmit={handleSubmit} className="upload-form">
        <input type="file" id="file-input" onChange={handleFileChange} accept=".pdf,.docx,.jpg,.jpeg,.png" />
        {error && <div className="error-msg">{error}</div>}
        <div className="button-row">
          <label htmlFor="file-input" className="btn choose-btn">Выбрать файл</label>
          <button type="submit" className="btn submit-btn" disabled={uploading}>
            {uploading ? 'Отправка...' : 'Отправить'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadPassport;
