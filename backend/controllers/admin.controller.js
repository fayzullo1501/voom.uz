import User from "../models/User.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * ===============================
 * HELPERS
 * ===============================
 */
const calcVerified = (u) =>
  Boolean(
    u.phoneVerified &&
    u.passportVerified &&
    u.profilePhoto?.status === "approved"
  );

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

  // 🔜 в будущем:
  // if (user.passport?.url) { ... }

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

    const {
      search,
      role,
      phoneVerified,
      from,
      to,
    } = req.query;

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
      .sort({ createdAt: -1 })
      .select(
        "_id firstName lastName phone email role phoneVerified passportVerified profilePhoto createdAt"
      )
      .lean();

    const result = users.map((u) => ({
      ...u,
      verified: calcVerified(u),
    }));

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

    const user = await User.findById(req.params.id)
      .select(
        "_id firstName lastName birthDate about phone email role phoneVerified passportVerified profilePhoto createdAt"
      )
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      ...user,
      verified: calcVerified(user),
      files: buildUserFiles(user),
    });
  } catch (err) {
    console.error("ADMIN GET USER ERROR:", err);
    res.status(500).json({ message: "Server error" });
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
