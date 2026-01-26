import React, { useState } from "react";
import { API_URL } from "../../config/api";
import { useToast } from "../ui/useToast";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import passportExample from "../../assets/passport-example.svg";

const PassportVerification = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!file || loading) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/api/auth/profile/passport`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("upload_failed");

      showToast("Паспорт успешно отправлен на проверку", "success");

      navigate(-1);
    } catch (err) {
      showToast("Не удалось загрузить паспорт", "error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-white px-6 pt-6 pb-12 flex flex-col">

      {/* ===== Header (X) ===== */}
      <header>
        <div className="container-wide flex items-center justify-end">
           <button onClick={() => navigate(-1)} className=" p-3 rounded-full hover:bg-gray-100 transition flex items-center justify-center ">
            <X className="w-6 h-6 text-gray-700 hover:text-black transition" />
          </button>
        </div>
      </header>

      {/* ===== Title ===== */}
      <h1 className="text-[28px] sm:text-[32px] font-semibold text-center mt-6 mb-10">
        Проверить паспорт
      </h1>

      {/* ===== Content ===== */}
      <div className="flex-1 flex flex-col items-center text-center">

        {/* Passport example */}
        <img
          src={passportExample}
          alt="Passport example"
          className="w-full max-w-[360px] mb-8"
        />

        {/* Description */}
        <p className="text-[16px] text-gray-700 mb-12">
          Загрузите скан или фото паспорта
        </p>

        {file && (
          <div className="mb-6 text-[14px] text-black  text-center">
            Выбран файл: <span className="font-semibold">{file.name}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">

          {/* Select file */}
          <label
            className="
              px-8 py-3
              border border-gray-400
              rounded-xl
              text-[16px]
              font-medium
              cursor-pointer
              hover:bg-gray-50
              transition
            "
          >
            Выбрать файл
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>

          {/* Submit */}
          <button
            onClick={submit}
            disabled={!file || loading}
            className="px-10 py-3 rounded-xl bg-[#32BB78] text-white text-[16px] font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Отправка..." : "Отправить"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default PassportVerification;
