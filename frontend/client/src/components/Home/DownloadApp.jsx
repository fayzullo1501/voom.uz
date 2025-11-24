import React from "react";
import qrImg from "../../assets/qr-voom.png";
import appStoreImg from "../../assets/appstore.png";
import googlePlayImg from "../../assets/googleplay.png";

function DownloadApp() {
  return (
    <section className="py-24 bg-white">
      <div className="container-wide">
        <div className="bg-black text-white rounded-3xl px-12 py-16 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
          {/* Левая часть */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Загрузите наше <br /> бесплатное приложение
            </h2>
            <p className="text-gray-300 text-lg sm:text-xl mb-10 leading-relaxed max-w-md">
              Это делает заказ более удобным, а также вы получаете уведомления
              о предложениях водителей.
            </p>

            {/* Кнопки маркетов */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={appStoreImg}
                  alt="App Store"
                  className="h-14 sm:h-16 w-auto"
                />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={googlePlayImg}
                  alt="Google Play"
                  className="h-14 sm:h-16 w-auto"
                />
              </a>
            </div>
          </div>

          {/* Правая часть — QR */}
          <div className="flex-shrink-0 flex justify-center lg:justify-end">
            <img
              src={qrImg}
              alt="QR для скачивания VOOM"
              className="w-52 sm:w-60 md:w-64 lg:w-72"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default DownloadApp;
