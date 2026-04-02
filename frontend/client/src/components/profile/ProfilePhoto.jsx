import React, { useRef, useState } from "react";
import { X, Camera, ImageIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ProfilePhoto = () => {
  const navigate = useNavigate();
  const { lang } = useParams();
  const { t } = useTranslation("profile");

  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const [error, setError] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(t("photo.invalidType"));
      return;
    }

    if (file.size > MAX_SIZE) {
      setError(t("photo.invalidSize"));
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

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
    setSheetOpen(false);
  };

  return (
    <div className="min-h-screen bg-white px-6 pt-6 pb-10 flex flex-col">
      <header>
        <div className="container-wide flex items-center justify-end">
          <button
            onClick={() => navigate(`/${lang}/profile/menu`)}
            className="p-3 rounded-full hover:bg-gray-100 transition flex items-center justify-center"
          >
            <X className="w-6 h-6 text-gray-700 hover:text-black transition" />
          </button>
        </div>
      </header>

      <h1 className="text-[32px] sm:text-[36px] font-semibold text-center mt-4">
        {t("photo.title")}
      </h1>

      {/* Hidden inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onFileChange}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />

      <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-2 border-dashed border-gray-300 mb-10 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">{t("photo.choose")}</span>
        </div>

        <p className="text-[18px] sm:text-[20px] font-semibold text-gray-800 leading-snug max-w-[420px]">
          {t("photo.instructions.line1")}
          <br />
          {t("photo.instructions.line2")}
          <br />
          {t("photo.instructions.line3")}
        </p>

        {error && (
          <div className="mt-6 text-[14px] text-red-600">{error}</div>
        )}

        <button
          onClick={() => setSheetOpen(true)}
          className="mt-10 px-10 py-3 rounded-xl text-white text-[17px] font-medium bg-[#32BB78] hover:opacity-90 transition"
        >
          {t("photo.button")}
        </button>
      </div>

      {/* Bottom sheet */}
      {sheetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
          onClick={() => setSheetOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-t-2xl pb-8 pt-4 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* handle */}
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-6" />

            <button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-gray-100 transition text-left"
            >
              <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Camera size={22} className="text-gray-700" />
              </div>
              <span className="text-[17px] font-medium">{t("photo.takePhoto")}</span>
            </button>

            <button
              onClick={() => galleryInputRef.current?.click()}
              className="w-full flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-gray-100 transition text-left"
            >
              <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <ImageIcon size={22} className="text-gray-700" />
              </div>
              <span className="text-[17px] font-medium">{t("photo.chooseFromGallery")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePhoto;
