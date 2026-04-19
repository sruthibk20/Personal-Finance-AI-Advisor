const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://sruthi:Sruthi%402005@financeuser.v4mfhtu.mongodb.net/financeDB?retryWrites=true&w=majority");
    console.log("MongoDB connected");
    console.log("MONGO_URI:", process.env.MONGO_URI);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;