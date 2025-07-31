const fruit = require("../models/fruit");

exports.createfruit = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: "Admin access required" });
    const { name, description, pricePerGram, stock, image } = req.body;
    const newFruit = await fruit.create({ name, description, pricePerGram, stock, image });
    res.status(201).json(newFruit);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllfruits = async (req, res) => {
  try {
    const fruits = await fruit.find();
    res.json(fruits);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getfruitById = async (req, res) => {
  try {
    const foundFruit = await fruit.findById(req.params.id);
    res.json(foundFruit);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updatefruit = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: "Admin access required" });
    const { name, description, pricePerGram, stock, image } = req.body;
    const updatedData = { name, description, pricePerGram, stock, image };
    const updated = await fruit.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deletefruit = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: "Admin access required" });
    await fruit.findByIdAndDelete(req.params.id);
    res.json({ msg: "fruit deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getfruitByName = async (req, res) => {
  const { name } = req.params;
  const foundFruit = await fruit.findOne({ name });
  if (!foundFruit) return res.status(404).json({ msg: "fruit not found" });
  res.json(foundFruit);
};
