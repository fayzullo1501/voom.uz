// controllers/route.controller.js
import Route from "../models/Route.js";
import City from "../models/City.js";
import UserCar from "../models/UserCar.js";
import axios from "axios";
import env from "../config/env.js";

/**
 * ===============================
 * POST /api/profile/routes
 * create route
 * ===============================
 */
export const createRoute = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      carId,
      fromCityId,
      toCityId,
      departureAt,
      seatsFront,
      seatsBack,
      priceFront,
      priceBack,
      comment,
    } = req.body;

    // ===== BASIC VALIDATION =====
    if (
      !carId ||
      !fromCityId ||
      !toCityId ||
      !departureAt ||
      seatsFront === undefined ||
      seatsBack === undefined ||
      priceFront === undefined ||
      priceBack === undefined
    ) {
      return res.status(400).json({ message: "required_fields_missing" });
    }

    if (fromCityId === toCityId) {
      return res.status(400).json({ message: "cities_must_be_different" });
    }

    // ===== CHECK CAR =====
    const car = await UserCar.findOne({
      _id: carId,
      user: userId,
    });

    if (!car) {
      return res.status(400).json({ message: "car_not_available" });
    }

    // ===== CHECK CITIES =====
    const fromCity = await City.findById(fromCityId);
    const toCity = await City.findById(toCityId);

    if (!fromCity || !toCity) {
      return res.status(404).json({ message: "city_not_found" });
    }

    // ===== CALCULATE DISTANCE & DURATION USING GOOGLE =====

    const departureDate = new Date(departureAt);

    let arrivalDate = null;
    let distanceMeters = null;
    let durationSeconds = null;

    let polyline = "";

    try {
      console.log("GOOGLE KEY:", env.GOOGLE_MAPS_API_KEY);

      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/directions/json",
        {
          params: {
            origin: `${fromCity.lat},${fromCity.lon}`,
            destination: `${toCity.lat},${toCity.lon}`,
            mode: "driving",
            key: env.GOOGLE_MAPS_API_KEY,
          },
        }
      );

      console.log("GOOGLE STATUS:", response.data.status);
      console.log("GOOGLE ERROR:", response.data.error_message);
      console.log("GOOGLE ROUTES LENGTH:", response.data.routes?.length);

      if (response.data.status !== "OK") {
        console.log("GOOGLE FULL RESPONSE:", response.data);
      }

      const routeData = response.data.routes?.[0];
      const leg = routeData?.legs?.[0];

      if (routeData && leg) {
        distanceMeters = leg.distance?.value;
        durationSeconds = leg.duration?.value;

        if (durationSeconds) {
          arrivalDate = new Date(
            departureDate.getTime() + durationSeconds * 1000
          );
        }

        polyline = routeData.overview_polyline?.points || "";
      }
    } catch (err) {
      console.error("Google Directions error:", err.message);
    }

    // ===== CREATE ROUTE =====
    const route = await Route.create({
      driver: userId,
      car: car._id,

      fromCity: fromCity._id,
      toCity: toCity._id,

      fromName: fromCity.nameRu,
      toName: toCity.nameRu,

      fromLat: fromCity.lat,
      fromLon: fromCity.lon,

      toLat: toCity.lat,
      toLon: toCity.lon,

      polyline: polyline || "",

      departureAt: departureDate,
      arrivalAt: arrivalDate,
      distanceMeters,
      durationSeconds,

      seatsFront: Number(seatsFront),
      seatsBack: Number(seatsBack),

      availableSeatsFront: Number(seatsFront),
      availableSeatsBack: Number(seatsBack),

      priceFront: Number(priceFront),
      priceBack: Number(priceBack),

      comment: comment || "",
    });

    return res.status(201).json(route);
  } catch (error) {
    console.error("createRoute error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * ===============================
 * GET /api/profile/routes
 * list my routes
 * ===============================
 */
export const getMyRoutes = async (req, res) => {
  try {
    const { type = "active" } = req.query;

    let filter = { driver: req.user._id };

    if (type === "active") {
      filter = {
        ...filter,
        status: { $in: ["active", "in_progress"] },
      };
    }

    if (type === "archive") {
      filter = {
        ...filter,
        status: { $in: ["completed", "cancelled"] },
      };
    }

    const routes = await Route.find(filter)
      .populate("car")
      .populate("fromCity", "nameRu region")
      .populate("toCity", "nameRu region")
      .populate({
        path: "bookings",
        select: "status seatsCount totalPrice",
      })
      .sort({ departureAt: -1 });

    return res.json(routes);
  } catch (error) {
    console.error("getMyRoutes error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * ===============================
 * GET /api/profile/routes/:id
 * get one route
 * ===============================
 */
export const getMyRouteById = async (req, res) => {
  try {
    const route = await Route.findOne({
      _id: req.params.id,
      driver: req.user._id,
    })
      .populate({
        path: "car",
        populate: [
          { path: "brand", select: "name logo.url logo.key status" },
          { path: "model", select: "name" },
          { path: "color", select: "nameRu hex" }
        ]
      })
      .populate("fromCity", "nameRu region")
      .populate("toCity", "nameRu region")
      .populate({
        path: "bookings",
        populate: {
          path: "passenger",
          select: "firstName lastName phone profilePhoto",
        },
      });

    if (!route) {
      return res.status(404).json({ message: "route_not_found" });
    }

    return res.json(route);

  } catch (error) {
    console.error("getMyRouteById error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * ===============================
 * PATCH /api/profile/routes/:id/status
 * update status
 * ===============================
 */
export const updateRouteStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "active",
      "in_progress",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "invalid_status" });
    }

    const route = await Route.findOne({
      _id: req.params.id,
      driver: req.user._id,
    });

    if (!route) {
      return res.status(404).json({ message: "route_not_found" });
    }

    const currentStatus = route.status;

    // ===== STATE MACHINE =====

    const validTransitions = {
      active: ["in_progress", "cancelled"],
      in_progress: ["completed"],
      completed: [],
      cancelled: [],
    };

    if (!validTransitions[currentStatus].includes(status)) {
      return res.status(400).json({
        message: "invalid_status_transition",
      });
    }

    route.status = status;
    await route.save();

    return res.json(route);
  } catch (error) {
    console.error("updateRouteStatus error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * ===============================
 * GET /api/routes
 * public search routes
 * ===============================
 */
export const searchRoutes = async (req, res) => {
  try {
    const { from, to, date, passengers = 1 } = req.query;

    if (!from || !to || !date) {
      return res.status(400).json({ message: "missing_params" });
    }

    // Узбекистан UTC+5
    const tzOffset = 5 * 60; // минуты

    // создаём локальную полночь
    const localStart = new Date(`${date}T00:00:00`);
    const localEnd = new Date(`${date}T23:59:59.999`);

    // переводим в UTC
    const start = new Date(localStart.getTime() - tzOffset * 60 * 1000);
    const end = new Date(localEnd.getTime() - tzOffset * 60 * 1000);

    const routes = await Route.find({
      fromCity: from,
      toCity: to,
      departureAt: { $gte: start, $lte: end },
      status: "active",
      $expr: {
        $gte: [
          { $add: ["$availableSeatsFront", "$availableSeatsBack"] },
          Number(passengers),
        ],
      },
    })
      .populate({
        path: "car",
        populate: [
          { path: "brand", select: "name logo.url logo.key status" },
          { path: "model", select: "name" },
          { path: "color", select: "nameRu hex" }
        ]
      })
      .populate("driver", "firstName lastName phone phoneVerified passport profilePhoto")
      .populate("fromCity", "nameRu region")
      .populate("toCity", "nameRu region")
      .sort({ departureAt: 1 });

    const sanitizedRoutes = routes.map((route) => {
      const r = route.toObject();

      if (r.driver?.profilePhoto?.status !== "approved") {
        r.driver.profilePhoto = null;
      }

      return r;
    });

    res.json(sanitizedRoutes);
  } catch (error) {
    console.error("searchRoutes error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


/**
 * ===============================
 * GET /api/routes/:id
 * public route details
 * ===============================
 */
export const getRouteByIdPublic = async (req, res) => {
  try {
    const route = await Route.findOne({
      _id: req.params.id,
      status: "active",
    })
      .populate({
        path: "car",
        populate: [
          { path: "brand", select: "name logo.url logo.key status" },
          { path: "model", select: "name" },
          { path: "color", select: "nameRu hex" },
        ],
      })
      .populate(
        "driver",
        "firstName lastName phone phoneVerified passport profilePhoto"
      )
      .populate("fromCity", "nameRu region")
      .populate("toCity", "nameRu region");

    if (!route) {
      return res.status(404).json({ message: "route_not_found" });
    }

    const r = route.toObject();

    if (r.driver?.profilePhoto?.status !== "approved") {
      r.driver.profilePhoto = null;
    }

    return res.json(r);
  } catch (error) {
    console.error("getRouteByIdPublic error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};