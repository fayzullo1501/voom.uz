import React, { useState } from "react";
import { CheckCheck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_URL } from "../../config/api";

const NotificationsPanel = ({ notifications, setNotifications, setUnreadCount }) => {

  const navigate = useNavigate();
  const { lang } = useParams();
  const { t } = useTranslation("layout");

  const [tab, setTab] = useState("active");

  const formatTime = (date) => {

    const diff = Math.floor((Date.now() - new Date(date)) / 1000);

    if (diff < 60) return t("notifications.justNow");
    if (diff < 3600) return `${Math.floor(diff / 60)} ${t("notifications.minAgo")}`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ${t("notifications.hourAgo")}`;

    return new Date(date).toLocaleDateString();

  };

  const openNotification = async (notification) => {

    try {

      const token = localStorage.getItem("token");

      await fetch(`${API_URL}/api/notifications/${notification._id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updated = notifications.map((n) =>
        n._id === notification._id ? { ...n, read: true } : n
      );

      setNotifications(updated);

      const unread = updated.filter((n) => !n.read).length;
      setUnreadCount(unread);

      if (notification.type === "new_booking") {
        navigate(`/${lang}/profile/routes/${notification.routeId}`);
      }

      else if (notification.bookingId) {
        navigate(`/${lang}/profile/bookings/${notification.bookingId}`);
      }

      else if (notification.routeId) {
        navigate(`/${lang}/routes/${notification.routeId}`);
      }

    } catch (error) {
      console.error("notification open error", error);
    }

  };

  const filtered = notifications.filter((n) => {
    if (tab === "archive") return n.read;
    return !n.read;
  });

  return (
    <div className="fixed right-4 left-4 lg:left-auto lg:right-[40px] top-[80px] lg:top-[90px] lg:w-[480px] bg-white rounded-2xl shadow-xl border border-gray-200 z-[100] animate-[fadeIn_0.15s_ease]">

      {/* header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">

        <div className="text-[18px] font-semibold">
          {t("notifications.title")}
        </div>

        <button
          onClick={() => {

            const updated = notifications.map((n) => ({ ...n, read: true }));

            setNotifications(updated);
            setUnreadCount(0);

          }}
          className="flex items-center gap-2 text-[14px] text-gray-600 hover:text-gray-900"
          >

          <CheckCheck size={16} />

          <span>
            {t("notifications.markAllRead")}
          </span>

        </button>

      </div>

      {/* tabs */}
      <div className="flex gap-6 px-5 border-b border-gray-200">

        <button
          onClick={() => setTab("active")}
          className={`pb-3 text-[14px] ${
            tab === "active"
              ? "font-semibold border-b-2 border-black"
              : "text-gray-500"
          }`}
        >
          {t("notifications.tabs.active")}
        </button>

        <button
          onClick={() => setTab("archive")}
          className={`pb-3 text-[14px] ${
            tab === "archive"
              ? "font-semibold border-b-2 border-black"
              : "text-gray-500"
          }`}
        >
          {t("notifications.tabs.archive")}
        </button>

      </div>

      {/* notifications list */}
      <div className="max-h-[420px] overflow-y-auto">

        {filtered.length === 0 ? (

          <div className="h-[220px] flex items-center justify-center text-gray-400 text-[14px]">
            {t("notifications.empty")}
          </div>

        ) : (

          filtered.map((n) => (
            <div
              key={n._id}
              onClick={() => openNotification(n)}
              className="relative px-5 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            >

              {/* текст */}
              <div className="pr-6">

                <div className="text-[14px] font-medium">
                  {n.title}
                </div>

                {n.route && (
                  <div className="text-[13px] text-gray-500 mt-1">
                    {n.route.from} → {n.route.to}
                  </div>
                )}

                <div className="text-[12px] text-gray-400 mt-2">
                  {formatTime(n.createdAt)}
                </div>

              </div>

              {/* индикатор непрочитанного */}
              {!n.read && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              )}

            </div>
          ))

        )}

      </div>

    </div>
  );
};

export default NotificationsPanel;