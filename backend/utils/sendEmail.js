const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, code) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #EA1475;">Voom Support: Код подтверждения</h2>
      <p>Ваш код для подтверждения:</p>
      <div style="font-size: 24px; font-weight: bold; margin: 20px 0;">${code}</div>
      <p style="font-size: 12px; color: #666;">Код действует 5 минут</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"VOOM" <${process.env.EMAIL_FROM}>`,
    to,
    subject: 'VOOM: Код подтверждения',
    html
  });
};

module.exports = sendEmail;
