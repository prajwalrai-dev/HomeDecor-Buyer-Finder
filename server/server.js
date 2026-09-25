require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/database");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const buyerRoutes = require("./routes/buyerRoutes");
const emailRoutes = require("./routes/emailRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Home Decor Buyer Finder API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/buyers", buyerRoutes);
app.use("/api/emails", emailRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
