// controllers/share.controller.js
import Route from "../models/Route.js";

export const getRouteSharePage = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id)
      .populate("car")
      .populate("driver", "firstName lastName")
      .populate("fromCity", "nameRu")
      .populate("toCity", "nameRu");

    if (!route) {
      return res.status(404).send("Not found");
    }

    const { lang } = req.params;

    const safeLang = ["ru", "uz", "en"].includes(lang) ? lang : "ru";

    const shareUrl = `${process.env.FRONTEND_URL}/${safeLang}/routes/${route._id}`;
    const imageUrl = route.car?.photos?.[0]?.url
    ? route.car.photos[0].url.startsWith("http")
        ? route.car.photos[0].url
        : `${process.env.API_URL}${route.car.photos[0].url}`
    : `${process.env.FRONTEND_URL}/default-share.jpg`;

    const date = new Date(route.departureAt).toLocaleString("ru-RU", {
    timeZone: "Asia/Tashkent",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    });

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta property="og:title" content="${route.fromCity.nameRu} → ${route.toCity.nameRu}" />
          <meta property="og:description" content="📅 ${date} · 👤 ${route.driver.firstName}" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="${shareUrl}" />
          <meta name="twitter:card" content="summary_large_image" />
        </head>
        <body>
            <meta http-equiv="refresh" content="0; url=${shareUrl}" />
            Redirecting...
        </body>
      </html>
    `;

    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};