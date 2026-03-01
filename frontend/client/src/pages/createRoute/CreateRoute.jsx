import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, ArrowLeftRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";
import { useToast } from "../../components/ui/useToast";


import logo from "../../assets/logo.svg";
import bgImg from "../../assets/crroutebg.jpg";
import qrImg from "../../assets/crrouteqr.svg";

// Модалки
import DateTimeModal from "../../components/createRoute/DateTimeModal";
import SeatsModal from "../../components/createRoute/SeatsModal";
import PriceModal from "../../components/createRoute/PriceModal";
import CityAutocompleteInput from "../../components/createRoute/CityAutocompleteInput";

// -----------------------------
// FLOATING TEXT FIELD
// -----------------------------
const FloatingInput = ({ value, onChange, label }) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="
          peer
          w-full h-[52px] px-4 pt-3 bg-gray-100 
          rounded-xl text-[16px]
          focus:outline-none
        "
      />

      <label
        className={`
          absolute left-4 text-gray-400 pointer-events-none
          transition-all duration-200
          ${value ? "text-[11px] top-1" : "text-[16px] top-1/2 -translate-y-1/2"}
          peer-focus:text-[11px] peer-focus:top-1
        `}
      >
        {label}
      </label>
    </div>
  );
};

// -----------------------------
// CLICKABLE FLOATING BUTTON FIELD
// -----------------------------
const FloatingButtonField = ({ value, label, onClick }) => {
  const hasValue = value && value.length > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        relative w-full h-[52px] bg-gray-100
        rounded-xl px-4 text-left 
        flex items-center
        focus:outline-none
      "
    >
      <span
        className={`
          absolute left-4 transition-all duration-200 text-gray-400
          ${hasValue ? "text-[11px] top-1" : "text-[16px] top-1/2 -translate-y-1/2"}
        `}
      >
        {label}
      </span>

      {hasValue && (
        <span
          className="
            absolute left-4 top-1/2 -translate-y-1/2
            text-[16px] text-gray-900
            max-w-[85%] truncate
          "
        >
          {value}
        </span>
      )}
    </button>
  );
};

