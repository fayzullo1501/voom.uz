import { useTranslation } from "react-i18next";

const HiddenContact = ({ fee = 3000 }) => {
  const { t } = useTranslation("profile");

  return (
    <div className="relative inline-block">

      {/* DOTS */}
      <div
        className="
        peer
        h-[18px]
        w-[210px]
        bg-[radial-gradient(#32BB78_2px,transparent_2px)]
        bg-[size:6px_6px]
        cursor-default
        "
      />

      {/* TOOLTIP */}
      <div
        className="
        pointer-events-none
        absolute
        left-1/2
        -translate-x-1/2
        bottom-[26px]
        hidden
        peer-hover:block
        z-10
        "
      >
        <div className="bg-[#32BB78] text-white text-[12px] leading-[16px] text-center w-[220px] px-4 py-3 rounded-xl shadow-lg">
          {t("passengerModal.hiddenContactTooltip", { amount: fee.toLocaleString() })}
        </div>

        {/* ARROW */}
        <div className="w-3 h-3 bg-[#32BB78] rotate-45 mx-auto -mt-1" />
      </div>

    </div>
  );
};

export default HiddenContact;
