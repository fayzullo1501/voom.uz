import { BookOpen, Shield, Code2, Bot, Settings, Smartphone, FolderKanban, Building2 } from "lucide-react";

const sections = [
  {
    title: "Начало работы",
    icon: BookOpen,
    links: [
      "Регистрация",
      "Создание профиля",
      "Как работает Voom",
      "Первый маршрут",
      "Правила сервиса"
    ]
  },
  {
    title: "Безопасность",
    icon: Shield,
    links: [
      "Проверка пользователей",
      "Рейтинг и отзывы",
      "Жалобы",
      "Безопасность поездок"
    ]
  },
  {
    title: "Поездки и маршруты",
    icon: Code2,
    links: [
      "Создание маршрута",
      "Поиск поездки",
      "Бронирование",
      "Отмена поездки"
    ]
  },
  {
    title: "Водителям",
    icon: Bot,
    links: [
      "Как стать водителем",
      "Требования",
      "Доход",
      "Управление поездками"
    ]
  },
  {
    title: "Пассажирам",
    icon: Smartphone,
    links: [
      "Как найти поездку",
      "Оплата",
      "История поездок",
      "Поддержка"
    ]
  },
  {
    title: "Управление аккаунтом",
    icon: Settings,
    links: [
      "Настройки профиля",
      "Смена языка",
      "Удаление аккаунта"
    ]
  },
  {
    title: "Поддержка",
    icon: FolderKanban,
    links: [
      "FAQ",
      "Связаться с нами",
      "Проблемы и решения"
    ]
  },
  {
    title: "Для бизнеса",
    icon: Building2,
    links: [
      "Партнерство",
      "Реклама",
      "API документация"
    ]
  }
];

const DocsGrid = () => {
  return (
    <section className="bg-white text-white py-16">
      
      <div className="max-w-[1100px] mx-auto px-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {sections.map((section, idx) => {
            const Icon = section.icon;

            return (
              <div key={idx}>
                
                {/* TITLE */}
                <div className="flex items-center gap-3 mb-4">
                  <Icon size={20} className="text-black" />
                  <h3 className="text-lg font-semibold text-black">
                    {section.title}
                  </h3>
                </div>

                {/* LINKS */}
                <div className="flex flex-col gap-2">
                  {section.links.map((link, i) => (
                    <a
                      key={i}
                      href="#"
                      className="text-black hover:underline text-sm"
                    >
                      {link}
                    </a>
                  ))}
                </div>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
};

export default DocsGrid;