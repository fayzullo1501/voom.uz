import React, { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, RotateCw, Plus, Minus } from 'lucide-react';
import Cropper from 'react-easy-crop';
import './ProfilePhotoUpload.css';

const getCroppedImg = (imageSrc, croppedAreaPixels, rotation = 0) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Не удалось создать blob'));
        const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
        resolve(file);
      }, 'image/jpeg');
    };

    image.onerror = () => reject(new Error('Ошибка загрузки изображения'));
  });
};

const ProfilePhotoUpload = () => {
  const { lang } = useParams();
  const navigate = useNavigate();

  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      const formData = new FormData();
      formData.append('avatar', croppedFile);

      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/users/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Ошибка загрузки');

      alert('Фото успешно загружено!');
      navigate(`/${lang}/profile/menu`);
      setTimeout(() => window.location.reload(), 200);
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении фото');
    }
  };

  const handleGoBack = () => navigate(`/${lang}/profile/menu`);

  return (
    <div className="photo-page">
      <button className="back-btn" onClick={handleGoBack}><X size={24} /></button>

      {imageSrc ? (
        <>
          <div className="crop-container">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={1}
              cropShape="rect"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="controls">
            <button onClick={() => setRotation((prev) => prev + 90)}><RotateCw size={20} /></button>
            <button onClick={() => setZoom((prev) => Math.max(1, prev - 0.2))}><Minus size={20} /></button>
            <button onClick={() => setZoom((prev) => Math.min(3, prev + 0.2))}><Plus size={20} /></button>
          </div>

          <div className="button-group">
            <button className="btn cancel-btn" onClick={() => setImageSrc(null)}>
              Выбрать другое фото
            </button>
            <button className="btn save-btn" onClick={handleSave}>
              Сохранить
            </button>
          </div>
        </>
      ) : (
        <div className="photo-content">
          <div className="photo-placeholder" />
          <h1 className="photo-title">
            Фотографируйтесь одни,<br />
            снимите солнечные очки<br />
            и смотрите прямо перед собой.
          </h1>
          <button className="upload-btn" onClick={() => document.getElementById('photo-upload').click()}>
            Выбрать фото
          </button>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoUpload;
