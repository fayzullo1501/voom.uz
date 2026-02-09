// src/pages/profile/EditCarPhoto.jsx
import React, { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../config/api";
import { useToast } from "../../components/ui/useToast";

const EditCarPhoto = () => {
  const navigate = useNavigate();
  const { lang, id } = useParams();
  const { showToast } = useToast();
  const token = localStorage.getItem("token");
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/profile/cars/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setPhotos(data.photos || []))
      .catch(() => showToast("Ошибка загрузки фото", "error"))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePickPhoto = () => {
    if (photos.length >= 10) {
      showToast("Максимум 10 фото", "error");
      return;
    }
    fileRef.current.click();
  };

  const handleUploadPhoto = async (file) => {
    const formData = new FormData();
    formData.append("photo", file);

    try {
      setSaving(true);
      const res = await fetch(`${API_URL}/api/profile/cars/${id}/photos`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error();

      const car = await res.json();
      setPhotos(car.photos || []);
    } catch {
      showToast("Ошибка загрузки фото", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePhoto = async (photoId) => {
    try {
      setSaving(true);
      const res = await fetch(
        `${API_URL}/api/profile/cars/${id}/photos/${photoId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();

      const car = await res.json();
      setPhotos(car.photos || []);
    } catch {
      showToast("Ошибка удаления фото", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 pt-6 pb-10">
      {/* HEADER */}
      <header>
        <div className="container-wide flex items-center justify-end py-8">
          <button className="p-2 rounded-full invisible">
            <X size={24} />
          </button>
        </div>
      </header>

      {/* TITLE */}
      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-[440px] flex items-center justify-center">
          <button
            onClick={() => navigate(`/${lang}/profile/transport/${id}/edit`)}
            className="absolute left-0 p-2 rounded-lg hover:bg-gray-100"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-[28px] font-semibold">Фото автомобиля</h1>
        </div>
      </div>

      <div className="max-w-[420px] mx-auto">
        <div className="grid grid-cols-2 gap-4 mb-10">
          {photos.map((p) => (
            <div key={p._id} className="relative">
              <img src={p.url} className="w-full h-[140px] object-cover rounded-2xl" />
              <button
                onClick={() => handleRemovePhoto(p._id)}
                className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {photos.length < 10 && (
            <button
              onClick={handlePickPhoto}
              className="w-full h-[140px] rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center text-[32px] text-gray-400 hover:bg-gray-50 transition"
            >
              {saving ? <Loader2 className="animate-spin" /> : "+"}
            </button>
          )}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => e.target.files[0] && handleUploadPhoto(e.target.files[0])}
      />
    </div>
  );
};

export default EditCarPhoto;
