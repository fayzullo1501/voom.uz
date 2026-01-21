// backend/services/email.service.js
import nodemailer from "nodemailer";

if (
  !process.env.EMAIL_HOST ||
  !process.env.EMAIL_PORT ||
  !process.env.EMAIL_USER ||
  !process.env.EMAIL_PASS ||
  !process.env.EMAIL_FROM
) {
  console.warn("⚠️ EMAIL ENV variables are not fully defined");
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (email, code) => {
  try {
    await transporter.sendMail({
      from: `"VOOM" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Код подтверждения VOOM",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6">
          <h2>VOOM</h2>
          <p>Ваш код подтверждения:</p>
          <h1 style="letter-spacing: 4px">${code}</h1>
          <p>Код действителен 10 минут.</p>
          <p style="color:#666;font-size:13px">
            Если вы не запрашивали регистрацию — просто проигнорируйте это письмо.
          </p>
        </div>
      `,
    });

    console.log(`📧 EMAIL sent to ${email}`);
  } catch (err) {
    console.error("❌ EMAIL send error:", err.message);
    throw new Error("EMAIL send failed");
  }
};
