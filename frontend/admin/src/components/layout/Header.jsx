// src/components/layout/Header.jsx
import { useEffect, useState } from "react";
import userAvatar from "../../assets/avatar-placeholder.svg";
import { API_URL } from "../../config/api";

const Header = ({ title }) => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const loadMe = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setAdmin(data);
        }
      } catch {}
    };
    loadMe();
  }, []);

  const fullName =
    admin
      ? `${admin.firstName || ""} ${admin.lastName || ""}`.trim()
      : "";

  return (
    <div className="h-[72px] bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
      <div className="text-[26px] font-semibold text-gray-900">
        {title}
      </div>

      <div className="flex items-center gap-3">
        {fullName && (
          <div className="text-[15px] font-medium text-gray-800">
            {fullName}
          </div>
        )}
        <img
          src={admin?.avatar || userAvatar}
          alt="User"
          className="w-9 h-9 rounded-full object-cover"
        />
      </div>
    </div>
  );
};

export default Header;
