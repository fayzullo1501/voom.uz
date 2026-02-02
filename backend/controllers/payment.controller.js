import crypto from "crypto";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import env from "../config/env.js";

const md5 = (str) => crypto.createHash("md5").update(str).digest("hex");

// 🔹 Инициализация платежа
export const initClickPayment = async (req, res) => {
  const { amount } = req.body;
  const amountNum = Number(amount);

  if (!Number.isInteger(amountNum) || amountNum < 1000) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  const tx = await Transaction.create({
    userId: req.user.id,
    amount: amountNum,
    type: "topup",
    status: "pending",
    provider: "click",
  });

  const returnUrl = `${env.CLIENT_URL}/profile/balance`;

  const payUrl =
    `${env.CLICK_BASE_URL}` +
    `?service_id=${env.CLICK_SERVICE_ID}` +
    `&merchant_id=${env.CLICK_MERCHANT_ID}` +
    `&merchant_user_id=${env.CLICK_MERCHANT_USER_ID}` +
    `&transaction_param=${tx._id}` +
    `&amount=${amountNum}` +
    `&return_url=${encodeURIComponent(returnUrl)}`;

  res.json({ payUrl });
};

// 🔹 Callback Click
export const clickCallback = async (req, res) => {
  const {
    click_trans_id,
    service_id,
    merchant_trans_id,
    amount,
    action,
    sign_time,
    sign_string,
  } = req.body;

  const signBase =
    action === "1"
      ? `${click_trans_id}${service_id}${env.CLICK_SECRET_KEY}${merchant_trans_id}${amount}${action}${sign_time}`
      : `${click_trans_id}${service_id}${env.CLICK_SECRET_KEY}${merchant_trans_id}${amount}${action}${sign_time}`;

  const expectedSign = md5(signBase);

  if (sign_string !== expectedSign) {
    return res.json({ error: -1, error_note: "Invalid signature" });
  }

  const tx = await Transaction.findById(merchant_trans_id);
  if (!tx) {
    return res.json({ error: -5, error_note: "Transaction not found" });
  }

  if (action === "0") {
    return res.json({
      error: 0,
      merchant_prepare_id: tx._id,
    });
  }

  if (action === "1") {
    if (tx.status === "success") {
      return res.json({ error: 0 });
    }

    tx.status = "success";
    tx.meta = req.body;
    await tx.save();

    await User.updateOne({ _id: tx.userId }, { $inc: { balance: tx.amount } });

    return res.json({
      error: 0,
      merchant_confirm_id: tx._id,
    });
  }

  res.json({ error: -3 });
};
