// src/pages/routes/RouteBooking.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, Wallet, Loader2, MapPin, X } from "lucide-react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import visaLogo from "../../assets/visa.png";
import masterLogo from "../../assets/mastercard.png";
import uzFlag from "../../assets/flag-uz.svg";
import MapLocationModal from "../../components/routes/MapLocationModal";


const RouteBooking = () => {
  const { id: routeId } = useParams();

  const [activeField, setActiveField] = useState("");
  const [payType, setPayType] = useState("cash");

  const [route, setRoute] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [useMyData, setUseMyData] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [seatType, setSeatType] = useState(null);
  const [seatsCount, setSeatsCount] = useState(null);
  const [bookWholeCar, setBookWholeCar] = useState(false);

  const [seatDropdownOpen, setSeatDropdownOpen] = useState(false);
  const [countDropdownOpen, setCountDropdownOpen] = useState(false);

  const [pickupLocation, setPickupLocation] = useState({ address: "", lat: null, lng: null });
  const [dropoffLocation, setDropoffLocation] = useState({ address: "", lat: null, lng: null });

  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [mapFieldType, setMapFieldType] = useState(null); // "pickup" | "dropoff"

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);

    let result = "";
    if (digits.length > 0) result += digits.slice(0, 2);
    if (digits.length > 2) result += " " + digits.slice(2, 5);
    if (digits.length > 5) result += " " + digits.slice(5, 7);
    if (digits.length > 7) result += " " + digits.slice(7, 9);

    return result;
  };

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/routes/${routeId}`
        );
        const data = await res.json();
        setRoute(data);
      } catch (err) {
        console.error("route load error", err);
      } finally {
        setLoadingRoute(false);
      }
    };

    fetchRoute();
  }, [routeId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const user = await res.json();

        if (useMyData && user) {
          setName(`${user.firstName || ""} ${user.lastName || ""}`.trim());
          setEmail(user.email || "");
          setPhone(formatPhone(user.phone || ""));
        }
      } catch (err) {
        console.error("user load error", err);
      }
    };

    fetchUser();
  }, [useMyData]);


  const handleBooking = async () => {
    if (submitting) return;
    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            routeId,
            passengerName: name,
            passengerEmail: email,
            passengerPhone: phone.replace(/\s/g, ""),
            pickupLocation,
            dropoffLocation,
            seatType,
            bookWholeCar,
            seatsCount: bookWholeCar
              ? Number(route.availableSeatsFront) +
                Number(route.availableSeatsBack)
              : seatsCount,
            paymentType: payType,
            message,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Ошибка бронирования");
        return;
      }

      alert("Бронирование успешно создано");
    } catch (err) {
      console.error(err);
      alert("Ошибка сервера");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString("ru-RU", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
    const totalPrice =
      route && !loadingRoute
        ? bookWholeCar
          ? (Number(route?.priceFront ?? 0) * Number(route?.availableSeatsFront ?? 0)) +
            (Number(route?.priceBack ?? 0) * Number(route?.availableSeatsBack ?? 0))
          : seatType && seatsCount
            ? (seatType === "front"
                ? Number(route?.priceFront ?? 0)
                : Number(route?.priceBack ?? 0)
              ) * Number(seatsCount)
            : null
        : null;

    if (loadingRoute)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-black animate-spin" />
      </div>
    );

    const totalAvailableSeats =
      route
        ? Number(route.availableSeatsFront ?? 0) +
          Number(route.availableSeatsBack ?? 0)
        : 0;


    if (!loadingRoute && totalAvailableSeats <= 0) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="text-2xl font-bold mb-3">
              Мест больше нет
            </div>
            <button
              onClick={() => window.history.back()}
              className="px-6 h-11 bg-black text-white rounded-lg"
            >
              Вернуться назад
            </button>
          </div>
        </div>
      );
    }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container-wide pb-20 lg:pb-32">
        {/* HEADER */}
        <div className="relative flex items-center py-4 border-b border-gray-300">
          <button
            onClick={() => window.history.back()}
            className="absolute left-0 flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition lg:static lg:mr-4"
          >
            <ChevronLeft size={18} />
            <span className="hidden lg:inline ml-2 text-[15px] font-medium">
              Назад
            </span>
          </button>

          <div className="mx-auto text-[20px] lg:text-[36px] font-semibold text-center lg:text-left lg:mx-0">
            Забронировать
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-6 mt-6">
          {/* LEFT */}
          <div>
            <div className="text-[28px] lg:text-[32px] font-bold text-black mb-4">
              Информация для бронирования
            </div>

            <div className="flex flex-col gap-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setActiveField("name")}
                placeholder="Ваше Имя, Фамилия"
                className={`w-full h-[54px] rounded-xl px-4 text-[15px] font-semibold outline-none border transition ${
                  activeField === "name"
                    ? "border-gray-300 border-1 text-black"
                    : "border-gray-300 text-gray-700"
                }`}
              />

              <label className="flex items-center gap-3 text-[15px] text-gray-600">
                <input
                  type="checkbox"
                  checked={useMyData}
                  onChange={(e) => {
                    setUseMyData(e.target.checked);
                    if (!e.target.checked) {
                      setName("");
                      setEmail("");
                      setPhone("");
                    }
                  }}
                  className="w-5 h-5 rounded-md"
                />
                Мои данные
              </label>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setActiveField("email")}
                  placeholder="Эл. почта (не обязательно)"
                  className={`h-[54px] rounded-xl px-4 border outline-none transition ${
                    activeField === "email"
                      ? "border-gray-300 border-1"
                      : "border-gray-300"
                  }`}
                />

                {/* PHONE */}
                <div
                  onClick={() => setActiveField("phone")}
                  className={`h-[54px] rounded-xl px-4 border flex items-center gap-2 cursor-text transition ${
                    activeField === "phone"
                      ? "border-gray-300 border-1"
                      : "border-gray-300"
                  }`}
                >
                  <img src={uzFlag} alt="UZ" className="w-5 h-5" />
                  <span className="text-[15px] text-gray-700 select-none">
                    +998
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    onFocus={() => setActiveField("phone")}
                    className="flex-1 outline-none text-[15px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* PICKUP */}
                <div className="relative">
                  <input
                    value={pickupLocation.address}
                    onChange={(e) =>
                      setPickupLocation({ ...pickupLocation, address: e.target.value })
                    }
                    placeholder="Откуда забрать"
                    className="h-[54px] w-full rounded-xl px-4 pr-12 border border-gray-300 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setMapFieldType("pickup");
                      setMapModalOpen(true);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center"
                  >
                    <MapPin size={18} />
                  </button>
                </div>

                {/* DROPOFF */}
                <div className="relative">
                  <input
                    value={dropoffLocation.address}
                    onChange={(e) =>
                      setDropoffLocation({ ...dropoffLocation, address: e.target.value })
                    }
                    placeholder="Куда доставить (не обязательно)"
                    className="h-[54px] w-full rounded-xl px-4 pr-12 border border-gray-300 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setMapFieldType("dropoff");
                      setMapModalOpen(true);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center"
                  >
                    <MapPin size={18} />
                  </button>
                </div>

              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative">

                {/* ВЫБОР РЯДА */}
                <div className="relative">
                  <button
                    onClick={() => setSeatDropdownOpen(!seatDropdownOpen)}
                    disabled={bookWholeCar}
                    className={`w-full h-[54px] rounded-xl px-4 border flex justify-between items-center ${
                      bookWholeCar ? "bg-gray-100 text-gray-400" : "border-gray-300"
                    }`}
                  >
                    {seatType
                      ? seatType === "front"
                        ? "Передний ряд"
                        : "Задний ряд"
                      : "Выберите ряд"}
                    <span>›</span>
                  </button>

                  {seatDropdownOpen && route && (
                    <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-xl shadow">
                      {/* FRONT */}
                      <button
                        disabled={route.availableSeatsFront <= 0}
                        onClick={() => {
                          setSeatType("front");
                          setSeatsCount(null);
                          setSeatDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left ${
                          route.availableSeatsFront <= 0
                            ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        Передний ряд ({route.availableSeatsFront} мест)
                      </button>

                      {/* BACK */}
                      <button
                        disabled={route.availableSeatsBack <= 0}
                        onClick={() => {
                          setSeatType("back");
                          setSeatsCount(null);
                          setSeatDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left ${
                          route.availableSeatsBack <= 0
                            ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        Задний ряд ({route.availableSeatsBack} мест)
                      </button>
                    </div>
                  )}
                </div>

                {/* ВЫБОР КОЛИЧЕСТВА */}
                <div className="relative">
                  <button
                    disabled={!seatType || bookWholeCar}
                    onClick={() => seatType && setCountDropdownOpen(!countDropdownOpen)}
                    className={`w-full h-[54px] rounded-xl px-4 border flex justify-between items-center ${
                      !seatType || bookWholeCar
                      ? "bg-gray-100 text-gray-400"
                      : "border-gray-300"
                    }`}
                  >
                    {seatsCount ? `${seatsCount} мест` : "Кол-во мест"}
                    <span>›</span>
                  </button>

                  {countDropdownOpen && seatType && route && (
                    <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-xl shadow">
                      {Array.from({
                        length:
                          seatType === "front"
                            ? route.availableSeatsFront
                            : route.availableSeatsBack,
                      }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSeatsCount(i + 1);
                            setCountDropdownOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50"
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <label className="flex items-center gap-3 text-[15px] text-gray-700">
                  <input
                    type="checkbox"
                    checked={bookWholeCar}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setBookWholeCar(checked);

                      if (checked && route) {
                        setSeatType(null);
                        setSeatsCount(
                          Number(route.availableSeatsFront) +
                          Number(route.availableSeatsBack)
                        );
                      } else {
                        setSeatsCount(null);
                      }
                    }}
                    className="w-5 h-5 rounded-md"
                  />
                  Забронировать весь автомобиль
                </label>
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Заметка (не обязательное поле)"
                onFocus={() => setActiveField("message")}
                className={`h-[140px] rounded-xl px-4 py-3 border outline-none transition ${
                  activeField === "message"
                    ? "border-gray-300 border-1"
                    : "border-gray-300"
                }`}
              />
            </div>

            {/* PAYMENT */}
            <div className="mt-10">
              <div className="text-[28px] lg:text-[32px] font-bold mb-4">
                Выберите способ оплаты
              </div>

              <div className="flex flex-col lg:flex-row gap-4">
                <button
                  onClick={() => setPayType("cash")}
                  className={`w-full h-[60px] rounded-xl px-5 flex items-center justify-between border transition ${
                    payType === "cash"
                      ? "border-2 border-[#32BB78] text-[#32BB78] font-semibold"
                      : "border-gray-300 text-black font-semibold"
                  }`}
                >
                  <span>Оплата наличными</span>
                  <Wallet size={20} />
                </button>

                <button
                  disabled
                  className="w-full h-[60px] rounded-xl px-5 flex items-center justify-between border border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed opacity-70"
                >
                  <span>
                    Банковская карта
                    <span className="ml-2 text-xs text-gray-400">(Скоро будет)</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <img src={masterLogo} alt="" className="h-6" />
                    <img src={visaLogo} alt="" className="h-6" />
                  </div>
                </button>
              </div>

              <div className="mt-3 text-[13px] text-gray-500">
                Оформляя это бронирование, вы принимаете{" "}
                <span className="underline cursor-pointer text-black">
                  Условия использования
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div className="lg:sticky lg:top-24">
              <div className="text-[28px] lg:text-[32px] font-bold text-black mb-4">
                Ваш заказ
              </div>

              <div className="border border-gray-300 rounded-xl p-4">
                  {route && (
                    <>
                      <div className="font-semibold mb-3 text-[22px]">
                        {formatDate(route.departureAt)}
                      </div>

                      <div className="grid grid-cols-[auto_24px_1fr] gap-3">
                        <div className="flex flex-col gap-[38px] text-[15px] font-medium">
                          <div>
                            {new Date(route.departureAt).toLocaleTimeString("ru-RU", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>

                          <div>
                            {route.arrivalAt
                              ? new Date(route.arrivalAt).toLocaleTimeString("ru-RU", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "--:--"}
                          </div>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="w-4 h-4 rounded-full border-2 border-black bg-white" />
                          <div className="w-[2px] h-[52px] bg-black" />
                          <div className="w-4 h-4 rounded-full border-2 border-black bg-white" />
                        </div>

                        <div className="flex flex-col gap-4">
                          <div>
                            <div className="text-[18px] font-bold">
                              {route.fromCity?.nameRu}
                            </div>
                            <div className="text-[14px] text-gray-500">
                              {route.fromCity?.region}
                            </div>
                          </div>

                          <div>
                            <div className="text-[18px] font-bold">
                              {route.toCity?.nameRu}
                            </div>
                            <div className="text-[14px] text-gray-500">
                              {route.toCity?.region}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
              </div>

              <div className="mt-4 border border-gray-300 rounded-xl p-4">
                <div className="font-semibold mb-2 text-[22px]">
                  Стоимость за поездку
                </div>
                <div className="flex mt-6 border-t pt-5 border-gray-300 justify-between text-[18px]">
                  <span>Всего</span>
                  <span className="font-bold">
                    {totalPrice
                      ? `${totalPrice.toLocaleString("ru-RU")} сум`
                      : "—"}
                  </span>
                </div>
              </div>

              <button
                disabled={submitting}
                onClick={handleBooking}
                className="w-full h-[56px] mt-4 bg-[#32BB78] text-white rounded-xl text-[17px] font-semibold hover:bg-[#2aa86e] transition flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </>
                ) : (
                  "Забронировать"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <MapLocationModal
        isOpen={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        initialLocation={
          mapFieldType === "pickup" ? pickupLocation : dropoffLocation
        }
        onSave={(location) => {
          if (mapFieldType === "pickup") {
            setPickupLocation(location);
          } else {
            setDropoffLocation(location);
          }
        }}
      />
      <Footer />
    </div>
  );
};

export default RouteBooking;
