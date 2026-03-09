import News from "../models/News.js";
import { uploadToR2 } from "../utils/r2Upload.js";
import mongoose from "mongoose";

/**
 * ===============================
 * POST /admin/news
 * create news
 * ===============================
 */
export const createNews = async (req, res) => {

  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { title, content } = req.body;

    const news = await News.create({
      title,
      content
    });

    res.status(201).json(news);

  } catch (err) {

    console.error("CREATE NEWS ERROR:", err);
    res.status(500).json({ message: "Server error" });

  }

};


/**
 * ===============================
 * GET /admin/news
 * ===============================
 */
export const getAdminNews = async (req, res) => {

  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const news = await News.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json(news);

  } catch (err) {

    console.error("GET ADMIN NEWS ERROR:", err);
    res.status(500).json({ message: "Server error" });

  }

};

/**
 * ===============================
 * GET /admin/news/:id
 * admin preview (no views)
 * ===============================
 */
export const getAdminNewsById = async (req, res) => {

  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const news = await News.findById(req.params.id).lean();

    if (!news) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(news);

  } catch (err) {

    console.error("GET ADMIN NEWS BY ID ERROR:", err);
    res.status(500).json({ message: "Server error" });

  }

};

/**
 * ===============================
 * GET /news
 * public list
 * ===============================
 */
export const getNews = async (req, res) => {

  try {

    const news = await News.find({ status: "published" })
      .sort({ createdAt: -1 })
      .lean();

    res.json(news);

  } catch (err) {

    console.error("GET NEWS ERROR:", err);
    res.status(500).json({ message: "Server error" });

  }

};


/**
 * ===============================
 * GET /news/:id
 * ===============================
 */
export const getNewsById = async (req, res) => {

  try {

    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: "Not found" });
    }

    /* увеличиваем просмотры только для опубликованных */

    if (news.status === "published") {

      await News.updateOne(
        { _id: news._id },
        { $inc: { views: 1 } }
      );

      news.views += 1;

    }

    res.json(news);

  } catch (err) {

    console.error("GET NEWS BY ID ERROR:", err);
    res.status(500).json({ message: "Server error" });

  }

};

/**
 * ===============================
 * DELETE /admin/news
 * ===============================
 */
export const deleteNews = async (req, res) => {

  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { ids } = req.body;

    if (!ids || !ids.length) {
      return res.status(400).json({ message: "ids_required" });
    }

    await News.deleteMany({
      _id: { $in: ids }
    });

    res.json({ success: true });

  } catch (err) {

    console.error("DELETE NEWS ERROR:", err);
    res.status(500).json({ message: "Server error" });

  }

};


/**
 * ===============================
 * PATCH /admin/news/publish
 * ===============================
 */
export const publishNews = async (req, res) => {

  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { ids } = req.body;

    if (!ids || !ids.length) {
      return res.status(400).json({ message: "ids_required" });
    }

    await News.updateMany(
      { _id: { $in: ids } },
      { status: "published" }
    );

    res.json({ success: true });

  } catch (err) {

    console.error("PUBLISH NEWS ERROR:", err);
    res.status(500).json({ message: "Server error" });

  }

};

/**
 * ===============================
 * POST /admin/news/upload
 * upload image for EditorJS
 * ===============================
 */
export const uploadNewsImage = async (req, res) => {

  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "file_required" });
    }

    const key = `news/${new mongoose.Types.ObjectId()}.png`;

    const url = await uploadToR2({
      buffer: req.file.buffer,
      mimeType: req.file.mimetype,
      key,
    });

    res.json({
      success: 1,
      file: {
        url
      }
    });

  } catch (err) {

    console.error("UPLOAD NEWS IMAGE ERROR:", err);
    res.status(500).json({ message: "upload_failed" });

  }

};