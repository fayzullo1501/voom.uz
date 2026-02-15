const adminOnly = (req, res, next) => {
  // Пользователь не авторизован
  if (!req.user) {
    return res.status(401).json({ message: "unauthorized" });
  }

  // Пользователь не админ
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "forbidden" });
  }

  next();
};

export default adminOnly;
