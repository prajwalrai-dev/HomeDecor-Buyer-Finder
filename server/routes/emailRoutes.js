const express = require("express");
const { sendProductEmailToBuyers, getEmailLogs } = require("../controllers/emailController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/send", sendProductEmailToBuyers);
router.get("/logs", getEmailLogs);

module.exports = router;
