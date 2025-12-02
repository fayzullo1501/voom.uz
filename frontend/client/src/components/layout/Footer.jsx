import React from "react";
import { Instagram, Youtube, Send } from "lucide-react";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation("layout");

  return (
    <footer className="bg-black text-gray-300 pt-16 pb-6 border-t border-neutral-800">
      <div className="container-wide">

        {/* Верхняя часть */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 pb-10 border-b border-neutral-800">

          {/* Контакты */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-3">
              {t("footer.contacts.number")}
            </h3>

            <p className="text-gray-400 mb-2">
              {t("footer.contacts.support")}
            </p>

            <a
              href="mailto:info@voom.uz"
              className="hover:text-white transition-colors"
            >
              {t("footer.contacts.email")}
            </a>

            <div className="flex items-center gap-4 mt-4">
              <a href="#" className="hover:text-white transition-colors" aria-label={t("footer.contacts.instagram")}>
                <Instagram size={18} />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label={t("footer.contacts.youtube")}>
                <Youtube size={18} />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label={t("footer.contacts.telegram")}>
                <Send size={18} />
              </a>
            </div>
          </div>

          {/* Информация */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-3">
              {t("footer.info.title")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">{t("footer.info.terms")}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t("footer.info.privacy")}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t("footer.info.faq")}</a></li>
            </ul>
          </div>

          {/* О платформе */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-3">
              {t("footer.platform.title")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">{t("footer.platform.what")}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t("footer.platform.how")}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t("footer.platform.news")}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t("footer.platform.contacts")}</a></li>
            </ul>
          </div>

          {/* Возможности */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-3">
              {t("footer.features.title")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">{t("footer.features.passengers")}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t("footer.features.drivers")}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t("footer.features.safety")}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t("footer.features.support")}</a></li>
            </ul>
          </div>

          {/* FAYKHANUR */}
          <div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t("footer.company.line1")}<br />
              {t("footer.company.line2")}<br />
              {t("footer.company.line3")}<br />
              {t("footer.company.line4")}
            </p>
          </div>
        </div>

        {/* Нижняя часть */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400 mt-6 gap-3">
          <p>
            <a
              href="https://manera.uz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-200 transition-colors"
            >
              {t("footer.bottom.brandLink")}
            </a>{" "}
            | {t("footer.bottom.brandSuffix")}
          </p>

          <p className="text-center sm:text-right">
            {t("footer.bottom.rights")}
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
