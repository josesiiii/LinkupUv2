import { Resend } from "resend"

export const sendPasswordResetEmail = async ({ toEmail, userName, resetLink }) => {
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: "Restablecer tu contraseña — LinkUp",
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #ffffff; border-radius: 16px; border: 1px solid #DADADA;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 24px; font-weight: 800; color: #000000; letter-spacing: -0.03em;">Link<span style="color: #FF3D9E;">Up</span></span>
        </div>
        <h2 style="font-size: 20px; font-weight: 700; color: #000000; margin: 0 0 8px 0;">
          Hola, ${userName}
        </h2>
        <p style="color: #444444; margin-bottom: 24px; line-height: 1.6;">
          Recibimos una solicitud para restablecer la contraseña de tu cuenta.
          Este enlace expira en <strong>${process.env.RESET_TOKEN_EXPIRES_MINUTES} minutos</strong>.
        </p>
        <a
          href="${resetLink}"
          style="display: inline-block; background: #FF3D9E; color: #ffffff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 15px;"
        >
          Restablecer contraseña
        </a>
        <p style="color: #777777; font-size: 12px; margin-top: 24px; line-height: 1.5;">
          Si no solicitaste esto, ignora este correo. Tu contraseña no cambiará.
        </p>
      </div>
    `
  })
}
