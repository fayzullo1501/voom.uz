// controllers/carModels.controller.js
import CarModel from "../models/CarModel.js";
import mongoose from "mongoose";

/**
 * ===============================
 * GET /admin/models
 * list + search + filters
 * ===============================
 */
export const getModels = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { search, brand, status, from, to } = req.query;
    const query = {};

    if (search) {
      query.name = new RegExp(search, "i");
    }

    if (brand && mongoose.Types.ObjectId.isValid(brand)) {
      query.brand = brand;
    }

    if (status) {
      query.status = status;
    }

    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const models = await CarModel.find(query)
      .populate("brand", "name logo")
      .sort({ createdAt: -1 })
      .lean();

    res.json(models);
  } catch (err) {
    console.error("ADMIN GET MODELS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ===============================
 * POST /admin/models
 * create model
 * ===============================
 */
export const createModel = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { name, brand, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "name_required" });
    }

    if (!brand || !mongoose.Types.ObjectId.isValid(brand)) {
      return res.status(400).json({ message: "brand_required" });
    }

    const model = await CarModel.create({
      name: name.trim(),
      brand,
      status: status || "active",
    });

    res.status(201).json(model);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "model_exists_for_brand" });
    }

    console.error("ADMIN CREATE MODEL ERROR:", err);
    res.status(400).json({ message: "Create failed" });
  }
};

/**
 * ===============================
 * PUT /admin/models/:id
 * update model
 * ===============================
 */
export const updateModel = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "invalid_id" });
    }

    const { name, brand, status } = req.body;
    const update = {};

    if (name && name.trim()) update.name = name.trim();
    if (brand && mongoose.Types.ObjectId.isValid(brand)) update.brand = brand;
    if (status) update.status = status;

    const model = await CarModel.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }

    res.json(model);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "model_exists_for_brand" });
    }

    console.error("ADMIN UPDATE MODEL ERROR:", err);
    res.status(400).json({ message: "Update failed" });
  }
};

/**
 * ===============================
 * DELETE /admin/models
 * bulk delete
 * ===============================
 */
export const deleteModels = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { ids } = req.body;

    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ message: "ids_required" });
    }

    await CarModel.deleteMany({ _id: { $in: ids } });

    res.json({ success: true });
  } catch (err) {
    console.error("ADMIN DELETE MODELS ERROR:", err);
    res.status(400).json({ message: "Delete failed" });
  }
};
