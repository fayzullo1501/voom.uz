import Ad from "../models/Ad.js";
import { uploadToR2 } from "../utils/r2Upload.js";
import mongoose from "mongoose";

/**
 * CREATE AD
 */
export const createAd = async (req, res) => {

  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { title, content, banner, endDate } = req.body;

    const ad = await Ad.create({
      title,
      content,
      banner,
      endDate
    });

    res.status(201).json(ad);

  } catch (err) {

    console.error("CREATE AD ERROR:", err);
    res.status(500).json({ message: "Server error" });

  }

};

/**
 * ADMIN LIST
 */
export const getAdminAds = async (req, res) => {

  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const ads = await Ad.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json(ads);

  } catch (err) {

    console.error("GET ADS ERROR:", err);
    res.status(500).json({ message: "Server error" });

  }

};

/**
 * ADMIN DETAILS
 */
export const getAdminAdById = async (req, res) => {

  try {

    const ad = await Ad.findById(req.params.id).lean();

    if (!ad) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(ad);

  } catch (err) {

    console.error("GET AD ERROR:", err);
    res.status(500).json({ message: "Server error" });

  }

};

/**
 * DELETE
 */
export const deleteAds = async (req, res) => {

  try {

    const { ids } = req.body;

    await Ad.deleteMany({
      _id: { $in: ids }
    });

    res.json({ success: true });

  } catch (err) {

    console.error("DELETE ADS ERROR:", err);
    res.status(500).json({ message: "Server error" });

  }

};

/**
 * PUBLISH
 */
export const publishAds = async (req, res) => {

  try {

    const { ids } = req.body;

    await Ad.updateMany(
      { _id: { $in: ids } },
      { status: "published" }
    );

    res.json({ success: true });

  } catch (err) {

    console.error("PUBLISH ADS ERROR:", err);
    res.status(500).json({ message: "Server error" });

  }

};

/**
 * IMAGE UPLOAD
 */
export const uploadAdImage = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({ message: "file_required" });
    }

    const key = `ads/${new mongoose.Types.ObjectId()}.png`;

    const url = await uploadToR2({
      buffer: req.file.buffer,
      mimeType: req.file.mimetype,
      key
    });

    res.json({
      success: 1,
      file: { url }
    });

  } catch (err) {

    console.error("UPLOAD AD IMAGE ERROR:", err);
    res.status(500).json({ message: "upload_failed" });

  }

};

/**
 * PUBLIC ADS
 */
export const getAds = async (req, res) => {

  try {

    const ads = await Ad.find({
      status: "published",
      $or: [
        { endDate: null },
        { endDate: { $gt: new Date() } }
      ]
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json(ads);

  } catch (err) {

    console.error("GET ADS ERROR:", err);
    res.status(500).json({ message: "Server error" });

  }

};

export const getAdById = async (req, res) => {

  try {

    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ message: "Not found" });
    }

    ad.views += 1;
    await ad.save();

    res.json(ad);

  } catch (err) {

    console.error("GET AD ERROR:", err);
    res.status(500).json({ message: "Server error" });

  }

};