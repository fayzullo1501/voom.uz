// backend/utils/sms.js
const axios = require('axios');
require('dotenv').config();

let tokenCache = null;

async function getEskizToken() {
  if (tokenCache) return tokenCache;

  try {
    const res = await axios.post('https://notify.eskiz.uz/api/auth/login', {
      email: process.env.ESKIZ_EMAIL,
      password: process.env.ESKIZ_PASSWORD,
    });

    tokenCache = res.data.data.token;
    return tokenCache;
  } catch (err) {
    console.error('Ошибка авторизации Eskiz:', err.response?.data || err.message);
    throw new Error('Ошибка авторизации Eskiz');
  }
}

async function sendSMS(phone, code) {
  const token = await getEskizToken();

  const mobile_phone = phone.replace('+', '').trim();
  const message = `Telefon raqamingizni tasdiqlash uchun voom.uz platformasi uchun kod: ${code}`;

  try {
    const res = await axios.post(
      'https://notify.eskiz.uz/api/message/sms/send',
      {
        mobile_phone,
        message,
        from: '4546', // ⚠️ должен быть зарегистрирован в кабинете Eskiz
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error('Ошибка при отправке SMS через Eskiz:', err.response?.data || err.message);
    throw new Error('Не удалось отправить SMS');
  }
}

module.exports = { sendSMS };
