import userAvatar from "../../assets/avatar-placeholder.svg";

const Header = ({ title }) => {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
      <div className="text-[28px] font-semibold text-gray-900">
        {title}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-[16px] font-medium text-gray-800">
          Администратор
        </div>
        <img
          src={userAvatar}
          alt="User"
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
    </div>
  );
};

export default Header;
