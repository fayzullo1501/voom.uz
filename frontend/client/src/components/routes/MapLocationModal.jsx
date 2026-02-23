import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { X, Locate, Plus, Minus, Layers } from "lucide-react";

const defaultCenter = {
  lat: 41.279236,
  lng: 69.257563,
};

export default function MapLocationModal({
  isOpen,
  onClose,
  onSave,
  initialLocation,
}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const mapRef = useRef(null);
  const [center, setCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(17);
  const [mapType, setMapType] = useState("roadmap");

  useEffect(() => {
    if (initialLocation?.lat && initialLocation?.lng) {
      setCenter(initialLocation);
    } else {
      setCenter(defaultCenter);
    }
  }, [initialLocation, isOpen]);

  const onLoad = (map) => {
    mapRef.current = map;
  };

  const handleIdle = () => {
    if (!mapRef.current) return;
    const c = mapRef.current.getCenter();
    setCenter({
      lat: c.lat(),
      lng: c.lng(),
    });
    setZoom(mapRef.current.getZoom());
  };

  const zoomIn = () => {
    if (!mapRef.current) return;
    mapRef.current.setZoom(zoom + 1);
  };

  const zoomOut = () => {
    if (!mapRef.current) return;
    mapRef.current.setZoom(zoom - 1);
  };

  const toggleLayer = () => {
    const newType = mapType === "roadmap" ? "satellite" : "roadmap";
    setMapType(newType);
    mapRef.current?.setMapTypeId(newType);
  };

  const handleMyLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((position) => {
      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      mapRef.current?.panTo(coords);
    });
  };

  const handleSave = async () => {
    if (!center) return;

    const geocoder = new window.google.maps.Geocoder();
    const result = await geocoder.geocode({ location: center });

    const address = result.results[0]?.formatted_address || "";

    onSave({
      address,
      lat: center.lat,
      lng: center.lng,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="font-semibold text-lg">Выберите точку</div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* MAP */}
        <div className="relative flex-1">
          {isLoaded && (
            <GoogleMap
              center={center}
              zoom={zoom}
              mapTypeId={mapType}
              onLoad={onLoad}
              onIdle={handleIdle}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              options={{
                disableDefaultUI: true,
                gestureHandling: "greedy",
              }}
            />
          )}

          {/* CENTER PIN */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg
              width="38"
              height="50"
              viewBox="0 0 24 24"
              fill="#EA4335"
              className="-translate-y-6 drop-shadow-lg"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5" fill="white"/>
            </svg>
          </div>

          {/* ZOOM CONTROLS */}
          <div className="absolute right-4 bottom-24 flex flex-col shadow-lg">
            <button
              onClick={zoomIn}
              className="bg-white w-10 h-10 flex items-center justify-center border border-gray-200 hover:bg-gray-100"
            >
              <Plus size={18} />
            </button>
            <button
              onClick={zoomOut}
              className="bg-white w-10 h-10 flex items-center justify-center border border-gray-200 hover:bg-gray-100"
            >
              <Minus size={18} />
            </button>
          </div>

          {/* LAYER BUTTON */}
          <button
            onClick={toggleLayer}
            className="absolute right-4 bottom-4 bg-white w-10 h-10 flex items-center justify-center border border-gray-200 shadow-lg hover:bg-gray-100"
          >
            <Layers size={18} />
          </button>

          {/* MY LOCATION */}
          <button
            onClick={handleMyLocation}
            className="absolute bottom-5 left-5 bg-white shadow-md border border-gray-200 rounded-lg px-4 h-10 flex items-center gap-2 text-sm hover:bg-gray-50 transition"
          >
            <Locate size={16} />
            Моё местоположение
          </button>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t flex justify-end bg-white">
          <button
            onClick={handleSave}
            className="px-6 h-11 bg-[#32BB78] text-white rounded-lg font-medium hover:bg-[#2da86c] transition"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}