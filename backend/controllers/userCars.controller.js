// controllers/userCar.controller.js
import crypto from "crypto";
import UserCar from "../models/UserCar.js";
import Brand from "../models/Brand.js";
import CarModel from "../models/CarModel.js";
import CarColor from "../models/CarColor.js";
import { uploadToR2 } from "../utils/r2Upload.js";
import { deleteFromR2 } from "../utils/r2Delete.js";

/* ===============================
   HELPERS
=============================== */
const updateCarStatus = (car) => {
  if (car.status === "blocked") return;
  car.status =
    car.plateNumber && car.productionYear && car.photos.length > 0
      ? "active"
      : "draft";
};

/**
 * ===============================
 * POST /api/profile/cars
 * create draft transport
 * ===============================
 */
export const createUserCar = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      brandId,
      customBrand,
      modelId,
      customModel,
      colorId,
      customColor,
    } = req.body;

    if (!brandId && !customBrand) {
      return res.status(400).json({ message: "Brand is required" });
    }

    if (!modelId && !customModel) {
      return res.status(400).json({ message: "Model is required" });
    }

    if (!colorId && !customColor) {
      return res.status(400).json({ message: "Color is required" });
    }

    if (brandId) {
      const brand = await Brand.findOne({ _id: brandId, status: "active" });
      if (!brand) return res.status(404).json({ message: "Brand not found" });
    }

    if (modelId) {
      const model = await CarModel.findOne({
        _id: modelId,
        ...(brandId ? { brand: brandId } : {}),
        status: "active",
      });
      if (!model) return res.status(404).json({ message: "Car model not found" });
    }

    if (colorId) {
      const color = await CarColor.findOne({ _id: colorId, status: "active" });
      if (!color) return res.status(404).json({ message: "Car color not found" });
    }

    const car = await UserCar.create({
      user: userId,
      brand: brandId || null,
      customBrand: brandId ? null : customBrand?.trim() || null,
      model: modelId || null,
      customModel: modelId ? null : customModel?.trim() || null,
      color: colorId || null,
      customColor: colorId ? null : customColor?.trim() || null,
      status: "draft",
    });

    return res.status(201).json(car);
  } catch (error) {
    console.error("createUserCar error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * ===============================
 * GET /api/profile/cars
 * list my transports
 * ===============================
 */
export const getMyCars = async (req, res) => {
  try {
    const cars = await UserCar.find({ user: req.user.id })
      .populate("brand", "name logo")
      .populate("model", "name")
      .populate("color", "nameRu nameUz nameEn hex")
      .sort({ createdAt: -1 });

    return res.json(cars);
  } catch (error) {
    console.error("getMyCars error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * ===============================
 * GET /api/profile/cars/:id
 * get one transport
 * ===============================
 */
export const getMyCarById = async (req, res) => {
  try {
    const car = await UserCar.findOne({ _id: req.params.id, user: req.user.id })
      .populate("brand", "name logo")
      .populate("model", "name")
      .populate("color", "nameRu nameUz nameEn hex");

    if (!car) return res.status(404).json({ message: "Transport not found" });

    return res.json(car);
  } catch (error) {
    console.error("getMyCarById error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * ===============================
 * PATCH /api/profile/cars/:id
 * update transport main data
 * ===============================
 */
export const updateMyCar = async (req, res) => {
  try {
    const { plateNumber, productionYear } = req.body;

    const car = await UserCar.findOne({ _id: req.params.id, user: req.user.id });
    if (!car) return res.status(404).json({ message: "Transport not found" });

    if (plateNumber !== undefined) car.plateNumber = plateNumber || null;
    if (productionYear !== undefined) car.productionYear = productionYear || null;

    updateCarStatus(car);
    await car.save();
    return res.json(car);
  } catch (error) {
    console.error("updateMyCar error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * ===============================
 * POST /api/profile/cars/:id/photos
 * upload transport photo
 * ===============================
 */
export const uploadCarPhoto = async (req, res) => {
  try {
    const car = await UserCar.findOne({ _id: req.params.id, user: req.user.id });
    if (!car) return res.status(404).json({ message: "Transport not found" });

    if (!req.file) {
      return res.status(400).json({ message: "Photo file is required" });
    }

    if (car.photos.length >= 10) {
      return res.status(400).json({ message: "Maximum 10 photos allowed" });
    }

    const ext = req.file.mimetype.split("/")[1];
    const key = `cars/${car._id}/${crypto.randomUUID()}.${ext}`;

    const url = await uploadToR2({
      buffer: req.file.buffer,
      mimeType: req.file.mimetype,
      key,
    });

    car.photos.push({ url, key });

    if (car.photos.length > 10) {
      await deleteFromR2(key);
      return res.status(400).json({ message: "Maximum 10 photos allowed" });
    }

    updateCarStatus(car);
    await car.save();
    return res.json(car);
  } catch (error) {
    console.error("uploadCarPhoto error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * ===============================
 * DELETE /api/profile/cars/:id/photos/:photoId
 * delete transport photo
 * ===============================
 */
export const deleteCarPhoto = async (req, res) => {
  try {
    const car = await UserCar.findOne({ _id: req.params.id, user: req.user.id });
    if (!car) return res.status(404).json({ message: "Transport not found" });

    const photo = car.photos.id(req.params.photoId);
    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    await deleteFromR2(photo.key);

    car.photos = car.photos.filter(
      (p) => p._id.toString() !== photo._id.toString()
    );

    updateCarStatus(car);
    await car.save();
    return res.json(car);
  } catch (error) {
    console.error("deleteCarPhoto error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * ===============================
 * DELETE /api/profile/cars/:id
 * delete transport with all photos
 * ===============================
 */
export const deleteMyCar = async (req, res) => {
  try {
    const car = await UserCar.findOne({ _id: req.params.id, user: req.user.id });
    if (!car) return res.status(404).json({ message: "Transport not found" });

    for (const photo of car.photos) {
      await deleteFromR2(photo.key);
    }

    await car.deleteOne();
    return res.json({ success: true });
  } catch (error) {
    console.error("deleteMyCar error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
