exports.getEmailVerificationTemplate = (verifyUrl, userEmail) => {
  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Arial', sans-serif; color: #333; background: #f9f9f9; border-radius: 12px; overflow: hidden; border: 1px solid #ddd;">
      <div style="padding: 24px; background-color: #ffffff;">
        <img src="https://voom.uz/logo.png" alt="VOOM" style="width: 120px; margin-bottom: 20px;" />

        <h2 style="color: #002f34;">Подтвердите ваш адрес эл. почты</h2>

        <p>Здравствуйте!</p>
        <p>Чтобы завершить настройку вашего профиля VOOM, подтвердите ваш адрес:</p>

        <div style="margin: 30px 0; text-align: center;">
          <a href="${verifyUrl}" style="background: #00a83d; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            Подтвердить почту
          </a>
        </div>

        <p style="font-size: 14px; color: #777;">
          Если вы не регистрировались в Voom Support, просто проигнорируйте это письмо.
        </p>

        <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #999;">
          Это письмо отправлено на: <strong>${userEmail}</strong><br/>
          Команда Voom
        </p>
      </div>
    </div>
  `;
};
