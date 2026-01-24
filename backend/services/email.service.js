// backend/services/email.service.js
import { Resend } from "resend";

if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
  console.warn("⚠️ RESEND_API_KEY or EMAIL_FROM is not defined");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (email, code) => {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM, // voom.uz <no-reply@voom.uz>
      to: email,
      subject: "voom.uz — код подтверждения",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>voom.uz verification</title>
</head>
<body style="margin:0;padding:0;background:#f6f6f6;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f6f6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
          
          <tr>
            <td align="center" style="padding:32px 24px 16px;">
              <img
                src="https://www.voom.uz/logo-email-v2.png"
                alt="voom.uz"
                width="120"
                height=auto
                style="display:block;border-radius:20px;"
              />
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:8px 24px 24px;">
              <p style="margin:0;font-size:16px;color:#333;">
                Ваш код подтверждения
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 24px 24px;">
              <div style="
                display:inline-block;
                padding:18px 28px;
                font-size:32px;
                font-weight:700;
                letter-spacing:6px;
                color:#111;
                border-radius:12px;
                background:#f2f3f5;
              ">
                ${code}
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 24px 32px;">
              <p style="margin:0;font-size:14px;color:#666;">
                Код действителен 10 минут
              </p>
            </td>
          </tr>

          <tr>
            <td style="border-top:1px solid #eee;padding:20px 24px;">
              <p style="margin:0;font-size:13px;color:#888;line-height:1.5;">
                Если вы не запрашивали регистрацию в voom.uz, просто проигнорируйте это письмо.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:16px 0 0;font-size:12px;color:#aaa;">
          © ${new Date().getFullYear()} VOOM
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    console.log(`📧 EMAIL sent to ${email}`);
  } catch (err) {
    console.error("❌ EMAIL send error:", err);
    throw new Error("EMAIL send failed");
  }
};
