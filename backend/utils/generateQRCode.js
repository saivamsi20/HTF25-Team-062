// backend/utils/generateQRCode.js
const QRCode = require("qrcode");
const fs = require("fs").promises;

/**
 * Generate a PNG Data URL for given data.
 * @param {Object|String} data - the payload to encode
 * @param {Object} [options] - options passed to qrcode.toDataURL
 * @returns {Promise<String>} data:image/png;base64,...
 */
async function generateDataUrl(data, options = {}) {
  const payload = typeof data === "string" ? data : JSON.stringify(data);
  return QRCode.toDataURL(payload, options);
}

/**
 * Generate a PNG file containing the QR code.
 * @param {Object|String} data - the payload to encode
 * @param {String} filePath - path where PNG will be written
 * @param {Object} [options] - qrcode.toFile options
 * @returns {Promise<void>}
 */
async function generateToFile(data, filePath, options = {}) {
  const payload = typeof data === "string" ? data : JSON.stringify(data);
  // qrcode has a toFile function but some environments may not expose, so use toBuffer then write
  const buffer = await QRCode.toBuffer(payload, options);
  await fs.writeFile(filePath, buffer);
}

module.exports = {
  generateDataUrl,
  generateToFile,
};
