const fs = require("fs");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMail = async ({ to, subject, html }) =>
  await new Promise((resolve, reject) => {
    const from = process.env.COMPANY + " <" + process.env.DISPLAY_EMAIL + ">";
    const options = { from, to, subject, html };
    transporter.sendMail(options, (err, info) => {
      if (err) reject(err);
      else resolve(info.response);
    });
  });

const templateToHTML = (path) => fs.readFileSync(path, "utf-8").toString();

module.exports = { sendMail, templateToHTML };
