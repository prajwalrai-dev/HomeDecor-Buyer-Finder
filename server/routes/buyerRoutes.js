const express = require("express");
const { getAllBuyers, getMatchingBuyersForProduct, addBuyer } = require("../controllers/buyerController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getAllBuyers);
router.get("/match/:productId", getMatchingBuyersForProduct);
router.post("/", addBuyer);

module.exports = router;
