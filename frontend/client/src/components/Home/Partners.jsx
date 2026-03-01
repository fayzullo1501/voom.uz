import React from "react";
import faykhanur from "../../assets/partners/faykhanur.png";
import enlight from "../../assets/partners/enlight.png";
import sqb from "../../assets/partners/sqb.png";
import ftlogo from "../../assets/partners/ft-logo.png";
import soulcraft from "../../assets/partners/soulcraft.png";

const Partners = () => {
  const partners = [
    { id: 1, logo: faykhanur, name: "Faykhanur Enterprises" },
    { id: 3, logo: sqb, name: "SQB" },
    { id: 3, logo: enlight, name: "Enlight" },
    { id: 4, logo: ftlogo, name: "FAYKHANUR Technologies" },
    { id: 5, logo: soulcraft, name: "SoulCraft" },
  ];

  return (
    <section className="w-full bg-white py-10 md:py-14">
      {/* Контейнер с точными боковыми отступами */}
      <div className="max-w-[90rem] mx-auto px-8 md:px-[92px] overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between gap-10 md:gap-12 min-w-max">
          {partners.map((partner) => (
            <img
              key={partner.id}
              src={partner.logo}
              alt={partner.name}
              className="
                h-10 md:h-12 flex-shrink-0
                opacity-60 hover:opacity-100
                transition-all duration-300
                object-contain
                grayscale hover:grayscale-0
              "
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
