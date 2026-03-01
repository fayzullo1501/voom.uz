import React, { useState, useRef, useEffect } from "react";
import { X, ChevronLeft, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import uzFlag from "../../assets/uz-flag.svg";
import { API_URL } from "../../config/api";

const EditPlateNumber = () => {
  const navigate = useNavigate();
  const { lang, id } = useParams();
  const token = localStorage.getItem("token");

  const [type, setType] = useState("physical");
  const [loading, setLoading] = useState(false);

  const [region, setRegion] = useState("");
  const [letterLeft, setLetterLeft] = useState("");
  const [numbers, setNumbers] = useState("");
  const [lettersRight, setLettersRight] = useState("");

  const regionRef = useRef(null);
  const letterLeftRef = useRef(null);
  const numbersRef = useRef(null);
  const lettersRightRef = useRef(null);

  /* ================= LOAD EXISTING ================= */
  useEffect(() => {
    fetch(`${API_URL}/api/profile/cars/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((car) => {
        if (!car?.plateNumber) return;

        const parts = car.plateNumber.split(" ");

        if (parts.length === 4) {
          setType("physical");
          setRegion(parts[0] || "");
          setLetterLeft(parts[1] || "");
          setNumbers(parts[2] || "");
          setLettersRight(parts[3] || "");
        }

        if (parts.length === 3) {
          setType("legal");
          setRegion(parts[0] || "");
          setNumbers(parts[1] || "");
          setLettersRight(parts[2] || "");
        }
      });
  }, [id, token]);

  /* ================= SAVE ================= */
  const handleSave = async () => {
    const plate =
      type === "physical"
        ? `${region} ${letterLeft} ${numbers} ${lettersRight}`
        : `${region} ${numbers} ${lettersRight}`;

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/profile/cars/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plateNumber: plate.trim(),
        }),
      });

      if (!res.ok) throw new Error();

      navigate(`/${lang}/profile/transport/${id}/edit`);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 pt-6">
      {/* HEADER */}
      <header>
        <div className="container-wide flex items-center justify-end py-8">
          <button className="p-2 rounded-full invisible">
            <X size={24} />
          </button>
        </div>
      </header>

      {/* TITLE */}
      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-[440px] flex items-center justify-center">
          <button
            onClick={() => navigate(`/${lang}/profile/transport/${id}/edit`)}
            className="absolute left-0 p-2 rounded-lg hover:bg-gray-100"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-[28px] font-semibold">Гос. номер</h1>
        </div>
      </div>

      <div className="max-w-[500px] mx-auto">
        {/* TABS */}
        <div className="flex mb-8">
          <button
            onClick={() => {
              setType("physical");
              setRegion("");
              setLetterLeft("");
              setNumbers("");
              setLettersRight("");
              setTimeout(() => regionRef.current?.focus(), 0);
            }}
            className={`flex-1 pb-3 border-b-2 ${type === "physical" ? "border-black text-black" : "border-gray-200 text-gray-400"}`}
          >
            Физ. лицо
          </button>
          <button
            onClick={() => {
              setType("legal");
              setRegion("");
              setLetterLeft("");
              setNumbers("");
              setLettersRight("");
              setTimeout(() => regionRef.current?.focus(), 0);
            }}
            className={`flex-1 pb-3 border-b-2 ${type === "legal" ? "border-black text-black" : "border-gray-200 text-gray-400"}`}
          >
            Юр. лицо
          </button>
        </div>

        {/* PLATE */}
        <div className="relative w-full max-w-[520px] h-[92px] md:h-[110px] border-[3px] border-[#0F2A3D] rounded-[22px] flex items-center overflow-hidden mb-10 bg-[#F4F6F8]">
          <span className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[12px] h-[12px] bg-black rounded-full" />

          {/* REGION */}
          <div className="w-[120px] border-r-[3px] border-black py-4 pr-5 flex justify-end">
            <input
              ref={regionRef}
              value={region}
              placeholder="XX"
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 2);
                setRegion(v);
                if (v.length === 2) {
                  type === "physical"
                    ? letterLeftRef.current?.focus()
                    : numbersRef.current?.focus();
                }
              }}
              className="w-[80px] text-center text-[40px] md:text-[48px] font-plate tracking-[2px] focus:outline-none bg-transparent"
            />
          </div>

          {/* MAIN */}
          <div className="flex-1 flex items-center justify-center gap-3 px-6">
            {type === "physical" && (
              <input
                ref={letterLeftRef}
                value={letterLeft}
                placeholder="X"
                onChange={(e) => {
                  const v = e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 1);
                  setLetterLeft(v);
                  if (v) numbersRef.current?.focus();
                }}
                className="w-[46px] text-center text-[42px] md:text-[50px] font-plate tracking-[2px] focus:outline-none bg-transparent"
              />
            )}

            <input
              ref={numbersRef}
              value={numbers}
              placeholder="XXX"
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 3);
                setNumbers(v);
                if (v.length === 3) lettersRightRef.current?.focus();
              }}
              className="w-[120px] text-center text-[42px] md:text-[50px] font-plate tracking-[4px] focus:outline-none bg-transparent"
            />

            <input
              ref={lettersRightRef}
              value={lettersRight}
              placeholder={type === "physical" ? "XX" : "XXX"}
              onChange={(e) =>
                setLettersRight(
                  e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, type === "physical" ? 2 : 3)
                )
              }
              className="w-[96px] text-center text-[42px] md:text-[50px] font-plate tracking-[3px] focus:outline-none bg-transparent"
            />
          </div>

          {/* FLAG */}
          <div className="w-[90px] flex flex-col items-center justify-center">
            <img src={uzFlag} className="w-8 h-5" />
            <span className="text-[18px] font-bold text-[#0085CA] tracking-wide">UZ</span>
          </div>

          <span className="absolute right-[10px] top-1/2 -translate-y-1/2 w-[12px] h-[12px] bg-black rounded-full" />
        </div>

        {/* SAVE */}
        <button
          disabled={loading}
          onClick={handleSave}
          className="w-full h-[56px] rounded-xl bg-[#32BB78] text-white text-[17px] font-semibold flex items-center justify-center disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Сохранить"}
        </button>
      </div>
    </div>
  );
};

export default EditPlateNumber;
