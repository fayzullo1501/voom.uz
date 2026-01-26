// src/pages/users/UserDetails.jsx
import { useEffect, useState } from "react";
import { ChevronLeft, User, Route, Ticket, Car, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../config/api";
import UserProfileTab from "../../components/users/UserProfileTab";
import UserFilesTab from "../../components/users/UserFilesTab";

const tabs = [
  { key: "profile", label: "Персональные данные", icon: User },
  { key: "routes", label: "Маршруты", icon: Route },
  { key: "bookings", label: "Бронирования", icon: Ticket },
  { key: "cars", label: "Автомобили", icon: Car },
  { key: "files", label: "Файлы", icon: FileText },
];

const Loader = () => (
  <div className="h-[360px] flex flex-col items-center justify-center text-gray-500 gap-3">
    <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
    <div className="text-[15px]">Загрузка</div>
  </div>
);

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const hasPendingFiles =
  user?.files?.some((f) => f.status === "pending") || false;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data);
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  return (
    <>
      {/* HEADER */}
      <div className="h-[72px] bg-white flex items-center px-8 shrink-0 border-b border-gray-200">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition">
          <ChevronLeft size={18} />
        </button>
        <div className="ml-3 text-[26px] font-semibold text-gray-900">
          Инфо пользователя
        </div>
      </div>

      {/* CONTENT */}
      <div className="bg-white px-8 pt-6 pb-10 overflow-y-auto h-[calc(100vh-72px)]">
        {/* USER INFO */}
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
            {user?.profilePhoto?.status === "approved" ? (
              <img
                src={user.profilePhoto.url}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-[22px] font-semibold text-gray-900">
              {user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "—" : ""}
            </div>

            {user && (
              <div
                className={`px-3 py-1 rounded-full text-[13px] font-medium w-fit ${
                  user.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {user.verified ? "Верифицирован" : "Не верифицирован"}
              </div>
            )}
          </div>
        </div>


        {/* TABS */}
        <div className="border-b border-gray-200 flex gap-8 mb-6">
          {tabs.map(({ key, label, icon: Icon }) => {
            const highlightFiles =
              key === "files" && hasPendingFiles;

            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 pb-4 text-[15px] transition ${
                  activeTab === key
                    ? "border-b-2 border-gray-900"
                    : "hover:text-gray-700"
                } ${
                  highlightFiles
                    ? "font-semibold text-yellow-700"
                    : "text-gray-400"
                }`}
              >
                <Icon
                  size={16}
                  className={highlightFiles ? "text-yellow-600" : ""}
                />
                {label}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT */}
        {loading || !user ? (
          <Loader />
        ) : activeTab === "profile" ? (
          <UserProfileTab user={user} />
        ) : activeTab === "files" ? (
          <UserFilesTab
            userId={user._id}          // 🔥 ВАЖНО
            files={user.files || []}
            loading={false}
            onRefresh={() => {
              // повторно загрузить пользователя
              fetch(`${API_URL}/api/admin/users/${id}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
                },
              })
                .then((res) => res.json())
                .then((data) => setUser(data));
            }}
          />
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
};

export default UserDetails;
