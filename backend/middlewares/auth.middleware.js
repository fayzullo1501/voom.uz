import jwt from "jsonwebtoken";
import env from "../config/env.js";

if (!env.jwtSecret) {
  throw new Error("JWT_SECRET is not defined");
}

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    req.user = {
      id: decoded.id || decoded._id,
      _id: decoded._id || decoded.id,
      role: decoded.role,
    };

    next();
  } catch {
    return res.status(401).json({ message: "unauthorized" });
  }
};

export default auth;
