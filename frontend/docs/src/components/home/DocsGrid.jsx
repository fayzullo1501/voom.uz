import {
  BookOpen,
  Shield,
  Code2,
  Bot,
  Settings,
  Smartphone,
  FolderKanban,
  Building2
} from "lucide-react";

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const DocsGrid = () => {
  const { t } = useTranslation("docs");
  const { lang } = useParams();

  const sections = [
    {
      key: "start",
      title: "Начало работы",
      icon: BookOpen,
      links: [
        { id: "whatIsVoom" },
        { id: "howItWorks" },
        { id: "registration" },
        { id: "login" },
        { id: "socialLogin" },
        { id: "recovery" }
      ]
    },
    {
      key: "profile",
      title: "Профиль и верификация",
      icon: Shield,
      links: []
    },
    {
      key: "routes",
      title: "Поездки и маршруты",
      icon: Code2,
      links: []
    },
    {
      key: "drivers",
      title: "Водителям",
      icon: Bot,
      links: []
    },
    {
      key: "passengers",
      title: "Пассажирам",
      icon: Smartphone,
      links: []
    },
    {
      key: "account",
      title: "Управление аккаунтом",
      icon: Settings,
      links: []
    },
    {
      key: "support",
      title: "Поддержка",
      icon: FolderKanban,
      links: []
    },
    {
      key: "business",
      title: "Для бизнеса",
      icon: Building2,
      links: []
    }
  ];

  return (
    <section className="bg-white py-16">
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
                      href={`/${lang || "ru"}/docs/${section.key}#${link.id}`}
                      className="text-black hover:underline text-sm"
                    >
                      {t(`${section.key}.items.${link.id}.label`)}
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