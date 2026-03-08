import Notification from "../models/Notification.js";

export const createNotification = async (
  {
    userId,
    type,
    title,
    route,
    routeId = null,
    bookingId = null
  },
  io
) => {

  try {

    const notification = await Notification.create({
      user: userId,
      type,
      title,
      route,
      routeId,
      bookingId,
      read: false,
    });

    if (io) {
      io.to(userId.toString()).emit("notification", notification);
    }

    return notification;

  } catch (error) {
    console.error("createNotification error:", error);
  }

};