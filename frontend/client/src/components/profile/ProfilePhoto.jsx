import React, { useRef, useState } from "react";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ProfilePhoto = () => {
  const navigate = useNavigate();
  const { lang } = useParams();
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");

  const handleFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Поддерживаются только JPG, PNG или WEBP");
      return;
    }

    if (file.size > MAX_SIZE) {
      setError("Размер файла не должен превышать 5 МБ");
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      sessionStorage.setItem("profilePhoto", reader.result);
      navigate(`/${lang}/profile/photo/edit`);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-white px-6 pt-6 pb-10 flex flex-col">
      <header>
        <div className="container-wide flex items-center justify-end">
          <button onClick={() => navigate(-1)} className="p-3 rounded-full hover:bg-gray-100 transition flex items-center justify-center">
            <X className="w-6 h-6 text-gray-700 hover:text-black transition" />
          </button>
        </div>
      </header>

      <h1 className="text-[32px] sm:text-[36px] font-semibold text-center mt-4">
        Фото профиля
      </h1>

      <input ref={fileInputRef} type="file" accept="image/*" capture="user" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); e.target.value = ""; }} />

      <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-2 border-dashed border-gray-300 mb-10 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Выберите фото</span>
        </div>

        <p className="text-[18px] sm:text-[20px] font-semibold text-gray-800 leading-snug max-w-[420px]">
          Фотографируйтесь одни,
          <br />
          снимите солнечные очки
          <br />
          и смотрите прямо перед собой.
        </p>

        {error && <div className="mt-6 text-[14px] text-red-600">{error}</div>}

        <button onClick={() => fileInputRef.current?.click()} className="mt-10 px-10 py-3 rounded-xl text-white text-[17px] font-medium bg-[#32BB78] hover:opacity-90 transition">
          Выбрать фото
        </button>
      </div>
    </div>
  );
};

export default ProfilePhoto;
