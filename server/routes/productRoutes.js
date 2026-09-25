const express = require("express");
const {
  createProduct,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect); // all product routes require login

router.route("/").post(createProduct).get(getMyProducts);
router.route("/:id").get(getProductById).put(updateProduct).delete(deleteProduct);

module.exports = router;
