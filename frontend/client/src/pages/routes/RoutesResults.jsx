import React, { useState, useEffect } from "react";
import Header from "../../components/layout/Header";
import RoutesSearch from "../../components/routes/RoutesSearch";
import RoutesFilters from "../../components/routes/RoutesFilters";
import { ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL;

const RoutesResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();

  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [sort, setSort] = useState("early");
  const [timeFilters, setTimeFilters] = useState({
    before6: false,
    morning: false,
    day: false,
    after18: false,
  });
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [activeImage, setActiveImage] = useState({});

  const toggleTime = (key) =>
    setTimeFilters((p) => ({ ...p, [key]: !p[key] }));

  const changeImage = (routeId, direction, total) => {
    setActiveImage((prev) => {
      const current = prev[routeId] || 0;
      const next =
        direction === "next"
          ? (current + 1) % total
          : (current - 1 + total) % total;

      return { ...prev, [routeId]: next };
    });
  };

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${API_URL}/api/routes/search${location.search}`
        );

        if (!res.ok) {
          throw new Error("Failed to load routes");
        }

        const data = await res.json();
        setRoutes(data);
      } catch (err) {
        console.error("Routes load error:", err);
        setError("Ошибка загрузки маршрутов");
      } finally {
        setLoading(false);
      }
    };

    if (location.search) {
      fetchRoutes();
    }
  }, [location.search]);

  const formatDate = (date) =>
    new Date(date).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatPrice = (num) =>
    new Intl.NumberFormat("ru-RU").format(num);

  // ================= FILTER + SORT LOGIC =================

  const getMinPrice = (route) =>
    Math.min(
      route.priceFront ?? Infinity,
      route.priceBack ?? Infinity
    );

  const filteredRoutes = routes
    // FILTER VERIFIED
    .filter((route) =>
      verifiedOnly
        ? route.driver?.passport?.status === "approved" &&
          route.driver?.profilePhoto?.status === "approved" &&
          route.driver?.phoneVerified === true
        : true
    )
    // FILTER TIME
    .filter((route) => {
      const hour = new Date(route.departureAt).getHours();

      const activeFilters = Object.values(timeFilters).some(Boolean);

      if (!activeFilters) return true;

      if (timeFilters.before6 && hour < 6) return true;
      if (timeFilters.morning && hour >= 6 && hour < 12) return true;
      if (timeFilters.day && hour >= 12 && hour < 18) return true;
      if (timeFilters.after18 && hour >= 18) return true;

      return false;
    })
    // SORT
    .sort((a, b) => {
      if (sort === "early")
        return new Date(a.departureAt) - new Date(b.departureAt);

      if (sort === "late")
        return new Date(b.departureAt) - new Date(a.departureAt);

      if (sort === "cheap")
        return getMinPrice(a) - getMinPrice(b);

      if (sort === "expensive")
        return getMinPrice(b) - getMinPrice(a);

      return 0;
    });

    const verifiedCount = routes.filter(
      (r) =>
        r.driver?.passport?.status === "approved" &&
        r.driver?.profilePhoto?.status === "approved" &&
        r.driver?.phoneVerified === true
    ).length;

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Header />

      {/* ================= MOBILE SEARCH BAR ================= */}
      <div className="md:hidden px-4 mt-4">
        <div
          className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center justify-between"
          onClick={() => setMobileSearchOpen(true)}
        >
          <div>
            <div className="text-[15px] font-semibold">
              {filteredRoutes[0]?.fromCity?.nameRu || ""} →
              {filteredRoutes[0]?.toCity?.nameRu || ""}
            </div>
            <div className="text-[13px] text-gray-500">
              {filteredRoutes.length} результатов
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMobileFiltersOpen(true);
            }}
            className="text-[#32BB78] font-semibold text-[15px]"
          >
            Фильтровать
          </button>
        </div>
      </div>

      {/* ================= DESKTOP SEARCH ================= */}
      <div className="hidden md:block">
        <RoutesSearch key={location.search} />
      </div>

      {/* ================= DESKTOP CONTENT ================= */}
      <div className="container-wide mt-8 hidden md:flex gap-10 h-[calc(100vh-260px)]">
        <div className="w-[300px] shrink-0">
          <RoutesFilters
            routes={routes}
            sort={sort}
            setSort={setSort}
            timeFilters={timeFilters}
            toggleTime={toggleTime}
            verifiedOnly={verifiedOnly}
            setVerifiedOnly={setVerifiedOnly}
            verifiedCount={verifiedCount}
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
          <div className="text-[20px] font-semibold mb-6">
            {filteredRoutes.length} результатов
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-[#000] animate-spin" />
            </div>
          )}

          {error && (
            <div className="text-center py-10 text-red-500">
              {error}
            </div>
          )}

          {!loading && filteredRoutes.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              Маршруты не найдены
            </div>
          )}

          <div className="space-y-4">
            {filteredRoutes.map((route) => (
              <div
                key={route._id}
                onClick={() => navigate(`/${i18n.language}/routes/${route._id}`)}
                className="border border-gray-200 rounded-[18px] p-4 flex gap-6 hover:bg-gray-50 transition cursor-pointer"
              >
                {/* IMAGE BLOCK */}
                <div className="relative w-[260px] h-[160px] rounded-[14px] overflow-hidden shrink-0">
                  {route.car?.photos?.length > 0 ? (
                    <img
                      src={route.car.photos[activeImage[route._id] || 0].url}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}

                  {route.car?.photos?.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          changeImage(
                            route._id,
                            "prev",
                            route.car.photos.length
                          );
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center"
                      >
                        <ChevronLeft className="w-4 h-4 text-white" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          changeImage(
                            route._id,
                            "next",
                            route.car.photos.length
                          );
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center"
                      >
                        <ChevronRight className="w-4 h-4 text-white" />
                      </button>
                      {/* DOTS */}
                      {route.car?.photos?.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                          {(() => {
                            const total = route.car.photos.length;
                            const current = activeImage[route._id] || 0;

                            // если 2 фото — 2 точки
                            if (total === 2) {
                              return [0, 1].map((i) => (
                                <span
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    current === i ? "bg-white" : "bg-white/50"
                                  }`}
                                />
                              ));
                            }

                            // если 3 и меньше — обычное отображение
                            if (total === 3) {
                              return [0, 1, 2].map((i) => (
                                <span
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    current === i ? "bg-white" : "bg-white/50"
                                  }`}
                                />
                              ));
                            }

                            // если больше 3 — показываем 3 точки
                            if (total > 3) {
                              return [0, "middle", total - 1].map((pos, idx) => {
                                let active = false;

                                if (pos === 0 && current === 0) active = true;
                                else if (pos === total - 1 && current === total - 1)
                                  active = true;
                                else if (
                                  pos === "middle" &&
                                  current > 0 &&
                                  current < total - 1
                                )
                                  active = true;

                                return (
                                  <span
                                    key={idx}
                                    className={`w-2 h-2 rounded-full ${
                                      active ? "bg-white" : "bg-white/50"
                                    }`}
                                  />
                                );
                              });
                            }

                            return null;
                          })()}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* CONTENT */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[18px] font-semibold">
                        Выезд {formatDate(route.departureAt)}
                      </div>

                      <div className="mt-2 flex items-center gap-6">
                        <div>
                          <div className="font-semibold">
                            {route.fromCity?.nameRu}
                          </div>
                          <div className="text-gray-500 text-[14px]">
                            {route.fromCity?.region}
                          </div>
                        </div>

                        <div className="text-[22px] text-gray-700">
                          →
                        </div>

                        <div>
                          <div className="font-semibold">
                            {route.toCity?.nameRu}
                          </div>
                          <div className="text-gray-500 text-[14px]">
                            {route.toCity?.region}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[14px] font-semibold">
                        от{" "}
                        <span className="text-[26px] font-bold">
                          {formatPrice(
                            Math.min(
                              route.priceFront ?? Infinity,
                              route.priceBack ?? Infinity
                            )
                          )}
                        </span>
                        сум
                      </div>

                      <div className="text-gray-500 text-[14px]">
                        {route.availableSeatsFront +
                          route.availableSeatsBack}{" "}
                        свободных мест
                      </div>
                    </div>
                  </div>

                  <div className="h-[1px] bg-gray-200 my-4" />

                  <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3">
                      {route.car?.brand?.logo?.url && (
                        <img
                          src={route.car.brand.logo.url}
                          alt="brand"
                          className="w-10 h-10 object-contain"
                        />
                      )}

                      <div>
                        <div className="font-semibold">
                          {route.car?.brand?.name ||
                            route.car?.customBrand}{" "}
                          {route.car?.model?.name ||
                            route.car?.customModel}
                        </div>
                        <div className="text-[14px]">
                          {route.car?.plateNumber}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {route.driver?.profilePhoto?.url && (
                        <img
                          src={route.driver.profilePhoto.url}
                          alt="driver"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}

                      <div>
                        <div className="font-semibold">
                          {route.driver?.firstName}{" "}
                          {route.driver?.lastName}
                        </div>
                        <div className="text-[14px]">
                          {route.driver?.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= MOBILE RESULTS ================= */}
      <div className="md:hidden px-4 mt-4 space-y-4">
        {filteredRoutes.map((route) => (
          <div
            key={route._id}
            onClick={() => navigate(`/${i18n.language}/routes/${route._id}`)}
            className="border border-gray-200 rounded-2xl p-4 bg-white cursor-pointer"
          >
            <div className="flex justify-between">
              <div className="font-semibold">
                {formatDate(route.departureAt)}
              </div>
              {formatPrice(
                Math.min(
                  route.priceFront ?? Infinity,
                  route.priceBack ?? Infinity
                )
              )} сум
            </div>

            <div className="text-gray-500 text-[14px]">
              {route.fromCity?.nameRu} → {route.toCity?.nameRu}
            </div>

            <div className="mt-1 text-[14px] text-gray-600">
              {route.car?.brand?.name ||
                route.car?.customBrand}{" "}
              {route.car?.model?.name ||
                route.car?.customModel} ·{" "}
              {route.availableSeatsFront +
                route.availableSeatsBack}{" "}
              мест
            </div>
          </div>
        ))}
      </div>

      {/* ================= MOBILE SEARCH MODAL ================= */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <div className="p-4 flex justify-end">
            <button onClick={() => setMobileSearchOpen(false)}>
              <X className="w-7 h-7" />
            </button>
          </div>
          <RoutesSearch
            key={location.search}
            isMobileModal
            onClose={() => setMobileSearchOpen(false)}
          />
        </div>
      )}

      {/* ================= MOBILE FILTER MODAL ================= */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <div className="p-4 flex justify-end">
            <button onClick={() => setMobileFiltersOpen(false)}>
              <X className="w-7 h-7" />
            </button>
          </div>

          <div className="px-4 pb-4">
            <RoutesFilters
              routes={routes}
              sort={sort}
              setSort={setSort}
              timeFilters={timeFilters}
              toggleTime={toggleTime}
              verifiedOnly={verifiedOnly}
              setVerifiedOnly={setVerifiedOnly}
              verifiedCount={verifiedCount}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutesResults;