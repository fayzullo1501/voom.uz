import User from "../models/User.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import UserCar from "../models/UserCar.js";
import Route from "../models/Route.js";  
import Booking from "../models/Booking.js";
/**
 * ===============================
 * HELPERS
 * ===============================
 */
const calcVerified = (u) =>
  Boolean(
    u.phoneVerified &&
    u.passport?.status === "approved" &&
    u.profilePhoto?.status === "approved"
  );

  const hasPendingFiles = (u) =>
    u.profilePhoto?.status === "pending" ||
    u.passport?.status === "pending";

  const getPendingAt = (u) => {
    const times = [];

    if (u.profilePhoto?.status === "pending" && u.profilePhoto.uploadedAt) {
      times.push(u.profilePhoto.uploadedAt);
    }

    if (u.passport?.status === "pending" && u.passport.uploadedAt) {
      times.push(u.passport.uploadedAt);
    }

    if (!times.length) return null;

    return new Date(Math.max(...times.map((t) => new Date(t).getTime())));
  };


  const buildUserFiles = (user) => {
  const files = [];

  if (user.profilePhoto?.url) {
    files.push({
      _id: "profilePhoto",
      name: "Фото профиля",
      type: "profile_photo",
      url: user.profilePhoto.url,
      status: user.profilePhoto.status, // pending | approved
      createdAt: user.profilePhoto.uploadedAt,
    });
  }

  if (user.passport?.url) {
    files.push({
      _id: "passport",
      name: "Паспорт",
      type: "passport",
      url: user.passport.url,
      status: user.passport.status,
      rejectionReason: user.passport.rejectionReason,
      createdAt: user.passport.uploadedAt,
    });
  }


  return files;
};

/**
 * ===============================
 * GET /admin/users
 * search, filters, date range
 * ===============================
 */
export const getUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { search, role, phoneVerified, from, to } = req.query;

    const query = {};

    /* SEARCH */
    if (search) {
      const regex = new RegExp(search, "i");

      const or = [
        { firstName: regex },
        { lastName: regex },
        { phone: regex },
        { email: regex },
      ];

      if (mongoose.Types.ObjectId.isValid(search)) {
        or.push({ _id: search });
      }

      query.$or = or;
    }

    /* FILTERS */
    if (role) query.role = role;

    if (phoneVerified !== undefined) {
      query.phoneVerified = phoneVerified === "true";
    }

    /* DATE RANGE */
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const users = await User.find(query)
      .select(
        "_id firstName lastName phone email role phoneVerified passport profilePhoto createdAt"
      )
      .lean();

    const result = users
      .map((u) => {
        const pendingDates = [];

        if (u.profilePhoto?.status === "pending" && u.profilePhoto.uploadedAt) {
          pendingDates.push(new Date(u.profilePhoto.uploadedAt));
        }

        if (u.passport?.status === "pending" && u.passport.uploadedAt) {
          pendingDates.push(new Date(u.passport.uploadedAt));
        }

        return {
          ...u,
          verified: calcVerified(u),
          hasPending:
            u.profilePhoto?.status === "pending" ||
            u.passport?.status === "pending",
          pendingAt: pendingDates.length
            ? new Date(Math.max(...pendingDates.map((d) => d.getTime())))
            : null,
        };
      })
      .sort((a, b) => {
        if (a.hasPending && b.hasPending) {
          return new Date(b.pendingAt) - new Date(a.pendingAt);
        }
        if (a.hasPending) return -1;
        if (b.hasPending) return 1;

        return new Date(b.createdAt) - new Date(a.createdAt);
      });

    res.json(result);
  } catch (err) {
    console.error("ADMIN GET USERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ===============================
 * POST /admin/users
 * create user
 * ===============================
 */
export const createUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { password, ...rest } = req.body;

    if (!rest.phone) {
      delete rest.phone;
    }

    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      ...rest,
      passwordHash,
    });

    res.status(201).json(user);
  } catch (err) {
    console.error("ADMIN CREATE USER ERROR:", err);
    res.status(400).json({ message: "Create failed" });
  }
};

/**
 * ===============================
 * PUT /admin/users/:id
 * update user
 * ===============================
 */
export const updateUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { password, ...rest } = req.body;

    const update = { ...rest };

    if (password) {
      update.passwordHash = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("ADMIN UPDATE USER ERROR:", err);
    res.status(400).json({ message: "Update failed" });
  }
};

/**
 * ===============================
 * DELETE /admin/users/:id
 * ===============================
 */
export const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("ADMIN DELETE USER ERROR:", err);
    res.status(400).json({ message: "Delete failed" });
  }
};

/**
 * ===============================
 * GET /admin/users/:id
 * get single user for admin
 * ===============================
 */
export const getUserById = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    /* ===============================
       USER
    =============================== */
    const user = await User.findById(userId)
      .select(
        "_id firstName lastName birthDate about phone email role phoneVerified passport profilePhoto rating reviewsCount createdAt"
      )
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    /* ===============================
       CARS
    =============================== */
    const cars = await UserCar.find({ user: userId })
      .populate("brand", "name logo")
      .populate("model", "name")
      .populate("color", "nameRu nameUz nameEn hex")
      .sort({ createdAt: -1 })
      .lean();

    /* ===============================
       ROUTES (как водитель)
    =============================== */
    const routesRaw = await Route.find({ driver: userId })
    .populate("fromCity", "nameRu")
    .populate("toCity", "nameRu")
    .populate({
      path: "car",
      populate: [
        { path: "brand", select: "name logo" },
        { path: "model", select: "name" },     // 👈 ВОТ ЭТО ГЛАВНОЕ
        { path: "color", select: "nameRu hex" }
      ]
    })
    .sort({ departureAt: -1 })
    .lean();

    const routes = [];

    for (const route of routesRaw) {
      const acceptedBookings = await Booking.find({
        route: route._id,
        status: "accepted",
      })
        .populate(
          "passenger",
          "firstName lastName phone profilePhoto"
        )
        .lean();

      const confirmedPassengers = acceptedBookings
        .filter((b) => b.passenger)
        .map((b) => ({
          _id: b.passenger._id,
          firstName: b.passenger.firstName,
          lastName: b.passenger.lastName,
          phone: b.passenger.phone,
          profilePhoto: b.passenger.profilePhoto,
        }));

      routes.push({
        ...route,
        confirmedPassengers,
      });
    }

    /* ===============================
       BOOKINGS (как пассажир)
    =============================== */
    const bookingsRaw = await Booking.find({ passenger: userId })
      .populate({
        path: "route",
        populate: [
          { path: "fromCity", select: "nameRu" },
          { path: "toCity", select: "nameRu" },
          {
            path: "driver",
            select:
              "firstName lastName phone profilePhoto rating reviewsCount",
          },
          {
            path: "car",
            populate: [
              { path: "brand", select: "name logo" },
              { path: "model", select: "name" },
              { path: "color", select: "nameRu hex" },
            ],
          },
        ],
      })
      .sort({ createdAt: -1 })
      .lean();

    const bookings = [];

    for (const booking of bookingsRaw) {
      const routeId = booking.route?._id;

      let confirmedPassengers = [];

      if (routeId) {
        const acceptedBookings = await Booking.find({
          route: routeId,
          status: "accepted",
        })
          .populate(
            "passenger",
            "firstName lastName phone profilePhoto"
          )
          .lean();

        confirmedPassengers = acceptedBookings
          .filter((b) => b.passenger)
          .map((b) => ({
            _id: b.passenger._id,
            firstName: b.passenger.firstName,
            lastName: b.passenger.lastName,
            phone: b.passenger.phone,
            profilePhoto: b.passenger.profilePhoto,
            seatType: b.seatType,
            seatsCount: b.seatsCount,
            totalPrice: b.totalPrice,
          }));
      }

      bookings.push({
        ...booking,
        confirmedPassengers,
      });
    }

    /* ===============================
       RESPONSE
    =============================== */
    return res.json({
      ...user,
      verified: calcVerified(user),
      files: buildUserFiles(user),
      cars,
      routes,
      bookings,
    });

  } catch (err) {
    console.error("ADMIN GET USER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * ===============================
 * POST /admin/users/:id/photo/approve
 * ===============================
 */
export const approveProfilePhoto = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.profilePhoto || user.profilePhoto.status !== "pending") {
      return res.status(400).json({ message: "photo_not_pending" });
    }

    user.profilePhoto.status = "approved";
    user.profilePhoto.rejectionReason = "";
    user.profilePhoto.reviewedAt = new Date();

    await user.save();

    res.json({
      ok: true,
      profilePhoto: user.profilePhoto,
    });
  } catch (err) {
    console.error("APPROVE PROFILE PHOTO ERROR:", err);
    res.status(500).json({ message: "approve_failed" });
  }
};


/**
 * ===============================
 * POST /admin/users/:id/photo/reject
 * ===============================
 */
export const rejectProfilePhoto = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: "rejection_reason_required" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.profilePhoto || user.profilePhoto.status !== "pending") {
      return res.status(400).json({ message: "photo_not_pending" });
    }

    user.profilePhoto.status = "rejected";
    user.profilePhoto.rejectionReason = reason.trim();
    user.profilePhoto.reviewedAt = new Date();

    await user.save();

    res.json({
      ok: true,
      profilePhoto: user.profilePhoto,
    });
  } catch (err) {
    console.error("REJECT PROFILE PHOTO ERROR:", err);
    res.status(500).json({ message: "reject_failed" });
  }
};

/**
 * ===============================
 * POST /admin/users/:id/passport/approve
 * ===============================
 */
export const approvePassport = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await User.findById(req.params.id);
    if (!user || !user.passport || user.passport.status !== "pending") {
      return res.status(400).json({ message: "passport_not_pending" });
    }

    user.passport.status = "approved";
    user.passport.rejectionReason = "";
    user.passport.reviewedAt = new Date();

    await user.save();

    res.json({ ok: true, passport: user.passport });
  } catch (err) {
    console.error("APPROVE PASSPORT ERROR:", err);
    res.status(500).json({ message: "approve_failed" });
  }
};

/**
 * ===============================
 * POST /admin/users/:id/passport/reject
 * ===============================
 */
export const rejectPassport = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { reason } = req.body;
    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: "rejection_reason_required" });
    }

    const user = await User.findById(req.params.id);
    if (!user || !user.passport || user.passport.status !== "pending") {
      return res.status(400).json({ message: "passport_not_pending" });
    }

    user.passport.status = "rejected";
    user.passport.rejectionReason = reason.trim();
    user.passport.reviewedAt = new Date();

    await user.save();

    res.json({ ok: true, passport: user.passport });
  } catch (err) {
    console.error("REJECT PASSPORT ERROR:", err);
    res.status(500).json({ message: "reject_failed" });
  }
};
