const Booking = require("../models/Booking");

const createBooking = async (req, res) => {
  try {
    console.log("Received booking request body:", req.body);
    console.log("User:", req.user);
    
    const { fruit, quantity, totalPrice, address, phone, weight, pricePerGram, paymentMethod, khaltiTransactionId } = req.body;
    
    // Validate required fields
    if (!address) {
      return res.status(400).json({ msg: "Address is required" });
    }
    if (!phone) {
      return res.status(400).json({ msg: "Phone is required" });
    }
    
    // Set payment status based on payment method
    let paymentStatus = 'pending';
    if (paymentMethod === 'khalti' && khaltiTransactionId) {
      paymentStatus = 'completed';
    }
    
    const bookingData = {
      user: req.user,
      fruit,
      quantity,
      totalPrice,
      weight,
      pricePerGram,
      address,
      phone,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus,
      khaltiTransactionId
    };
    
    console.log("Creating booking with data:", bookingData);
    
    const booking = await Booking.create(bookingData);
    console.log("Booking created successfully:", booking);
    res.status(201).json(booking);
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ msg: err.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    let userId = req.user._id;
    if (req.user.isAdmin && req.query.userId) {
      userId = req.query.userId;
    }
    const bookings = await Booking.find({ user: userId }).populate("fruit");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: "Admin access required" });
    const bookings = await Booking.find().populate("user fruit");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: "Admin access required" });
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user fruit");
    if (!booking) return res.status(404).json({ msg: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus
};
