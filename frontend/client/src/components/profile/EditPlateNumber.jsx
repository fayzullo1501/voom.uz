import React, { useState, useRef, useEffect } from "react";
import { X, ChevronLeft, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import uzFlag from "../../assets/flag-uz.svg";
import { API_URL } from "../../config/api";

const EditPlateNumber = () => {
  const navigate = useNavigate();
  const { lang, id } = useParams();
  const token = localStorage.getItem("token");

  const [type, setType] = useState("physical");
  const [loading, setLoading] = useState(false);

  // PHYSICAL
  const [pRegion, setPRegion] = useState("");
  const [pLetter, setPLetter] = useState("");
  const [pNumbers, setPNumbers] = useState("");
  const [pLettersRight, setPLettersRight] = useState("");

  // LEGAL
  const [lRegion, setLRegion] = useState("");
  const [lNumbers, setLNumbers] = useState("");
  const [lLettersRight, setLLettersRight] = useState("");

  const regionRef = useRef(null);
  const letterRef = useRef(null);
  const numbersRef = useRef(null);
  const lettersRightRef = useRef(null);

  /* LOAD EXISTING */
  useEffect(() => {
    fetch(`${API_URL}/api/profile/cars/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(car => {
        if (!car?.plateNumber) return;
        const parts = car.plateNumber.split(" ");
        if (parts.length === 4) {
          setType("physical");
          setPRegion(parts[0] || "");
          setPLetter(parts[1] || "");
          setPNumbers(parts[2] || "");
          setPLettersRight(parts[3] || "");
        }
        if (parts.length === 3) {
          setType("legal");
          setLRegion(parts[0] || "");
          setLNumbers(parts[1] || "");
          setLLettersRight(parts[2] || "");
        }
      });
  }, [id, token]);

  /* SAVE */
  const handleSave = async () => {
    let plate = "";

    if (type === "physical") {
      if (pRegion.length !== 2 || pLetter.length !== 1 || pNumbers.length !== 3 || pLettersRight.length !== 2) return;
      plate = `${pRegion} ${pLetter} ${pNumbers} ${pLettersRight}`;
    }

    if (type === "legal") {
      if (lRegion.length !== 2 || lNumbers.length !== 3 || lLettersRight.length !== 3) return;
      plate = `${lRegion} ${lNumbers} ${lLettersRight}`;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/profile/cars/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plateNumber: plate })
      });

      if (!res.ok) throw new Error();

      navigate(`/${lang}/profile/transport/${id}/edit`);
    } catch {
      setLoading(false);
    }
  };

  const region = type === "physical" ? pRegion : lRegion;
  const letterLeft = type === "physical" ? pLetter : "";
  const numbers = type === "physical" ? pNumbers : lNumbers;
  const lettersRight = type === "physical" ? pLettersRight : lLettersRight;

  const setRegion = v => type === "physical" ? setPRegion(v) : setLRegion(v);
  const setLetterLeft = v => setPLetter(v);
  const setNumbers = v => type === "physical" ? setPNumbers(v) : setLNumbers(v);
  const setLettersRight = v => type === "physical" ? setPLettersRight(v) : setLLettersRight(v);

  return (
    <div className="min-h-screen bg-white px-6 pt-6">

      <header>
        <div className="container-wide flex items-center justify-end py-8">
          <button className="p-2 rounded-full invisible"><X size={24} /></button>
        </div>
      </header>

      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-[440px] flex items-center justify-center">
          <button onClick={() => navigate(`/${lang}/profile/transport/${id}/edit`)} className="absolute left-0 p-2 rounded-lg hover:bg-gray-100">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-[28px] font-semibold">Гос. номер</h1>
        </div>
      </div>

      <div className="max-w-[500px] mx-auto">

        {/* TABS */}
        <div className="flex mb-8">
          <button onClick={() => setType("physical")} className={`flex-1 pb-3 border-b-2 ${type === "physical" ? "border-black text-black" : "border-gray-200 text-gray-400"}`}>Физ. лицо</button>
          <button onClick={() => setType("legal")} className={`flex-1 pb-3 border-b-2 ${type === "legal" ? "border-black text-black" : "border-gray-200 text-gray-400"}`}>Юр. лицо</button>
        </div>

        {/* PLATE */}
        <div className="mb-10 flex justify-center">
          <div className="inline-flex items-stretch gap-4 border-[1px] border-[#123B5A] bg-white h-[78px] px-5 rounded-[10px]">

            <div className="flex items-center gap-2 pr-4 font-plate h-full border-r-[1px] border-[#123B5A]">
              <div className="w-[5px] h-[5px] bg-black rounded-full" />
              <input value={region} placeholder="XX" onChange={e => setRegion(e.target.value.replace(/\D/g,"").slice(0,2))} className="w-[60px] bg-transparent text-center text-[38px] font-plate outline-none placeholder:text-gray-300" />
            </div>

            <div className="flex items-center gap-3 font-plate text-[38px]">
              {type === "physical" && (
                <input value={letterLeft} placeholder="X" onChange={e => setLetterLeft(e.target.value.toUpperCase().replace(/[^A-Z]/g,"").slice(0,1))} className="w-[36px] bg-transparent text-center outline-none placeholder:text-gray-300" />
              )}
              <input value={numbers} placeholder="XXX" onChange={e => setNumbers(e.target.value.replace(/\D/g,"").slice(0,3))} className="w-[80px] bg-transparent text-center outline-none tracking-[3px] placeholder:text-gray-300" />
              <input value={lettersRight} placeholder={type==="physical"?"XX":"XXX"} onChange={e => setLettersRight(e.target.value.toUpperCase().replace(/[^A-Z]/g,"").slice(0,type==="physical"?2:3))} className="w-[80px] bg-transparent text-center outline-none placeholder:text-gray-300" />
            </div>

            <div className="flex items-center gap-2 font-plate">
              <div className="flex flex-col items-center leading-none">
                <img src={uzFlag} alt="UZ" className="w-5 h-3 mb-1" />
                <span className="text-[11px] font-semibold text-[#0EA5B7]">UZ</span>
              </div>
              <div className="w-[5px] h-[5px] bg-black rounded-full" />
            </div>

          </div>
        </div>

        <button
          disabled={
            loading ||
            (type==="physical" && (pRegion.length!==2||pLetter.length!==1||pNumbers.length!==3||pLettersRight.length!==2)) ||
            (type==="legal" && (lRegion.length!==2||lNumbers.length!==3||lLettersRight.length!==3))
          }
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