import axios from "axios"

export const verifyRecaptcha = async (token) => {
  if (!token) {
    return { success: false, error: "Token de reCAPTCHA ausente" }
  }

  const response = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    null,
    {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token
      }
    }
  )

  if (!response.data.success) {
    return { success: false, error: "reCAPTCHA inválido o expirado" }
  }

  return { success: true }
}
