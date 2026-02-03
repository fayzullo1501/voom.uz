// controllers/brands.controller.js
import Brand from "../models/Brand.js";
import mongoose from "mongoose";
import { uploadToR2 } from "../utils/r2Upload.js";

/**
 * ===============================
 * GET /admin/brands
 * list + search + filters
 * ===============================
 */
export const getBrands = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { search, status, from, to } = req.query;
    const query = {};

    /* SEARCH */
    if (search) {
      query.name = new RegExp(search, "i");
    }

    /* STATUS */
    if (status) {
      query.status = status;
    }

    /* DATE RANGE */
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const brands = await Brand.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.json(brands);
  } catch (err) {
    console.error("ADMIN GET BRANDS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ===============================
 * POST /admin/brands
 * create brand
 * ===============================
 */
export const createBrand = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { name, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "name_required" });
    }

    const exists = await Brand.findOne({
      name: name.trim(),
    });

    if (exists) {
      return res.status(400).json({ message: "brand_exists" });
    }

    const brand = await Brand.create({
      name: name.trim(),
      status: status || "active",
    });

    res.status(201).json(brand);
  } catch (err) {
    console.error("ADMIN CREATE BRAND ERROR:", err);
    res.status(400).json({ message: "Create failed" });
  }
};

/**
 * ===============================
 * PUT /admin/brands/:id
 * update brand
 * ===============================
 */
export const updateBrand = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "invalid_id" });
    }

    const { name, status } = req.body;

    const update = {};

    if (name && name.trim()) {
      update.name = name.trim();
    }

    if (status) {
      update.status = status;
    }

    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    res.json(brand);
  } catch (err) {
    console.error("ADMIN UPDATE BRAND ERROR:", err);
    res.status(400).json({ message: "Update failed" });
  }
};

/**
 * ===============================
 * DELETE /admin/brands
 * bulk delete
 * ===============================
 */
export const deleteBrands = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { ids } = req.body;

    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ message: "ids_required" });
    }

    await Brand.deleteMany({
      _id: { $in: ids },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("ADMIN DELETE BRANDS ERROR:", err);
    res.status(400).json({ message: "Delete failed" });
  }
};

/**
 * ===============================
 * POST /admin/brands/:id/logo
 * upload / replace brand logo
 * ===============================
 */
export const uploadBrandLogo = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "invalid_id" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "file_required" });
    }

    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    const key = `brands/${brand._id}.png`;

    const url = await uploadToR2({
      buffer: req.file.buffer,
      mimeType: req.file.mimetype,
      key,
    });

    brand.logo = {
      url,
      key,
    };

    await brand.save();

    res.json(brand);
  } catch (err) {
    console.error("UPLOAD BRAND LOGO ERROR:", err);
    res.status(500).json({ message: "upload_failed" });
  }
};
