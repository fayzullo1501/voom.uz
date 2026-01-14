import attentionIcon from "../../assets/icons/exclamation.png";

const DeviceGuard = ({ children }) => {
  return (
    <>
      <div className="md:hidden min-h-screen flex items-center justify-center bg-white px-6 text-center">
        <div className="max-w-[420px] flex flex-col items-center">
          <img src={attentionIcon} alt="Attention" className="w-20 h-20 mb-6" />
          <div className="text-[22px] font-semibold mb-3 text-gray-900">Внимание!</div>
          <div className="text-[15px] text-gray-600 leading-relaxed">
            Админ-панель доступна только в десктоп версии. Пожалуйста, откройте панель на компьютере или ноутбуке.
          </div>
        </div>
      </div>

      <div className="hidden md:block min-h-screen">
        {children}
      </div>
    </>
  );
};

export default DeviceGuard;
