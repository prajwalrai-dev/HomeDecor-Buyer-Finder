const Product = require("../models/Product");

// @route  POST /api/products
// @desc   Add a new home decor product (seller only)
const createProduct = async (req, res) => {
  try {
    const { title, description, category, price, quantityAvailable, state, imageUrl, tags } = req.body;

    if (!title || !description || !category || price === undefined || !state) {
      return res.status(400).json({ message: "title, description, category, price and state are required" });
    }

    const product = await Product.create({
      seller: req.user._id,
      title,
      description,
      category,
      price,
      quantityAvailable,
      state,
      imageUrl,
      tags,
    });

    res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

// @route  GET /api/products
// @desc   Get all products belonging to the logged in seller
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};

// @route  GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, seller: req.user._id });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error: error.message });
  }
};

// @route  PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, seller: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

// @route  DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};

module.exports = { createProduct, getMyProducts, getProductById, updateProduct, deleteProduct };
