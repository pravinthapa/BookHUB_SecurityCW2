const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();

const seedAdmin = async () => {
  await connectDB();
  const adminExists = await User.findOne({ email: "admin@gmail.com" });
  if (adminExists) {
    console.log("Admin user already exists");
    process.exit();
  }
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await User.create({
    name: "admin",
    email: "admin@gmail.com",
    password: hashedPassword,
    isAdmin: true
  });
  console.log("Admin user created");
  process.exit();
};

seedAdmin(); 