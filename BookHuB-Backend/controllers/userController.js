const User = require("../models/User");
const bcrypt = require("bcryptjs");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const validator = require("validator");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, address, phone, password, currentPassword } = req.body;
    const update = { name, address, phone };
    if (password) {
      const strongPassword =
        password.length >= 8 &&
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /\d/.test(password) &&
        /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
      if (!strongPassword) {
        return res.status(400).json({
          msg: "Password must be at least 8 characters, include upper, lower, number, and special character.",
        });
      }
      if (!currentPassword) {
        return res.status(400).json({
          msg: "Current password is required to change your password.",
        });
      }
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ msg: "User not found" });
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "Current password is incorrect." });
      for (const oldHash of user.passwordHistory || []) {
        if (await bcrypt.compare(password, oldHash)) {
          return res
            .status(400)
            .json({ msg: "You cannot reuse your last 5 passwords." });
        }
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      update.password = hashedPassword;
      update.passwordLastChanged = new Date();
      update.passwordHistory = [
        hashedPassword,
        ...(user.passwordHistory || []),
      ].slice(0, 5);
      await User.findByIdAndUpdate(req.user._id, update, { new: true });
      return res.json({ msg: "Password updated successfully" });
    } else {
      const user = await User.findByIdAndUpdate(req.user._id, update, {
        new: true,
      }).select("-password");
      return res.json(user);
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res.status(403).json({ msg: "Admin access required" });
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.blockUser = async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res.status(403).json({ msg: "Admin access required" });
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res.status(403).json({ msg: "Admin access required" });
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: false },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Enable 2FA: Generate secret and QR code
exports.generate2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const secret = speakeasy.generateSecret({
      name: `BookHub (${user.email})`,
    });
    user.twoFactorSecret = secret.base32;
    await user.save();

    const qr = await qrcode.toDataURL(secret.otpauth_url);
    res.json({ qr, secret: secret.base32 });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Confirm 2FA: User enters code from authenticator app
exports.confirm2FA = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user._id);
    if (!user || !user.twoFactorSecret)
      return res.status(400).json({ msg: "2FA not initialized" });

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: code,
    });
    if (!verified) return res.status(400).json({ msg: "Invalid 2FA code" });

    user.twoFactorEnabled = true;
    await user.save();
    res.json({ msg: "2FA enabled successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Disable 2FA
exports.disable2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save();
    res.json({ msg: "2FA disabled" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Verify 2FA code (for login)
exports.verify2FA = async (req, res) => {
  try {
    const { userId, code } = req.body;
    const user = await User.findById(userId);
    if (!user || !user.twoFactorSecret)
      return res.status(400).json({ msg: "2FA not enabled" });

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: code,
    });
    if (!verified) return res.status(400).json({ msg: "Invalid 2FA code" });

    res.json({ msg: "2FA verified" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Add a new email (send verification)
exports.addEmail = async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) return res.status(400).json({ msg: "Email is required" });
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.emails.some((e) => e.address === address)) {
      return res.status(400).json({ msg: "Email already added" });
    }
    // Check if email is used by another user
    const emailUsed = await User.findOne({
      $or: [{ email: address }, { emails: { $elemMatch: { address } } }],
    });
    if (emailUsed) return res.status(400).json({ msg: "Email already in use" });

    // Generate verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyTokenHash = crypto
      .createHash("sha256")
      .update(verifyToken)
      .digest("hex");
    const verifyTokenExpire = Date.now() + 60 * 60 * 1000; // 1 hour

    user.emails.push({ address, verified: false });
    user.emailVerifyToken = verifyTokenHash;
    user.emailVerifyAddress = address;
    user.emailVerifyExpire = verifyTokenExpire;
    await user.save();

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verifyToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: address,
      subject: "Verify your email address",
      html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email address. This link will expire in 1 hour.</p>`,
    };
    await transporter.sendMail(mailOptions);
    res.json({ msg: "Verification email sent" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Verify email by token
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const verifyTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const user = await User.findOne({
      emailVerifyToken: verifyTokenHash,
      emailVerifyExpire: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });
    const address = user.emailVerifyAddress;
    const emailObj = user.emails.find((e) => e.address === address);
    if (!emailObj) return res.status(400).json({ msg: "Email not found" });
    emailObj.verified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyAddress = undefined;
    user.emailVerifyExpire = undefined;
    await user.save();
    res.json({ msg: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Remove an email
exports.removeEmail = async (req, res) => {
  try {
    const { address } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    // Don't allow removing primary email
    if (address === user.email)
      return res.status(400).json({ msg: "Cannot remove primary email" });
    user.emails = user.emails.filter((e) => e.address !== address);
    await user.save();
    res.json({ msg: "Email removed" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Enable 2FA
exports.enableTwoFactor = async (req, res) => {
  const { userId } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { twoFactorEnabled: true },
      { new: true } // return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      msg: "Two-factor authentication enabled",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Disable 2FA
exports.disableTwoFactor = async (req, res) => {
  const { userId } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        twoFactorEnabled: false,
      },
      { new: true } // return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      msg: "Two-factor authentication disabled",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
