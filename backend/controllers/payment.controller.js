import crypto from "crypto";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import env from "../config/env.js";

const md5 = (str) => crypto.createHash("md5").update(str).digest("hex");

// ======================================================
// 🔹 Инициализация платежа (frontend → backend → Click)
// ======================================================
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

  const returnUrl = `${env.CLIENT_URL}/profile/balance/top-up`;

  const payUrl =
    `${env.CLICK_BASE_URL}` +
    `?service_id=${encodeURIComponent(env.CLICK_SERVICE_ID)}` +
    `&merchant_id=${encodeURIComponent(env.CLICK_MERCHANT_ID)}` +
    `&merchant_user_id=${encodeURIComponent(env.CLICK_MERCHANT_USER_ID)}` +
    `&transaction_param=${encodeURIComponent(tx._id.toString())}` +
    `&amount=${encodeURIComponent(amountNum)}` +
    `&return_url=${encodeURIComponent(returnUrl)}`;

  return res.json({ payUrl });
};

// ======================================================
// 🔹 Callback Click (prepare + complete)
// ======================================================
export const clickCallback = async (req, res) => {
  const {
    click_trans_id,
    service_id,
    merchant_trans_id,
    merchant_prepare_id,
    amount,
    action,
    sign_time,
    sign_string,
  } = req.body;

  const actionNum = Number(action);
  const amountNum = Number(amount);

  // ===== Формирование подписи (СТРОГО как в рабочем старом коде) =====
  let signBase = "";

  if (actionNum === 0) {
    signBase =
      String(click_trans_id) +
      String(service_id) +
      String(env.CLICK_SECRET_KEY) +
      String(merchant_trans_id) +
      String(amountNum) +
      String(actionNum) +
      String(sign_time);
  }

  if (actionNum === 1) {
    signBase =
      String(click_trans_id) +
      String(service_id) +
      String(env.CLICK_SECRET_KEY) +
      String(merchant_trans_id) +
      String(merchant_prepare_id) +
      String(amountNum) +
      String(actionNum) +
      String(sign_time);
  }

  const expectedSign = md5(signBase);

  if (sign_string !== expectedSign) {
    console.warn("⚠️ SIGN CHECK FAILED", {
      expectedSign,
      receivedSign: sign_string,
    });
    return res.json({ error: -1, error_note: "SIGN CHECK FAILED" });
  }

  // ===== Транзакция =====
  const tx = await Transaction.findById(merchant_trans_id);
  if (!tx) {
    return res.json({ error: -5, error_note: "Transaction not found" });
  }

  // ===== Проверка суммы (как в старом коде) =====
  if (Number(tx.amount) !== amountNum) {
    return res.json({ error: -2, error_note: "Incorrect amount" });
  }

  // ===== PREPARE =====
  if (actionNum === 0) {
    return res.json({
      error: 0,
      merchant_prepare_id: tx._id.toString(),
    });
  }

  // ===== COMPLETE =====
  if (actionNum === 1) {
    if (tx.status === "success") {
      return res.json({ error: 0 });
    }

    tx.status = "success";
    tx.meta = req.body;
    await tx.save();

    await User.updateOne(
      { _id: tx.userId },
      { $inc: { balance: tx.amount } }
    );

    return res.json({
      error: 0,
      merchant_confirm_id: tx._id.toString(),
    });
  }

  return res.json({ error: -3, error_note: "Unknown action" });
};
