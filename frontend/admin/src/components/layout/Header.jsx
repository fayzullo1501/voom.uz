// src/components/layout/Header.jsx
import userAvatar from "../../assets/avatar-placeholder.svg";

const Header = ({ title }) => {
  return (
    <div className="h-[72px] bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
      <div className="text-[26px] font-semibold text-gray-900">
        {title}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-[15px] font-medium text-gray-800">
          Администратор
        </div>
        <img src={userAvatar} alt="User" className="w-9 h-9 rounded-full" />
      </div>
    </div>
  );
};

export default Header;
