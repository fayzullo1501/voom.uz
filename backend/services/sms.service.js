import axios from "axios";

let tokenCache = null;

const getEskizToken = async () => {
  if (tokenCache) return tokenCache;

  try {
    const res = await axios.post(
      "https://notify.eskiz.uz/api/auth/login",
      {
        email: process.env.ESKIZ_EMAIL,
        password: process.env.ESKIZ_PASSWORD,
      }
    );

    tokenCache = res.data.data.token;
    console.log("✅ ESKIZ TOKEN OK");
    return tokenCache;
  } catch (err) {
    console.error("❌ Eskiz auth error:", err.response?.data || err.message);
    throw new Error("Eskiz auth failed");
  }
};

export const sendSMS = async (phone, code) => {
  const token = await getEskizToken();

  try {
    await axios.post(
      "https://notify.eskiz.uz/api/message/sms/send",
      {
        mobile_phone: `998${phone}`, // phone = 901234567
        message: `Telefon raqamingizni tasdiqlash uchun voom.uz platformasi uchun kod: ${code}`,
        from: process.env.ESKIZ_SENDER,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(`📨 SMS sent to ${phone}`);
  } catch (err) {
    console.error("❌ SMS send error:", err.response?.data || err.message);
    throw new Error("SMS send failed");
  }
};
