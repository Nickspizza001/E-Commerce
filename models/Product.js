const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    image: {
      type: Boolean,
      default: false,
    },
    categories: {
      type: Array,
      required: true,
      unique: true,
    },
    size: {
      type: Number,
    },
    colour: {
      type: String,
    },
    price: {
      type: Number,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
