import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import User from "../models/User.js"

// Llamar esta función desde app.js DESPUÉS de dotenv.config()
export const initPassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // 1. Ya existe con este googleId
          let user = await User.findOne({ googleId: profile.id })
          if (user) return done(null, user)

          // 2. Mismo email en cuenta local → vincular googleId
          user = await User.findOne({ email: profile.emails[0].value })
          if (user) {
            user.googleId = profile.id
            if (!user.profilePicture && profile.photos?.[0]?.value) {
              user.profilePicture = profile.photos[0].value
            }
            await user.save()
            return done(null, user)
          }

          // 3. Crear usuario nuevo con Google
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            fullName: profile.displayName,
            profilePicture: profile.photos?.[0]?.value || "",
            authProvider: "google",
            institution: "",
            currentCampus: null
          })

          return done(null, user)
        } catch (err) {
          return done(err, null)
        }
      }
    )
  )
}

export default passport
