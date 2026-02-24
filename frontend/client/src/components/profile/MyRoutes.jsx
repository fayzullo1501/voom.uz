import React, { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import walletIcon from "../../assets/icons/wallet.svg";
import userIcon from "../../assets/icons/user.svg";
import { API_URL } from "../../config/api";

const MyRoutes = () => {
  const navigate = useNavigate();
  const { lang } = useParams();

  const [tab, setTab] = useState("active");
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchRoutes = async (type) => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/api/routes?type=${type}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setRoutes([]);
        return;
      }

      setRoutes(data);
    } catch (error) {
      console.error("Failed to load routes", error);
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes(tab);
  }, [tab]);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString("ru-RU", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTotalEarned = (route) => {
    if (!route.bookings) return "0 сум";

    const total = route.bookings
      .filter((b) => b.status === "accepted")
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    return `${total.toLocaleString()} сум`;
  };

  const getAcceptedPassengers = (route) => {
    if (!route.bookings) return 0;

    return route.bookings
      .filter((b) => b.status === "accepted")
      .reduce((sum, b) => sum + (b.seatsCount || 0), 0);
  };

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 pb-10 flex flex-col">
      {/* ===== Header ===== */}
      <header>
        <div className="container-wide flex items-center justify-end py-6 sm:py-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Закрыть"
          >
            <X size={24} className="text-gray-700" />
          </button>
        </div>
      </header>

      {/* ===== Title ===== */}
      <h1 className="text-[24px] sm:text-[32px] font-semibold text-center mb-6 sm:mb-8">
        Мои маршруты
      </h1>

      {/* ===== Tabs ===== */}
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-[760px] relative">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200" />
          <div className="flex gap-8">
            {[
              { id: "active", label: "Активные" },
              { id: "archive", label: "Архив" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`relative pb-3 text-[16px] transition ${
                  tab === item.id
                    ? "text-black font-medium"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {item.label}
                {tab === item.id && (
                  <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-black rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Content ===== */}
      <div className="flex justify-center">
        <div className="w-full max-w-[760px]">

          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
            </div>
          )}

          {!loading && routes.length === 0 && (
            <div className="text-center text-gray-500 py-20">
              Маршрутов пока нет
            </div>
          )}

          {!loading && routes.length > 0 && (
            <div className="flex flex-col gap-4">
              {routes.map((route) => (
                <div
                  key={route._id}
                  onClick={() =>
                    navigate(`/${lang}/profile/routes/${route._id}`)
                  }
                  className="border border-gray-200 rounded-2xl px-4 sm:px-6 py-5 hover:bg-gray-50 transition cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                    {/* ===== Route Info ===== */}
                    <div className="flex flex-col md:flex-row md:items-center gap-6 flex-1">
                      <div>
                        <div className="text-[20px] font-semibold uppercase">
                          {route.fromName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {route.fromCity?.region}, Узбекистан
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(route.departureAt)}
                        </div>
                      </div>

                      <span className="hidden md:block text-xl">→</span>
                      <span className="md:hidden text-gray-400 text-xl">↓</span>

                      <div>
                        <div className="text-[20px] font-semibold uppercase">
                          {route.toName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {route.toCity?.region}, Узбекистан
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {route.arrivalAt
                            ? formatDate(route.arrivalAt)
                            : "—"}
                        </div>
                      </div>
                    </div>

                    {/* ===== Divider ===== */}
                    <div className="hidden md:block w-px h-16 bg-gray-200" />
                    <div className="md:hidden h-px bg-gray-200" />

                    {/* ===== Right Info ===== */}
                    <div className="flex flex-row md:flex-col gap-4 md:gap-2 md:min-w-[150px] justify-between md:justify-start">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <img
                          src={walletIcon}
                          alt="Сумма"
                          className="w-5 h-5 opacity-70"
                        />
                        {getTotalEarned(route)}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <img
                          src={userIcon}
                          alt="Места"
                          className="w-5 h-5 opacity-60"
                        />
                        {getAcceptedPassengers(route)} пассажиров
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MyRoutes;