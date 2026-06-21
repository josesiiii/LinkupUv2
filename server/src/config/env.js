const required = [
  "MONGO_URI",
  "JWT_SECRET",
  "RESET_TOKEN_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALLBACK_URL",
  "FRONTEND_URL",
  "RECAPTCHA_SECRET_KEY",
  "RESEND_API_KEY",
  "EMAIL_FROM"
];

required.forEach(key => {
  if (!process.env[key]) {
    console.error(`❌ Falta variable de entorno: ${key}`);
    process.exit(1);
  }
});
