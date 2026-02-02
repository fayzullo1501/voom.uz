import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },

    type: { type: String, enum: ["topup", "debit"], required: true },

    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },

    provider: { type: String, enum: ["click", "payme", "test", "internal"], default: "click" },

    externalId: { type: String },

    meta: { type: Object },
  },
  { timestamps: true }
);

transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ status: 1, provider: 1, createdAt: -1 });

export default mongoose.model("Transaction", transactionSchema);
