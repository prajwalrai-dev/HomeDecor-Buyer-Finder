const mongoose = require("mongoose");

/**
 * Represents a potential buyer (retailer, boutique, interior designer, distributor, etc.)
 * in the United States who purchases home decor products.
 * Buyers can be seeded locally and/or pulled in from an external directory API
 * (see server/services/buyerService.js).
 */
const buyerSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    contactName: { type: String, trim: true, default: "" },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: "" },
    categoriesInterested: [
      {
        type: String,
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
    ],
    state: { type: String, required: true, trim: true },
    city: { type: String, trim: true, default: "" },
    buyerType: {
      type: String,
      enum: ["Retailer", "Boutique", "Interior Designer", "Distributor", "E-commerce Store", "Other"],
      default: "Retailer",
    },
    source: { type: String, default: "local" }, // "local" or the name of the external API it came from
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

buyerSchema.index({ categoriesInterested: 1, state: 1 });

module.exports = mongoose.model("Buyer", buyerSchema);
