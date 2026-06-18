import axios from "axios"

export const verifyRecaptcha = async (token) => {
  if (!token) {
    return { success: false, error: "Token de reCAPTCHA ausente" }
  }

  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token
        },
        timeout: 5000
      }
    )

    if (!response.data.success) {
      return { success: false, error: "reCAPTCHA inválido o expirado" }
    }

    return { success: true }
  } catch {
    return { success: false, error: "No se pudo verificar reCAPTCHA. Intenta de nuevo." }
  }
}
