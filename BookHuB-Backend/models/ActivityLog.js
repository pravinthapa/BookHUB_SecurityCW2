const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  action: { type: String, required: true },
  ip: { type: String },
  userAgent: { type: String },
  url: { type: String },
  method: { type: String },
  meta: { type: Object },
  info: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

module.exports = ActivityLog; 