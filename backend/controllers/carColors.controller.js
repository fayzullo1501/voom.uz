// controllers/carColors.controller.js
import CarColor from "../models/CarColor.js";
import mongoose from "mongoose";

/**
 * ===============================
 * GET /admin/colors
 * list + search + filters + pagination
 * query: search, status, from, to, page, limit
 * ===============================
 */
export const getColors = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

    const { search, status, from, to } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const query = {};

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { nameRu: new RegExp(s, "i") },
        { nameUz: new RegExp(s, "i") },
        { nameEn: new RegExp(s, "i") },
        { hex: new RegExp(s, "i") },
      ];
    }

    if (status) query.status = status;

    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const [items, total] = await Promise.all([
      CarColor.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      CarColor.countDocuments(query),
    ]);

    res.json({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("ADMIN GET COLORS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ===============================
 * POST /admin/colors
 * create color
 * ===============================
 */
export const createColor = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

    const { nameRu, nameUz, nameEn, hex, status } = req.body;

    if (!nameRu?.trim() || !nameUz?.trim() || !nameEn?.trim()) return res.status(400).json({ message: "name_required" });
    if (!hex || !/^#([0-9A-Fa-f]{6})$/.test(hex)) return res.status(400).json({ message: "hex_invalid" });

    const color = await CarColor.create({
      nameRu: nameRu.trim(),
      nameUz: nameUz.trim(),
      nameEn: nameEn.trim(),
      hex: hex.toUpperCase(),
      status: status || "active",
    });

    res.status(201).json(color);
  } catch (err) {
    if (err?.code === 11000) return res.status(400).json({ message: "color_exists" });
    console.error("ADMIN CREATE COLOR ERROR:", err);
    res.status(400).json({ message: "create_failed" });
  }
};

/**
 * ===============================
 * PUT /admin/colors/:id
 * update color
 * ===============================
 */
export const updateColor = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "invalid_id" });

    const { nameRu, nameUz, nameEn, hex, status } = req.body;
    const update = {};

    if (nameRu?.trim()) update.nameRu = nameRu.trim();
    if (nameUz?.trim()) update.nameUz = nameUz.trim();
    if (nameEn?.trim()) update.nameEn = nameEn.trim();
    if (hex && /^#([0-9A-Fa-f]{6})$/.test(hex)) update.hex = hex.toUpperCase();
    if (status) update.status = status;

    const color = await CarColor.findByIdAndUpdate(req.params.id, update, { new: true });

    if (!color) return res.status(404).json({ message: "color_not_found" });

    res.json(color);
  } catch (err) {
    if (err?.code === 11000) return res.status(400).json({ message: "color_exists" });
    console.error("ADMIN UPDATE COLOR ERROR:", err);
    res.status(400).json({ message: "update_failed" });
  }
};

/**
 * ===============================
 * DELETE /admin/colors
 * bulk delete
 * ===============================
 */
export const deleteColors = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

    const { ids } = req.body;
    if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ message: "ids_required" });

    await CarColor.deleteMany({ _id: { $in: ids } });

    res.json({ success: true });
  } catch (err) {
    console.error("ADMIN DELETE COLORS ERROR:", err);
    res.status(400).json({ message: "delete_failed" });
  }
};
