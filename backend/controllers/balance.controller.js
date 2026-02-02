import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const getBalance = async (req, res) => {
  const user = await User.findById(req.user.id).lean();
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({
    balance: user.balance || 0,
    holderName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
  });
};

export const getTransactions = async (req, res) => {
  const items = await Transaction.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  res.json(items);
};
