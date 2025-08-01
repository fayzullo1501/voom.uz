const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS
  }
});

const sendMail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Voom Support" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html
    });

    console.log('📨 Письмо отправлено:', info.response);
    return true;
  } catch (err) {
    console.error('❌ Ошибка при отправке письма:', err);
    return false;
  }
};

module.exports = sendMail;
