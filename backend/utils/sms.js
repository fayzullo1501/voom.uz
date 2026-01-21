// backend/utils/sms.js
import axios from "axios";

let tokenCache = null;

export const getEskizToken = async () => {
  if (tokenCache) return tokenCache;

  const res = await axios.post("https://notify.eskiz.uz/api/auth/login", {
    email: process.env.ESKIZ_EMAIL,
    password: process.env.ESKIZ_PASSWORD,
  });

  tokenCache = res.data.data.token;
  return tokenCache;
};

export const sendSMS = async (phone, code) => {
  const token = await getEskizToken();

  const mobile_phone = `998${phone}`; // phone = 901234567
  const message = `VOOM: tasdiqlash kodi ${code}`;
};
