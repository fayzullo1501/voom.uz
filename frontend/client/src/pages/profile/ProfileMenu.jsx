import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import ProfileTopBar from "./ProfileTopBar";
import { useUser } from "../../context/UserContext";

import avatarPlaceholder from "../../assets/avatar-placeholder.svg";
import { LoaderCircle, Car, Loader2, CaseSensitive, Route, Tickets, Bell  } from "lucide-react";

/* ===== Универсальная зелёная галочка (ТОЛЬКО подтверждения) ===== */
const CheckIcon = () => (
  <div className="w-8 h-8 rounded-full bg-[#32BB78] flex items-center justify-center shrink-0">
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
      <path d="M1 6L6 11L15 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

/* ===== ИКОНКА МАШИНЫ (есть авто) ===== */
const CarFront = () => (
  <div className="w-8 h-8 rounded-full bg-[#32BB78] flex items-center justify-center shrink-0">
    <Car className="w-4 h-4 text-white" />
  </div>
);

/* ===== ИКОНКА РЕДАКТИРОВАНИЯ ПРОФИЛЯ ===== */
const EditProfileIcon = () => (
  <div className="w-8 h-8 rounded-full bg-[#32BB78] flex items-center justify-center shrink-0">
    <CaseSensitive className="w-4 h-4 text-white" />
  </div>
);

/* ===== ИКОНКА МОИ МАРШРУТЫ ===== */
const MyRoutesIcon = () => (
  <div className="w-8 h-8 rounded-full bg-[#32BB78] flex items-center justify-center shrink-0">
    <Route className="w-4 h-4 text-white" />
  </div>
);

/* ===== ИКОНКА УВЕДОМЛЕНИЯ ===== */
const NotificationsIcon = () => (
  <div className="w-8 h-8 rounded-full bg-[#32BB78] flex items-center justify-center shrink-0">
    <Bell className="w-4 h-4 text-white" />
  </div>
);

/* ===== ИКОНКА МОИ БРОНИ ===== */
const MyBookingsIcon = () => (
  <div className="w-8 h-8 rounded-full bg-[#32BB78] flex items-center justify-center shrink-0">
    <Tickets className="w-4 h-4 text-white" />
  </div>
);

/* ===== СЕРАЯ ИКОНКА "+" (добавить) ===== */
const PlusIcon = () => (
  <div className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center shrink-0">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" >
      <path d="M7 1V13M1 7H13" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
);

/* ===== ИКОНКА ПРОВЕРКИ"+" (ожидание) ===== */
const PendingIcon = () => (
  <div className="w-8 h-8 rounded-full bg-[#FF8B47] flex items-center justify-center shrink-0">
    <LoaderCircle className="w-4 h-4 text-white animate-spin" />
  </div>
);

/* ===== ИКОНКА ОТКЛОНЕНИЯ ===== */
const RejectedIcon = () => (
  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shrink-0">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M1 1L13 13M13 1L1 13"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

  const ProfileMenu = () => {
  const navigate = useNavigate();
  const { lang } = useParams();

  const { user, cars, loading } = useUser();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate(`/${lang}/login`);
    }
  }, [lang, navigate]);

  const defaultNameByLang = { ru: "Пользователь", uz: "Foydalanuvchi", en: "User" };
  const verifiedLabelByLang = { ru: "Проверенный пользователь", uz: "Tasdiqlangan foydalanuvchi", en: "Verified user" };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-black animate-spin" />
      </div>
    );
  }


  const displayName =
  (user?.firstName || "").trim() ||
  defaultNameByLang[lang] ||
  defaultNameByLang.ru;
  const avatarSrc =
  user?.profilePhoto?.status === "approved"
    ? `${user.profilePhoto.url}?v=${user.profilePhoto.uploadedAt}`
    : avatarPlaceholder;
  const photoStatus = user?.profilePhoto?.status || "empty";
  const passportStatus = user?.passport?.status || "empty";
  const isVerified =
  user?.profilePhoto?.status === "approved" &&
  user?.passport?.status === "approved" &&
  user?.phoneVerified &&
  user?.emailVerified;



  const carsCount = cars.length;

  const singleCarText =
    carsCount === 1
      ? `${cars[0].color?.nameRu || cars[0].customColor} ${cars[0].brand?.name || cars[0].customBrand} ${cars[0].model?.name || cars[0].customModel}`
      : "";

  const carsSubText =
    carsCount === 0
      ? "Добавить машину"
      : carsCount === 1
      ? singleCarText
      : `Машин: ${carsCount}`;

  return (
    <>
      <Header />

      <div className="flex justify-center mt-6 mb-20 px-4">
        <div className="w-full max-w-[550px]">
          {/* ===== Табы ===== */}
          <ProfileTopBar />

          {/* ===== Аватар + имя ===== */}
          <div className="mt-10 flex items-center gap-5">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
              <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = avatarPlaceholder)} />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <span className="text-[36px] font-semibold leading-tight">
                  {displayName}
                </span>
              </div>

              {isVerified ? (
                <div className="mt-2 inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium w-fit">
                  <span>{verifiedLabelByLang[lang] || verifiedLabelByLang.ru}</span>
                </div>
              ) : (
                <div className="mt-2 inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium w-fit">
                  <span>Не верифицирован</span>
                </div>
              )}
            </div>
          </div>

          {/* ===== Редактировать профиль ===== */}
          <div
            onClick={() => navigate(`/${lang}/profile/edit`)}
            className="mt-8 flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
          >
            <EditProfileIcon />
            <span className="text-[16px] font-medium text-gray-700">
              Редактировать информацию о себе
            </span>
          </div>

          <div className="mt-8 border-t border-gray-300" />

          {/* ===== Подтверждение профиля ===== */}
          <div className="mt-8">
            <h3 className="font-bold text-[20px] mb-5">Подтвердите свой профиль</h3>

            <div
              onClick={() => navigate(`/${lang}/profile/photo`)}
              className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
            >
              {photoStatus === "approved" && <CheckIcon />}
              {photoStatus === "pending" && <PendingIcon />}
              {photoStatus === "rejected" && <RejectedIcon />}
              {photoStatus === "empty" && <PlusIcon />}

              <span className="text-[16px] font-medium">
                {photoStatus === "approved" && "Фото профиля подтверждено"}
                {photoStatus === "pending" && "Фото на проверке"}
                {photoStatus === "empty" && "Добавить фото профиля"}

                {photoStatus === "rejected" && (
                  <>
                    Фото профиля отклонено
                    {user?.profilePhoto?.rejectionReason && (
                      <span className="ml-2 text-[14px] text-red-600 font-normal">
                        (Причина: {user.profilePhoto.rejectionReason})
                      </span>
                    )}
                  </>
                )}
              </span>
            </div>



            <div
              onClick={() => navigate(`/${lang}/profile/passport-verification`)}
              className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
            >
              {passportStatus === "approved" && <CheckIcon />}
              {passportStatus === "pending" && <PendingIcon />}
              {passportStatus === "rejected" && <RejectedIcon />}
              {passportStatus === "empty" && <PlusIcon />}

              <span className="text-[16px] font-medium">
                {passportStatus === "approved" && "Паспорт подтверждён"}
                {passportStatus === "pending" && "Паспорт на проверке"}
                {passportStatus === "empty" && "Загрузить паспортные данные"}

                {passportStatus === "rejected" && (
                  <>
                    Паспорт отклонён
                    {user?.passport?.rejectionReason && (
                      <span className="ml-2 text-[14px] text-red-600 font-normal">
                        (Причина: {user.passport.rejectionReason})
                      </span>
                    )}
                  </>
                )}
              </span>
            </div>

            <div
              onClick={() => {
                if (!user?.phone) {
                  navigate(`/${lang}/profile/edit`);
                } else if (!user.phoneVerified) {
                  navigate(`/${lang}/profile/phone-verification`);
                }
              }}
              className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
            >
              {user?.phone && user.phoneVerified && <CheckIcon />}
              {(!user?.phone || !user.phoneVerified) && <PlusIcon />}

              <span className="text-[16px] font-medium">
                {user?.phone && user.phoneVerified && (
                  <>Тел. номер подтверждён&nbsp;+998 {user.phone}</>
                )}

                {user?.phone && !user.phoneVerified && (
                  <>Подтвердите номер телефона&nbsp;+998 {user.phone}</>
                )}

                {!user?.phone && <>Добавить номер телефона</>}
              </span>
            </div>

            <div
              onClick={() => {
                if (!user?.email) {
                  navigate(`/${lang}/profile/edit`);
                } else if (!user.emailVerified) {
                  navigate(`/${lang}/profile/email-verification`);
                }
              }}
              className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
            >
              {user?.email && user.emailVerified && <CheckIcon />}
              {(!user?.email || !user.emailVerified) && <PlusIcon />}

              <span className="text-[16px] font-medium">
                {user?.email && user.emailVerified && (
                  <>Email подтверждён&nbsp;{user.email}</>
                )}

                {user?.email && !user.emailVerified && (
                  <>Подтвердите email&nbsp;{user.email}</>
                )}

                {!user?.email && <>Добавить email</>}
              </span>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-300" />

          {/* ===== Маршруты и брони ===== */}
          <div className="mt-8">
            <h3 className="font-bold text-[20px] mb-5">Маршруты и брони</h3>

            <div onClick={() => navigate(`/${lang}/profile/bookings`)} className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 cursor-pointer transition">
              <MyBookingsIcon />
              <span className="text-[16px] font-medium">Мои бронирования</span>
            </div>

            <div onClick={() => navigate(`/${lang}/profile/routes`)} className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 cursor-pointer transition">
              <MyRoutesIcon />
              <span className="text-[16px] font-medium">Мои маршруты</span>
            </div>

            <div onClick={() => navigate(`/${lang}/profile/notifications`)} className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 cursor-pointer transition">
              <NotificationsIcon />
              <span className="text-[16px] font-medium">Уведомления</span>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-300" />

          {/* ===== Машины ===== */}
          <div className="mt-8 mb-10">
            <h3 className="font-bold text-[20px] mb-2">Мои автомобили</h3>

            <div
              onClick={() =>
                cars.length
                  ? navigate(`/${lang}/profile/transport`)
                  : navigate(`/${lang}/profile/transport/add`)
              }
              className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
            >
              {cars.length ? <CarFront /> : <PlusIcon />}

              <div className="text-[16px] text-gray-700 leading-tight">
                {carsSubText}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileMenu;
