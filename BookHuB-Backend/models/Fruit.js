const mongoose = require("mongoose");

const fruitschema = new mongoose.Schema({
  name: String,
  description: String,
  pricePerGram: Number,
  image: String,
  stock: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("fruit", fruitschema);
