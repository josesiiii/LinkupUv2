import ReCAPTCHA from "react-google-recaptcha"
import { forwardRef } from "react"

const RecaptchaField = forwardRef(({ onChange }, ref) => (
  <div style={{ margin: "4px 0" }}>
    <ReCAPTCHA
      ref={ref}
      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
      onChange={onChange}
    />
  </div>
))

RecaptchaField.displayName = "RecaptchaField"
export default RecaptchaField
