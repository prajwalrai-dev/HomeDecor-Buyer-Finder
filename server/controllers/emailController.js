const Product = require("../models/Product");
const Buyer = require("../models/Buyer");
const EmailLog = require("../models/EmailLog");
const { sendBuyerEmail } = require("../services/emailService");

const buildEmailHTML = ({ seller, product, customMessage }) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color:#7a4b2f;">New Home Decor Product from ${seller.businessName || seller.name}</h2>
    ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.title}" style="max-width:100%; border-radius:8px;" />` : ""}
    <h3>${product.title}</h3>
    <p><strong>Category:</strong> ${product.category}</p>
    <p><strong>Price:</strong> $${product.price}</p>
    <p><strong>Available Quantity:</strong> ${product.quantityAvailable}</p>
    <p><strong>Location:</strong> ${product.state}, USA</p>
    <p>${product.description}</p>
    ${customMessage ? `<p><em>${customMessage}</em></p>` : ""}
    <hr />
    <p>Interested? Reply to this email to connect with the seller: <strong>${seller.email}</strong></p>
  </div>
`;

// @route  POST /api/emails/send
// @desc   Send an email to one or more buyers about a specific product
// body: { productId, buyerIds: [], customMessage }
const sendProductEmailToBuyers = async (req, res) => {
  try {
    const { productId, buyerIds, customMessage } = req.body;

    if (!productId || !Array.isArray(buyerIds) || buyerIds.length === 0) {
      return res.status(400).json({ message: "productId and a non-empty buyerIds array are required" });
    }

    const product = await Product.findOne({ _id: productId, seller: req.user._id });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const buyers = await Buyer.find({ _id: { $in: buyerIds } });
    const seller = req.user;

    const results = [];

    for (const buyer of buyers) {
      const subject = `New ${product.category} product available: ${product.title}`;
      const html = buildEmailHTML({ seller, product, customMessage });

      try {
        await sendBuyerEmail({ to: buyer.email, subject, html });

        const log = await EmailLog.create({
          seller: seller._id,
          product: product._id,
          buyer: buyer._id,
          buyerEmail: buyer.email,
          subject,
          message: customMessage || "",
          status: "sent",
        });

        results.push({ buyer: buyer.email, status: "sent", logId: log._id });
      } catch (err) {
        await EmailLog.create({
          seller: seller._id,
          product: product._id,
          buyer: buyer._id,
          buyerEmail: buyer.email,
          subject,
          message: customMessage || "",
          status: "failed",
          errorMessage: err.message,
        });

        results.push({ buyer: buyer.email, status: "failed", error: err.message });
      }
    }

    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: "Failed to send emails", error: error.message });
  }
};

// @route  GET /api/emails/logs
// @desc   Get email send history for the logged in seller
const getEmailLogs = async (req, res) => {
  try {
    const logs = await EmailLog.find({ seller: req.user._id })
      .populate("product", "title category")
      .populate("buyer", "companyName email")
      .sort({ createdAt: -1 });

    res.json({ logs });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch email logs", error: error.message });
  }
};

module.exports = { sendProductEmailToBuyers, getEmailLogs };
