const Contact = require("../models/Contact");

const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Input validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ msg: "Name is required and must be at least 2 characters." });
    }
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
      return res.status(400).json({ msg: "A valid email is required." });
    }
    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return res.status(400).json({ msg: "Message is required and must be at least 5 characters." });
    }

    const newContact = new Contact({
      name,
      email,
      message,
    });

    await newContact.save();
    res.status(201).json({ msg: "Message received. We'll contact you soon!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getAllContacts = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ msg: "Admin access required" });
    }

    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  submitContact,
  getAllContacts,
};
