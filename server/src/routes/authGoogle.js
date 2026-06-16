import express from "express"
import passport from "../config/passport.js"
import { generateToken } from "../utils/jwt.js"

const router = express.Router()

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false
  })
)

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed`
  }),
  (req, res) => {
    const token = generateToken(req.user._id, req.user.role)
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`)
  }
)

export default router
