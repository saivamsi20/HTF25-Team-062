require("dotenv").config();

const { generateDataUrl, generateToFile } = require("./utils/generateQRCode");

(async () => {
  const data = { qrCodeId: "test-uuid-123" };
  const dataUrl = await generateDataUrl(data);
  console.log("Data URL length:", dataUrl.length);

  await generateToFile(data, "./logs/test-qr.png");
  console.log("Wrote ./logs/test-qr.png");
})();
