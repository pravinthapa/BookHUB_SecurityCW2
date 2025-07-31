const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fruit: { type: mongoose.Schema.Types.ObjectId, ref: 'fruit' },
  quantity: Number,
  totalPrice: Number,
  weight: Number,
  pricePerGram: Number,
  address: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, default: "pending" },
  paymentMethod: { type: String, enum: ['cod', 'khalti'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  khaltiTransactionId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
