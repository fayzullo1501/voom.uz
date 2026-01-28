import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useToast } from "../../components/ui/useToast";
import uzFlag from "../../assets/uz-flag.svg";
import { API_URL } from "../../config/api";

const formatDateToInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatInputToISO = (value) => {
  if (!value) return null;
  const [day, month, year] = value.split("/");
  if (!day || !month || !year) return null;
  return `${year}-${month}-${day}`;
};

const formatBirthDateInput = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

const formatPhoneView = (value) => {
  if (!value) return "";
  const v = value.replace(/\D/g, "").slice(0, 9);

  const p1 = v.slice(0, 2);
  const p2 = v.slice(2, 5);
  const p3 = v.slice(5, 7);
  const p4 = v.slice(7, 9);

  return [p1, p2, p3, p4].filter(Boolean).join(" ");
};



const EditProfileInfo = () => {
  const navigate = useNavigate();
  const { lang } = useParams();
  const { t } = useTranslation("profile");
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [about, setAbout] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(null);

  const [initialState, setInitialState] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate(`/${lang}/login`);
      return;
    }

    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const formattedBirthDate = data.birthDate ? formatDateToInput(data.birthDate) : "";

        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setBirthDate(formattedBirthDate);
        setAbout(data.about || "");
        setPhone(data.phone || "");
        setEmail(data.email);

        setInitialState({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          birthDate: formattedBirthDate,
          about: data.about || "",
          email: data.email || "",
          phone: data.phone || "",
        });


        setLoading(false);
      });
  }, [lang, navigate]);

  const hasChanges =
    initialState &&
    (
      firstName !== initialState.firstName ||
      lastName !== initialState.lastName ||
      birthDate !== initialState.birthDate ||
      about !== initialState.about ||
      email !== initialState.email ||
      phone !== initialState.phone
    );



  const handleSave = async () => {
    const token = localStorage.getItem("token");
    setSaving(true);

    try {
      const payload = {
        firstName,
        lastName,
        birthDate: formatInputToISO(birthDate),
        about,
      };

      if (email !== initialState.email) {
        payload.email = email;
      }

      if (phone !== initialState.phone) {
        payload.phone = phone;
      }

      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        showToast(t("edit.error"), "error");
        setSaving(false);
        return;
      }

      showToast(t("edit.success"), "success");
      navigate(-1);
    } catch {
      showToast(t("edit.error"), "error");
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white px-6 pt-6 pb-10">
      <header className="flex justify-end">
        <button onClick={() => navigate(-1)} className="p-3 rounded-full hover:bg-gray-100 transition">
          <X className="w-6 h-6 text-gray-700" />
        </button>
      </header>

      <h1 className="text-[36px] font-medium text-center mb-10">
        {t("edit.title")}
      </h1>

      <div className="max-w-[520px] mx-auto flex flex-col gap-6">
        <div>
          <span className="text-gray-500 text-[15px]">{t("edit.firstName")}</span>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={t("edit.firstNamePlaceholder")} className="w-full text-[18px] font-medium mt-1 outline-none placeholder:text-gray-400" />
        </div>

        <div>
          <span className="text-gray-500 text-[15px]">{t("edit.lastName")}</span>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={t("edit.lastNamePlaceholder")} className="w-full text-[18px] font-medium mt-1 outline-none placeholder:text-gray-400" />
        </div>

        <div>
          <span className="text-gray-500 text-[15px]">{t("edit.birthDate")}</span>
          <input value={birthDate} onChange={(e) => setBirthDate(formatBirthDateInput(e.target.value))} placeholder={t("edit.birthDatePlaceholder")} inputMode="numeric" className="w-full text-[18px] font-medium mt-1 outline-none placeholder:text-gray-400" />
        </div>

        <div>
          <span className="text-gray-500 text-[15px]">{t("edit.email")}</span>
          <input
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("edit.emailPlaceholder")}
            className={`w-full text-[18px] font-medium mt-1 outline-none placeholder:text-gray-400`}
          />
        </div>


        <div>
          <span className="text-gray-500 text-[15px]">{t("edit.phone")}</span>
          <div className="flex items-center gap-2 mt-1">
            <img src={uzFlag} alt="UZ" className="w-5 h-5 rounded-sm" />
            <span className="text-[18px] font-medium">+998</span>
            <input
              value={formatPhoneView(phone)} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))} placeholder={t("edit.phonePlaceholder")} inputMode="numeric" className="w-full text-[18px] font-medium outline-none placeholder:text-gray-400" />
          </div>
        </div>


        <div>
          <span className="text-gray-500 text-[15px]">{t("edit.about")}</span>
          <textarea value={about} onChange={(e) => setAbout(e.target.value)} placeholder={t("edit.aboutPlaceholder")} rows={2} className="w-full text-[18px] font-medium mt-1 outline-none resize-none placeholder:text-gray-400" />
        </div>

        {hasChanges && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#32BB78] text-white rounded-xl h-[52px] text-[17px] font-semibold hover:bg-[#2aa86e] disabled:opacity-70 flex items-center justify-center"
          >
            {saving ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              t("edit.save")
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default EditProfileInfo;
