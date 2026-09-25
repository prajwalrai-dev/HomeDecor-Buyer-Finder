const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Furniture",
        "Wall Decor",
        "Lighting",
        "Rugs & Carpets",
        "Curtains & Textiles",
        "Vases & Planters",
        "Candles & Fragrance",
        "Kitchen & Dining",
        "Bedding",
        "Outdoor Decor",
        "Other",
      ],
    },
    price: { type: Number, required: true, min: 0 },
    quantityAvailable: { type: Number, default: 1, min: 0 },
    state: { type: String, required: true, trim: true }, // US state, used for buyer matching by region
    imageUrl: { type: String, default: "" },
    tags: [{ type: String, trim: true }],
    status: { type: String, enum: ["active", "sold", "inactive"], default: "active" },
  },
  { timestamps: true }
);

productSchema.index({ category: 1, state: 1 });

module.exports = mongoose.model("Product", productSchema);
