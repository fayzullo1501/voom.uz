import Brand from "../models/Brand.js";
import CarModel from "../models/CarModel.js";
import CarColor from "../models/CarColor.js";
import mongoose from "mongoose";

/* ===== USER: BRANDS ===== */
export const getActiveBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ status: "active" })
      .sort({ name: 1 })
      .select("name logo")
      .lean();

    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: "server_error" });
  }
};

/* ===== USER: MODELS ===== */
export const getActiveModels = async (req, res) => {
  try {
    const { brand } = req.query;
    const query = { status: "active" };

    if (brand && mongoose.Types.ObjectId.isValid(brand)) {
      query.brand = brand;
    }

    const models = await CarModel.find(query)
      .sort({ name: 1 })
      .select("name brand")
      .lean();

    res.json(models);
  } catch (err) {
    res.status(500).json({ message: "server_error" });
  }
};

/* ===== USER: COLORS ===== */
export const getActiveColors = async (req, res) => {
  try {
    const colors = await CarColor.find({ status: "active" })
      .sort({ nameRu: 1 })
      .select("nameRu hex")
      .lean();

    res.json(colors);
  } catch (err) {
    res.status(500).json({ message: "server_error" });
  }
};

