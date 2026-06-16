# LinkUp — Requisitos del proyecto

## Requisitos del sistema

| Componente | Versión mínima |
|---|---|
| Node.js | 18+ (recomendado 22.x) |
| pnpm | 11.x |
| MongoDB | Atlas o local 6+ |

---

## Variables de entorno

### `server/.env`
```env
# Base de datos
MONGO_URI=

# JWT
JWT_SECRET=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Google OAuth2
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback
FRONTEND_URL=http://localhost:5173

# reCAPTCHA v2
RECAPTCHA_SECRET_KEY=

# Resend (emails)
RESEND_API_KEY=
EMAIL_FROM=onboarding@resend.dev

# Reset password
RESET_TOKEN_SECRET=
RESET_TOKEN_EXPIRES_MINUTES=30

# Servidor
PORT=5001
```

### `client/.env`
```env
VITE_API_URL=http://localhost:5001
VITE_RECAPTCHA_SITE_KEY=
```

---

## Backend — `server/`

| Paquete | Versión | Uso |
|---|---|---|
| express | ^5.2.1 | Framework HTTP |
| mongoose | ^9.6.2 | ODM para MongoDB |
| socket.io | ^4.8.3 | Chat en tiempo real |
| jsonwebtoken | ^9.0.3 | Autenticación JWT |
| bcryptjs | ^3.0.3 | Hash de contraseñas |
| passport | ^0.7.0 | Autenticación OAuth |
| passport-google-oauth20 | ^2.0.0 | Estrategia Google OAuth2 |
| cloudinary | ^1.41.3 | Almacenamiento de imágenes/videos |
| multer | ^2.1.1 | Subida de archivos (multipart) |
| multer-storage-cloudinary | ^4.0.0 | Integración multer + Cloudinary |
| streamifier | ^0.1.1 | Buffer → stream (stories) |
| node-cron | ^4.2.1 | Cron job limpieza de stories |
| resend | ^6.12.4 | Envío de emails transaccionales |
| axios | ^1.18.0 | Verificación reCAPTCHA |
| cors | ^2.8.6 | Cross-Origin Resource Sharing |
| helmet | ^8.2.0 | Cabeceras de seguridad HTTP |
| express-rate-limit | ^8.5.2 | Rate limiting |
| dotenv | ^17.4.2 | Variables de entorno |
| nodemon *(dev)* | ^3.1.14 | Reinicio automático en desarrollo |

---

## Frontend — `client/`

| Paquete | Versión | Uso |
|---|---|---|
| react | ^18.3.1 | Framework UI |
| react-dom | ^18.3.1 | Renderizado DOM |
| react-router-dom | ^7.1.1 | Enrutamiento SPA |
| zustand | ^5.0.3 | Estado global |
| axios | ^1.7.9 | Cliente HTTP con interceptores |
| socket.io-client | ^4.8.3 | WebSocket (chat en tiempo real) |
| framer-motion | ^11.18.0 | Animaciones y transiciones |
| lucide-react | ^0.469.0 | Iconos SVG |
| react-google-recaptcha | ^3.1.0 | Widget reCAPTCHA v2 |
| gsap | ^3.12.7 | Animaciones avanzadas (landing) |
| d3 | ^7.9.0 | Visualizaciones (globo 3D) |
| tailwindcss *(dev)* | ^4.3.0 | Utilidades CSS |
| vite *(dev)* | ^8.0.12 | Bundler / dev server |

---

## Instalación

```bash
# Backend
cd server
pnpm install

# Frontend
cd client
pnpm install
```

## Desarrollo local

```bash
# Backend (puerto 5001)
cd server && pnpm run dev

# Frontend (puerto 5173)
cd client && pnpm run dev
```
