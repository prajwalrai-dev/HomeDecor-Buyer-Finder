const Product = require("../models/Product");
const Buyer = require("../models/Buyer");
const { findMatchingBuyers } = require("../services/matchingService");

// @route  GET /api/buyers
// @desc   List all buyers in the local database (optionally filter by category/state)
const getAllBuyers = async (req, res) => {
  try {
    const { category, state } = req.query;
    const query = { active: true };
    if (category) query.categoriesInterested = category;
    if (state) query.state = new RegExp(`^${state}$`, "i");

    const buyers = await Buyer.find(query).sort({ companyName: 1 });
    res.json({ buyers });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch buyers", error: error.message });
  }
};

// @route  GET /api/buyers/match/:productId
// @desc   Find & rank buyers that match a specific product owned by the logged in seller
const getMatchingBuyersForProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.productId, seller: req.user._id });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const buyers = await findMatchingBuyers(product);
    res.json({ product: { id: product._id, title: product.title, category: product.category }, buyers });
  } catch (error) {
    res.status(500).json({ message: "Failed to find matching buyers", error: error.message });
  }
};

// @route  POST /api/buyers
// @desc   Manually add a buyer lead to the local database
const addBuyer = async (req, res) => {
  try {
    const buyer = await Buyer.create(req.body);
    res.status(201).json({ buyer });
  } catch (error) {
    res.status(500).json({ message: "Failed to add buyer", error: error.message });
  }
};

module.exports = { getAllBuyers, getMatchingBuyersForProduct, addBuyer };
