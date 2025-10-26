// backend/utils/sendEmail.js
const nodemailer = require("nodemailer");

const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, FROM_EMAIL } =
  process.env;

const fromEmail = FROM_EMAIL || "no-reply@example.com";

let transporter;

/**
 * Initialize transporter lazily. Throws if config missing.
 */
function getTransporter() {
  if (transporter) return transporter;

  // Basic validation
  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
    throw new Error(
      "Email configuration missing. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER and EMAIL_PASS in .env"
    );
  }

  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: Number(EMAIL_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  return transporter;
}

/**
 * Send an email.
 * @param {Object} options
 * @param {String} options.to - recipient email (or array)
 * @param {String} options.subject
 * @param {String} [options.text]
 * @param {String} [options.html]
 * @returns {Promise<Object>} nodemailer send result
 */
async function sendEmail({ to, subject, text = "", html = "" }) {
  const t = getTransporter();

  const mailOptions = {
    from: fromEmail,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await t.sendMail(mailOptions);
    return info;
  } catch (err) {
    // Re-throw with helpful message
    const e = new Error(`Failed to send email: ${err.message}`);
    e.original = err;
    throw e;
  }
}

module.exports = {
  sendEmail,
};
