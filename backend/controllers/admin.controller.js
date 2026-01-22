import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const users = await User.find({})
      .sort({ createdAt: -1 })
      .select("_id firstName lastName phone email role phoneVerified createdAt");

    res.json(users);
  } catch (err) {
    console.error("ADMIN GET USERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
