import { verifyRecaptcha } from "../utils/recaptcha.js"

export const checkRecaptcha = async (req, res, next) => {
  if (process.env.BYPASS_RECAPTCHA === "true") return next()

  const { recaptchaToken } = req.body

  const result = await verifyRecaptcha(recaptchaToken)

  if (!result.success) {
    return res.status(400).json({ message: result.error })
  }

  next()
}
