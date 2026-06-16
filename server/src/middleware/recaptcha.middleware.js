import { verifyRecaptcha } from "../utils/recaptcha.js"

export const checkRecaptcha = async (req, res, next) => {
  const { recaptchaToken } = req.body

  try {
    const result = await verifyRecaptcha(recaptchaToken)

    if (!result.success) {
      return res.status(400).json({ message: result.error })
    }

    next()
  } catch (error) {
    return res.status(500).json({ message: "Error al verificar reCAPTCHA" })
  }
}
