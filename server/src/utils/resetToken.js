import jwt from "jsonwebtoken"

export const generateResetToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.RESET_TOKEN_SECRET,
    { expiresIn: `${process.env.RESET_TOKEN_EXPIRES_MINUTES}m` }
  )
}

export const verifyResetToken = (token) => {
  try {
    return jwt.verify(token, process.env.RESET_TOKEN_SECRET)
  } catch {
    return null
  }
}
