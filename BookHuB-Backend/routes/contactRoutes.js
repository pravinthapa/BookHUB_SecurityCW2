const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

const auth = require("../middleware/authMiddleware");

router.post("/", contactController.submitContact);
router.get("/", auth, contactController.getAllContacts); // Optional: restrict to admin only

module.exports = router;