// -----------------------------
// MAIN PAGE
// -----------------------------
const CreateRoute = () => {
  const navigate = useNavigate();
  const { lang } = useParams();
  const { t } = useTranslation("createRoute");
  const { showToast } = useToast();

  const [fromCity, setFromCity] = useState(null);
  const [toCity, setToCity] = useState(null);

  const [departureAt, setDepartureAt] = useState(null);
  const [dateModalOpen, setDateModalOpen] = useState(false);

  const [seatsFront, setSeatsFront] = useState(0);
  const [seatsBack, setSeatsBack] = useState(0);

  const [seatsModalOpen, setSeatsModalOpen] = useState(false);

  const [priceFront, setPriceFront] = useState(0);
  const [priceBack, setPriceBack] = useState(0);
  const [priceModalOpen, setPriceModalOpen] = useState(false);

  const [comment, setComment] = useState("");

  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [carsLoading, setCarsLoading] = useState(false);
  const [carDropdownOpen, setCarDropdownOpen] = useState(false);
  const mobileCarRef = useRef(null);
  const desktopCarRef = useRef(null);

  const [agree, setAgree] = useState(false);
  const [creating, setCreating] = useState(false);
  const [bannerLoaded, setBannerLoaded] = useState(false);

  useEffect(() => {
    const loadCars = async () => {
      try {
        setCarsLoading(true);

        const token = localStorage.getItem("token");

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/cars`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setCars([]);
          return;
        }

        const data = await res.json();

        console.log("CARS FROM API:", data);

        const activeCars = data || [];

        setCars(activeCars);

        // если только одна машина — выбрать автоматически
        if (activeCars.length === 1) {
          setSelectedCar(activeCars[0]);
        }

      } catch (err) {
        console.error("Cars load error:", err);
      } finally {
        setCarsLoading(false);
      }
    };

    loadCars();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        mobileCarRef.current &&
        mobileCarRef.current.contains(e.target)
      ) return;

      if (
        desktopCarRef.current &&
        desktopCarRef.current.contains(e.target)
      ) return;

      setCarDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  

  const formatCarName = (car) => {
    if (!car) return "";

    const color = car.color?.nameRu || car.customColor || "";
    const brand = car.brand?.name || car.customBrand || "";
    const model = car.model?.name || car.customModel || "";
    const plate = car.plateNumber || "";

    return `${color} ${brand} ${model} (${plate})`
      .replace(/\s+/g, " ")
      .trim();
  };

  const handleSwapCities = () => {
    if (!fromCity && !toCity) return;

    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleCreateRoute = async () => {
    if (!selectedCar) {
      showToast("Выберите машину", "error");
      return;
    }
    if (creating) return;

    try {
      setCreating(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/routes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            carId: selectedCar?._id,
            fromCityId: fromCity?._id,
            toCityId: toCity?._id,
            departureAt,
            seatsFront,
            seatsBack,
            priceFront,
            priceBack,
            comment: comment.trim(),
          }),
        }
      );

      if (!res.ok) {
        showToast("Ошибка создания маршрута", "error");
        return;
      }

      showToast("Маршрут успешно создан", "success");

      setTimeout(() => {
        navigate(`/${lang}/profile/routes`);
      }, 800);

    } catch (err) {
      showToast("Ошибка сервера", "error");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">

      {/* HEADER */}
      <header className="bg-white">
        <div className="container-wide flex items-center justify-between py-8">
          <img
            src={logo}
            alt="voom"
            className="h-10 cursor-pointer"
            onClick={() => navigate(`/${lang}`)}
          />
          <X
            className="w-6 h-6 text-gray-700 hover:text-black cursor-pointer transition"
            onClick={() => navigate(`/${lang}`)}
          />
        </div>
      </header>

      {/* MAIN */}
      <main className="flex flex-1 items-center">
        <div className="container-wide w-full">
          <div className="flex flex-col lg:flex-row w-full gap-6 pb-8">

            {/* LEFT BLOCK */}
            <div className="w-full lg:w-1/2 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:no-scrollbar">

              <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

              <div className="flex flex-col gap-5">

                {/* MOBILE */}
                <div className="flex flex-col gap-5 lg:hidden">

                  <div className="flex gap-3 items-center">
                     <CityAutocompleteInput
                        label={t("from")}
                        value={fromCity}
                        onSelect={setFromCity}
                      />

                    <button
                      type="button"
                      onClick={handleSwapCities}
                      className="w-[52px] h-[52px] rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                    >
                      <ArrowLeftRight size={20} />
                    </button>
                  </div>

                  <CityAutocompleteInput
                    label={t("to")}
                    value={toCity}
                    onSelect={setToCity}
                  />

                  <FloatingButtonField
                    label={t("dateTime")}
                    value={
                      departureAt
                        ? new Date(departureAt).toLocaleString()
                        : ""
                    }
                    onClick={() => setDateModalOpen(true)}
                  />

                  <FloatingButtonField
                    label={t("seats")}
                    value={
                      seatsFront || seatsBack
                        ? `${seatsFront > 0 ? `${seatsFront} перед` : ""}${
                            seatsFront > 0 && seatsBack > 0 ? " | " : ""
                          }${seatsBack > 0 ? `${seatsBack} зад` : ""}`
                        : ""
                    }
                    onClick={() => setSeatsModalOpen(true)}
                  />

                  <FloatingButtonField
                    label={t("price")}
                    value={
                      priceFront || priceBack
                        ? `${priceFront > 0 ? `${priceFront} сум` : ""}${
                            priceFront > 0 && priceBack > 0 ? " | " : ""
                          }${priceBack > 0 ? `${priceBack} сум` : ""}`
                        : ""
                    }
                    onClick={() => setPriceModalOpen(true)}
                  />

                  <div ref={mobileCarRef} className="relative w-full">
                    <button
                      type="button"
                      onClick={() => setCarDropdownOpen((prev) => !prev)}
                      className="
                        relative w-full h-[52px] bg-gray-100
                        rounded-xl px-4 text-left
                        flex items-center
                        focus:outline-none
                      "
                    >
                      <span
                        className={`
                          absolute left-4 transition-all duration-200 text-gray-400
                          ${selectedCar ? "text-[11px] top-1" : "text-[16px] top-1/2 -translate-y-1/2"}
                        `}
                      >
                        Выберите машину
                      </span>

                      {selectedCar && (
                        <span
                          className="
                            absolute left-4 top-1/2 -translate-y-1/2
                            text-[16px] text-gray-900
                            max-w-[85%] truncate
                          "
                        >
                          {formatCarName(selectedCar)}
                        </span>
                      )}
                    </button>

                    {carDropdownOpen && (
                      <div className="
                        absolute top-[56px] left-0 w-full
                        bg-white border border-gray-200
                        rounded-xl shadow-lg
                        z-50 max-h-[250px] overflow-y-auto
                      ">

                        {carsLoading && (
                          <div className="p-3 text-sm text-gray-500">
                            Загрузка...
                          </div>
                        )}

                        {!carsLoading && cars.length === 0 && (
                          <div className="p-6 text-center text-sm text-gray-500">
                            <div>У вас нет машин</div>
                            <button
                              onClick={() => navigate(`/${lang}/profile/transport/add`)}
                              className="text-blue-600 underline mt-2"
                            >
                              добавьте машину
                            </button>
                          </div>
                        )}

                        {!carsLoading && cars.map((car) => (
                          <div
                            key={car._id}
                            onClick={() => {
                              setSelectedCar(car);
                              setCarDropdownOpen(false);
                            }}
                            className="px-3 py-3 mx-3 my-3 rounded-lg cursor-pointer hover:bg-gray-100 transition text-sm"
                          >
                            {formatCarName(car)}
                          </div>
                        ))}

                      </div>
                    )}
                  </div>

                  <textarea
                    placeholder="Комментарии"
                    value={comment}
                    maxLength={500}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-gray-100 rounded-xl p-4 resize-y min-h-[120px] focus:outline-none"
                  />

                </div>

                {/* DESKTOP */}
                <div className="hidden lg:flex flex-col gap-5">

                  <div className="flex gap-3 items-center w-full">
                    <CityAutocompleteInput
                      label={t("from")}
                      value={fromCity}
                      onSelect={setFromCity}
                    />

                    <button
                      type="button"
                      onClick={handleSwapCities}
                      className="min-w-[52px] min-h-[52px] rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                    >
                      <ArrowLeftRight size={20} />
                    </button>

                    <CityAutocompleteInput
                      label={t("to")}
                      value={toCity}
                      onSelect={setToCity}
                    />
                  </div>

                  <div className="flex gap-3">
                    <FloatingButtonField
                      label={t("dateTime")}
                      value={
                        departureAt
                          ? new Date(departureAt).toLocaleString()
                          : ""
                      }
                      onClick={() => setDateModalOpen(true)}
                    />

                    <FloatingButtonField
                      label={t("seats")}
                      value={
                        seatsFront || seatsBack
                          ? `${seatsFront > 0 ? `${seatsFront} перед` : ""}${
                              seatsFront > 0 && seatsBack > 0 ? " | " : ""
                            }${seatsBack > 0 ? `${seatsBack} зад` : ""}`
                          : ""
                      }
                      onClick={() => setSeatsModalOpen(true)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1">
                    <FloatingButtonField
                      label={t("price")}
                      value={
                        priceFront || priceBack
                          ? `${priceFront > 0 ? `${priceFront} сум` : ""}${
                              priceFront > 0 && priceBack > 0 ? " | " : ""
                            }${priceBack > 0 ? `${priceBack} сум` : ""}`
                          : ""
                      }
                      onClick={() => setPriceModalOpen(true)}
                    />
                    </div>
                    
                    <div ref={desktopCarRef} className="relative flex-1">
                      <button
                        type="button"
                        onClick={() => setCarDropdownOpen((prev) => !prev)}
                        className="
                          relative w-full h-[52px] bg-gray-100
                          rounded-xl px-4 text-left
                          focus:outline-none
                        "
                      >
                        <span
                          className={`
                            absolute left-4 transition-all duration-200 text-gray-400
                            ${selectedCar ? "text-[11px] top-1" : "text-[16px] top-1/2 -translate-y-1/2"}
                          `}
                        >
                          Выберите машину
                        </span>

                        {selectedCar && (
                          <span
                            className="
                              absolute left-4 top-1/2 -translate-y-1/2
                              text-[16px] text-gray-900 pt-3
                              max-w-[85%] truncate
                            "
                          >
                            {formatCarName(selectedCar)}
                          </span>
                        )}
                      </button>

                      {/* DROPDOWN */}
                      {carDropdownOpen && (
                        <div className="
                          absolute top-[56px] left-0 w-full
                          bg-white border border-gray-200
                          rounded-xl
                          z-50 max-h-[250px] overflow-y-auto
                        ">

                          {carsLoading && (
                            <div className="p-3 text-sm text-gray-500">
                              Загрузка...
                            </div>
                          )}

                          {!carsLoading && cars.length === 0 && (
                            <div className="p-6 text-center text-sm text-gray-500">
                              <div>У вас нет машин</div>
                              <button
                                onClick={() => navigate(`/${lang}/profile/transport/add`)}
                                className="text-blue-600 underline mt-2"
                              >
                                добавьте машину
                              </button>
                            </div>
                          )}

                          {!carsLoading && cars.map((car) => (
                            <div
                              key={car._id}
                              onClick={() => {
                                setSelectedCar(car);
                                setCarDropdownOpen(false);
                              }}
                              className="px-3 py-3 mx-3 my-3 rounded-lg cursor-pointer hover:bg-gray-100 transition text-sm"
                            >
                              {formatCarName(car)}
                            </div>
                          ))}

                        </div>
                      )}
                    </div>
                    
                  </div>

                  <textarea
                    placeholder="Комментарии"
                    value={comment}
                    maxLength={500}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-gray-100 rounded-xl p-4 resize-y min-h-[120px] focus:outline-none"
                  />

                </div>

                

                {/* AGREEMENT */}
                <label className="flex items-start gap-3 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                  />
                  <span className="text-gray-700 leading-snug">
                    {t("agreeText")}
                  </span>
                </label>

                {/* BUTTON */}
                <button
                  disabled={!agree || creating}
                  onClick={handleCreateRoute}
                  className={`
                    w-full h-[54px] rounded-xl font-medium text-[16px]
                    text-white bg-[#32BB78]
                    transition
                    ${!agree && "opacity-50 cursor-not-allowed"}
                  `}
                >
                  {creating ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    t("createBtn")
                  )}
                </button>

                {/* WARNING */}
                <div className="text-sm text-gray-700 leading-snug mt-1">
                  <b className="text-red-600">{t("important")}</b>{" "}

                  <Trans
                    t={t}
                    i18nKey="importantText"
                    components={{
                      link: (
                        <a
                          href="https://oldmy.gov.uz/ru/service/491"
                          target="_blank"
                          rel="noreferrer"
                          className="underline text-blue-600"
                        />
                      )
                    }}
                  />

                  . {t("importantAfterLink")}
                </div>
              </div>
            </div>

            {/* RIGHT BLOCK */}
            <div className="w-full lg:w-1/2">
              <div>
              <div className="relative rounded-[32px] overflow-hidden shadow-lg w-full h-[600px]">

                {/* Placeholder */}
                <div
                  className={`absolute inset-0 bg-gray-300 transition-opacity duration-500 ${
                    bannerLoaded ? "opacity-0" : "opacity-100"
                  }`}
                />

                {/* Image */}
                <img
                  src={bgImg}
                  alt="banner"
                  onLoad={() => setBannerLoaded(true)}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    bannerLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />

                <div className="absolute left-6 right-6 bottom-6 z-10 bg-white rounded-2xl shadow-md p-6 flex flex-col sm:flex-row gap-4">
                  <img src={qrImg} alt="qr" className="w-[70px] h-[70px]" />
                  <div>
                    <p className="font-semibold text-[15px] leading-tight">
                      {t("bannerTitle")}
                    </p>
                    <p className="text-gray-600 text-sm mt-1 leading-snug">
                      {t("bannerText")}
                    </p>
                  </div>
                </div>
              </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* MODALS */}
      <DateTimeModal
        isOpen={dateModalOpen}
        initialValue={departureAt}
        onClose={() => setDateModalOpen(false)}
        onSave={(value) => {
          setDepartureAt(value);
        }}
      />

      <SeatsModal
        isOpen={seatsModalOpen}
        initialValue={{ front: seatsFront, back: seatsBack }}
        onClose={() => setSeatsModalOpen(false)}
        onSave={({ front, back }) => {
          setSeatsFront(front);
          setSeatsBack(back);
        }}
      />

      <PriceModal
        isOpen={priceModalOpen}
        initialValue={{ front: priceFront, back: priceBack }}
        onClose={() => setPriceModalOpen(false)}
        onSave={({ frontPrice, backPrice }) => {
          setPriceFront(frontPrice);
          setPriceBack(backPrice);
        }}
      />

    </div>
  );
};

export default CreateRoute;