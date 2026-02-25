import React, { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { useNavigate, useParams } from "react-router-dom";
import { X, RotateCcw, Plus, Minus } from "lucide-react";

import { API_URL } from "../../config/api";
import { useToast } from "../ui/useToast";

/* ===== ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ОБРЕЗКИ ===== */
const getCroppedImage = async (imageSrc, croppedAreaPixels) => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

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

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.9);
  });
};

const ProfilePhotoEditor = () => {
  const navigate = useNavigate();
  const { lang } = useParams();
  const { showToast } = useToast();

  const imageSrc = sessionStorage.getItem("profilePhoto");

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ===== ЕСЛИ ФОТО НЕТ — РЕДИРЕКТ (ТОЛЬКО В useEffect) ===== */
  useEffect(() => {
    if (!imageSrc) {
      navigate(`/${lang}/profile/menu`, { replace: true });
    }
  }, [imageSrc, navigate, lang]);

  /* ===== СОХРАНЕНИЕ ===== */
  const save = useCallback(async () => {
    try {
      setLoading(true);

      if (!croppedAreaPixels) return;

      const blob = await getCroppedImage(imageSrc, croppedAreaPixels);

      const formData = new FormData();
      formData.append("file", blob, "avatar.jpg");

      const res = await fetch(`${API_URL}/api/auth/profile/photo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("upload_failed");

      sessionStorage.removeItem("profilePhoto");

      showToast("Фото успешно отправлено на проверку", "success");

      navigate(`/${lang}/profile/menu`, { replace: true });
    } catch (e) {
      showToast("Не удалось загрузить фото", "error");
    } finally {
      setLoading(false);
    }
  }, [imageSrc, croppedAreaPixels, navigate, lang, showToast]);

  if (!imageSrc) return null;

  return (
    <div className="min-h-screen bg-white px-6 pt-6 pb-10 flex flex-col">
      {/* ===== HEADER ===== */}
      <header>
        <div className="container-wide flex items-center justify-end">
          <button
            onClick={() => navigate(-1)}
            className="p-3 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </header>

      {/* ===== TITLE ===== */}
      <h1 className="text-[32px] sm:text-[36px] font-semibold text-center mt-4">
        Фото профиля
      </h1>

      {/* ===== CROPPER ===== */}
      <div className="relative mt-8 w-full max-w-[360px] mx-auto h-[360px] bg-black rounded-2xl overflow-hidden">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(croppedArea, croppedAreaPixels) =>
            setCroppedAreaPixels(croppedAreaPixels)
          }
        />
      </div>

      {/* ===== CONTROLS ===== */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
          className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center"
        >
          <Minus className="w-5 h-5 text-gray-700" />
        </button>

        <button
          onClick={() => setRotation((r) => r + 90)}
          className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center"
        >
          <RotateCcw className="w-5 h-5 text-gray-700" />
        </button>

        <button
          onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
          className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center"
        >
          <Plus className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* ===== SAVE BUTTON ===== */}
      <button
        disabled={loading}
        onClick={save}
        className="mt-10 mx-auto px-10 py-3 rounded-xl text-white text-[17px] font-medium bg-[#32BB78] hover:opacity-90 transition disabled:opacity-60"
      >
        {loading ? "Загрузка..." : "Сохранить"}
      </button>
    </div>
  );
};

export default ProfilePhotoEditor;
