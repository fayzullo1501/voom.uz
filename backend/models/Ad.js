import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
{
  title: {
    ru: { type: String, default: "" },
    uz: { type: String, default: "" },
    en: { type: String, default: "" }
  },

  content: {
    ru: { type: Object, default: null },
    uz: { type: Object, default: null },
    en: { type: Object, default: null }
  },

  banner: {
    type: String,
    default: ""
  },

  endDate: {
    type: Date,
    default: null
  },

  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft"
  },

  views: {
    type: Number,
    default: 0
  }

},
{ timestamps: true }
);

export default mongoose.model("Ad", adSchema);