const nodemailer = require("nodemailer");

let transporter = null;

// Lazily creates (and reuses) a single Nodemailer transporter built from .env config
const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
};

/**
 * Sends an email to a buyer about a seller's product.
 * @param {Object} params
 * @param {string} params.to - buyer's email address
 * @param {string} params.subject
 * @param {string} params.html
 */
const sendBuyerEmail = async ({ to, subject, html, text }) => {
  const mailTransporter = getTransporter();

  const info = await mailTransporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text: text || html.replace(/<[^>]+>/g, ""),
    html,
  });

  return info;
};

module.exports = { sendBuyerEmail };
