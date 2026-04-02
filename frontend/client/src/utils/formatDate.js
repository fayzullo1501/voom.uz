const UZ_MONTHS_LONG = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
];

const UZ_WEEKDAYS_LONG = [
  "yakshanba", "dushanba", "seshanba", "chorshanba",
  "payshanba", "juma", "shanba",
];

/**
 * Returns a locale string safe for all browsers.
 * uz-UZ is not supported → use manual Uzbek formatting.
 */
export const safeLocale = (lang) => {
  if (lang === "en") return "en-US";
  return "ru-RU"; // used for ru AND uz (uz-UZ broken in most browsers)
};

/**
 * "30 aprel, payshanba" for uz
 * "30 апреля, четверг" for ru
 * "April 30, Thursday" for en
 */
export const formatDateLong = (date, lang) => {
  const d = new Date(date);

  if (lang === "uz") {
    const day = d.getDate();
    const month = UZ_MONTHS_LONG[d.getMonth()];
    const weekday = UZ_WEEKDAYS_LONG[d.getDay()];
    return `${day} ${month}, ${weekday}`;
  }

  const locale = lang === "en" ? "en-US" : "ru-RU";
  return d.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

/**
 * Short date: "30.04.2025" for ru/uz, "04/30/2025" for en
 */
export const formatDateShort = (date, lang) => {
  const d = new Date(date);

  if (lang === "uz") {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  }

  const locale = lang === "en" ? "en-US" : "ru-RU";
  return d.toLocaleDateString(locale);
};

/**
 * Time only: "10:00"
 */
export const formatTime = (date, lang) => {
  const locale = lang === "en" ? "en-US" : "ru-RU";
  return new Date(date).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
};
