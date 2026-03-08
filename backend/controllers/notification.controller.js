import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {

  try {

    const userId = req.user._id;

    const notifications = await Notification.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json(notifications);

  } catch (error) {
    console.error("getNotifications error:", error);
    return res.status(500).json({ message: "internal_server_error" });
  }

};

export const markNotificationRead = async (req, res) => {

  try {

    const { id } = req.params;

    await Notification.findByIdAndUpdate(id, {
      read: true
    });

    return res.json({ success: true });

  } catch (error) {
    console.error("markNotificationRead error:", error);
    res.status(500).json({ message: "internal_server_error" });
  }

};