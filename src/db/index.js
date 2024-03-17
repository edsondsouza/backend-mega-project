import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    // To check which host mongoDB is connected to.
    console.log(
      `\n MongoDB Connected🍀!! DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB Connection Failed ", error);
    process.exit(1);
  }
};

export default connectDB;
