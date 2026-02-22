import React, { useEffect, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const CityAutocompleteInput = ({ label, value, onSelect }) => {
  const [query, setQuery] = useState(
    value
      ? value.region
        ? `${value.nameRu}, ${value.region}`
        : value.nameRu
      : ""
  );

  useEffect(() => {
    if (!value) {
      setQuery("");
      return;
    }

    setQuery(
      value.region
        ? `${value.nameRu}, ${value.region}`
        : value.nameRu
    );
  }, [value]);

  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  // ===== CLICK OUTSIDE =====
  useEffect(() => {
    const handleClick = (e) => {
      if (!wrapperRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ===== SEARCH =====
  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await fetch(
        `${API_URL}/api/cities?q=${encodeURIComponent(query)}&limit=10`
        );

        const data = await res.json();
        setSuggestions(data.cities || []);
        setOpen(true);
      } catch (err) {
        console.error("City search error:", err);
      } finally {
        setLoading(false);
      }
    }, 400);

  }, [query]);

  const handleSelect = (city) => {
    onSelect(city);
    setQuery(
        city.region
        ? `${city.nameRu}, ${city.region}`
        : city.nameRu
    );
    setOpen(false);
    };

  const clearInput = () => {
    setQuery("");
    setSuggestions([]);
    onSelect(null);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSelect(null);
        }}
        className="w-full h-[52px] px-4 pr-10 bg-gray-100 rounded-xl text-[16px] focus:outline-none"
        placeholder={label}
      />

      {/* RIGHT ICON */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        {loading ? (
          <Loader2 size={18} className="animate-spin text-gray-500" />
        ) : query ? (
          <X
            size={18}
            className="cursor-pointer text-gray-500"
            onClick={clearInput}
          />
        ) : null}
      </div>

      {/* DROPDOWN */}
      {open && suggestions.length > 0 && (
        <div className="absolute top-[56px] left-0 w-full border border-gray-200 bg-white z-[1000] max-h-[250px] overflow-y-auto rounded-xl p-2">
            {suggestions.map((city) => (
            <div
                key={city._id}
                onClick={() => handleSelect(city)}
                className="px-1 py-1 cursor-pointer"
            >
                <div className="px-3 py-2 rounded-lg hover:bg-gray-100 transition">
                <div className="flex flex-col text-left">
                    <span>{city.nameRu}</span>
                    {city.region && (
                    <span className="text-xs text-gray-500">
                        {city.region}
                    </span>
                    )}
                </div>
                </div>
            </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default CityAutocompleteInput;