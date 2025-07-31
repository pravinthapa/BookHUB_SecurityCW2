const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    isBlocked: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },
    emails: [
      {
        address: { type: String, required: true },
        verified: { type: Boolean, default: false },
      },
    ],
    emailVerifyToken: { type: String },
    emailVerifyAddress: { type: String },
    emailVerifyExpire: { type: Date },
    passwordHistory: [{ type: String }], // Array of previous password hashes
    passwordLastChanged: { type: Date },

    // otp for 2fa
    otp: { type: String },
    otpExpiry: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
