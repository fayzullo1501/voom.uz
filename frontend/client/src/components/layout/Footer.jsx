import React from "react";
import { Instagram, Youtube, Send } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-black text-gray-300 pt-16 pb-6 border-t border-neutral-800">
      <div className="container-wide">
        {/* Верхняя часть */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 pb-10 border-b border-neutral-800">
          {/* Контакты */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-3">
              1696
            </h3>
            <p className="text-gray-400 mb-2">Служба поддержки - voom</p>
            <a
              href="mailto:info@voom.uz"
              className="hover:text-white transition-colors"
            >
              info@voom.uz
            </a>
            <div className="flex items-center gap-4 mt-4">
              <a
                href="#"
                className="hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors"
                aria-label="Telegram"
              >
                <Send size={18} />
              </a>
            </div>
          </div>

          {/* Информация */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-3">
              Информация
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Пользовательское соглашение
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Политика конфиденциальности
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Часто задаваемые вопросы
                </a>
              </li>
            </ul>
          </div>

          {/* О платформе */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-3">
              О платформе
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Что такое VOOM
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Как это работает
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Новости и обновления
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Контакты
                </a>
              </li>
            </ul>
          </div>

          {/* Возможности */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-3">
              Возможности
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Для пассажиров
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Для водителей
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Безопасность поездок
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Служба поддержки
                </a>
              </li>
            </ul>
          </div>

          {/* FAYKHANUR */}
          <div>
            <p className="text-sm text-gray-400 leading-relaxed">
              ООО «FAYKHANUR», ИНН 311015623
              <br />
              Республика Узбекистан, г. Ташкент,
              <br />
              Яккасарайский район, ул. Бабур, дом 67/4
              <br />
              Регистрационный номер 5220787
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
              voom.uz
            </a>{" "}
            | сервис - карпулинг.
          </p>
          <p className="text-center sm:text-right">
            © FAYKHANUR Enterprises Group LLC, 2025
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
