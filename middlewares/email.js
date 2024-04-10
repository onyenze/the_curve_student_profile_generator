const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmail = async (to, subject, text, html) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: process.env.service,
    port: 587,
    secure: false,
    auth: {
      user: process.env.user,
      pass: process.env.password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    const mailOptions = {
      from: `"The Curve Africa" <${process.env.user}>`,
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  }

  main().catch(console.error);
};

module.exports = { sendEmail };