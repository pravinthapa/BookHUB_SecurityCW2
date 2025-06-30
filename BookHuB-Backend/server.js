require('dotenv').config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser"); // ✅ Import cookie-parser
const userRoutes = require("./routes/userRoutes");
const ActivityLog = require("./models/ActivityLog");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

connectDB();

const app = express();

app.use(cookieParser());

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

async function logIpMiddleware(req, res, next) {
  const token = req.cookies?.token || req.header("Authorization")?.split(" ")[1];

  let m_user = 'Guest';
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      m_user = user || 'Guest';
    } catch (err) {
      m_user = 'Guest';
    }
  }

  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userLabel = m_user?.name ? `User (${m_user.name})` : 'Visitor';
  let info = '';

  if (req.originalUrl.startsWith('/api/auth/login') && req.method === 'POST') {
    info = `${userLabel} logged in`;
  } else if (req.originalUrl.startsWith('/api/auth/logout')) {
    info = `${userLabel} logged out`;
  } else if (req.originalUrl.startsWith('/api/auth/register') && req.method === 'POST') {
    info = `${userLabel} registered`;
  } else if (req.originalUrl.startsWith('/api/auth/forgot-password')) {
    info = `${userLabel} requested password reset`;
  } else if (req.originalUrl.startsWith('/api/auth/reset-password') && req.method === 'POST') {
    info = `${userLabel} reset password`;
  } else if (req.originalUrl.startsWith('/api/users/profile') && req.method === 'PUT') {
    info = `${userLabel} updated profile`;
    if (req.body.password) info = `${userLabel} changed password`;
  } else if (req.originalUrl.startsWith('/api/bookings') && req.method === 'POST') {
    info = `${userLabel} created a booking`;
  } else if (req.originalUrl.startsWith('/api/bookings') && req.method === 'GET') {
    info = `${userLabel} viewed bookings`;
  } else if (req.originalUrl.startsWith('/api/contact') && req.method === 'POST') {
    info = `${userLabel} submitted a contact form`;
  } else if (req.originalUrl.startsWith('/api/fruits') && req.method === 'GET') {
    info = `${userLabel} viewed fruits`;
  } else {
    info = `${userLabel} accessed ${req.originalUrl}`;
  }

  const logEntry = {
    ip,
    action: 'Request',
    user: m_user?._id,
    userAgent: req.headers['user-agent'],
    url: req.originalUrl,
    method: req.method,
    info,
    meta: {
      body: req.body,
      query: req.query,
      params: req.params
    }
  };

  ActivityLog.create(logEntry).catch(err => {
    console.error('Failed to save activity log:', err);
  });

  next();
}

app.use(logIpMiddleware);

// ✅ API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/fruits", require("./routes/fruitRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/users", userRoutes);

// Admin activity logs
app.get("/api/users/activity-logs", async (req, res) => {
  try {
    const { user } = req.query;
    const filter = user ? { user } : {};
    const logs = await ActivityLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(500)
      .populate('user', 'name email');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
