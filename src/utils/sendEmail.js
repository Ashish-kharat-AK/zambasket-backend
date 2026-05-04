import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your@gmail.com",
      pass: "your_app_password"
    }
  });

  await transporter.sendMail({
    from: "ZamBasket <your@gmail.com>",
    to,
    subject,
    text
  });
};