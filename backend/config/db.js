import mongoose from "mongoose";
import env from "./env.js";

const connectDB = async () => {
  if (!env.mongoUri) {
    throw new Error("MONGO_URI is not set");
  }

  await mongoose.connect(env.mongoUri);
  console.log("MongoDB connected");
};

export default connectDB;
