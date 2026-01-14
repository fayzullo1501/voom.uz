import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="w-[260px] bg-white border-r border-gray-200 p-6">
      <div className="text-[22px] font-semibold mb-10">VOOM</div>

      <div
        onClick={() => navigate("/dashboard")}
        className={`text-[15px] font-medium cursor-pointer ${
          pathname === "/dashboard" ? "text-[#32BB78]" : "text-gray-700"
        }`}
      >
        Статистика
      </div>
    </div>
  );
};

export default Sidebar;
