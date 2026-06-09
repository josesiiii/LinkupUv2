# 📋 LinkupUv2 - Análisis Completo de Arquitectura

## 🎯 1. PROPÓSITO GENERAL

**LinkupUv2** es una **red social universitaria** que conecta estudiantes de instituciones educativas colombianas mediante recomendaciones basadas en compatibilidad. 

**Objetivo:** Facilitar networking y conexiones entre estudiantes de la misma institución/campus que comparten intereses, objetivos académicos y contexto similar.

---

## 📊 2. MODELOS DE DATOS COMPLETOS

### 🧑 **USER MODEL** - Núcleo de la aplicación
```javascript
{
  // ═══ AUTENTICACIÓN ═══════════════════════════════
  fullName: String (required)                    // "Juan Pérez"
  email: String (required, unique)               // "juan@udea.edu.co"
  password: String (hashed)                      // bcryptjs
  role: "user" | "admin"                         // default: "user"
  
  // ═══ ACADÉMICOS ══════════════════════════════════
  career: String                                 // "Ingeniería de Sistemas"
  faculty: String                                // "Facultad de Ingenierías"
  semester: Number (1-12)                        // 5
  
  // ═══ PERFIL PERSONAL ════════════════════════════
  bio: String (max 300 chars)                    // Descripción corta
  profilePicture: String (URL Cloudinary)        // Avatar principal
  photos: [                                      // Galería (máx 6)
    { url: String, order: Number }
  ]
  
  // ═══ INSTITUCIÓN Y UBICACIÓN ══════════════════
  institution: String                            // "Universidad de Antioquia"
  currentCampus: String (ID)                     // "udea-ciudadela"
  city: String                                   // "Medellín"
  department: String                             // "Antioquia"
  
  // ═══ INTERESES Y OBJETIVOS (CLAVE PARA FEED) ═
  interests: [String]                            // ["React", "Machine Learning"]
  objectives: [String]                           // ["Networking", "Proyectos"]
  
  // ═══ ESTADO ═════════════════════════════════════
  isActive: Boolean                              // default: true
  createdAt, updatedAt: Date
}
```

**Índices para performance:** `institution + currentCampus`, `interests`

---

### 🔗 **CONNECTION MODEL** - Sistema de solicitudes
```javascript
{
  from: ObjectId (User)                          // Usuario que solicita
  to: ObjectId (User)                            // Usuario que recibe
  status: "pending" | "accepted" | "rejected"    // Estado
  createdAt: Date
}
```

**Lógica:**
- Previene auto-conexiones y duplicados
- Estado: pending → accepted/rejected
- Base para el sistema de contactos

---

### 💬 **CONVERSATION MODEL** - Sala de chat
```javascript
{
  roomId: String (unique)                        // "userId1_userId2"
  participantA: ObjectId (User)                  // Participante 1
  participantB: ObjectId (User)                  // Participante 2
  lastMessage: String                            // Preview del último mensaje
  lastMessageSender: ObjectId (User)             // Quién lo envió
  lastMessageAt: Date                            // Timestamp
  unreadCountA: Number                           // No leídos para A
  unreadCountB: Number                           // No leídos para B
  createdAt, updatedAt: Date
}
```

---

### 📝 **MESSAGE MODEL** - Mensajes individuales
```javascript
{
  conversation: ObjectId (Conversation)          // Sala a la que pertenece
  sender: ObjectId (User)                        // Quién envía
  text: String (required)                        // Contenido
  readBy: [ObjectId] (User[])                    // Usuarios que leyeron
  edited: Boolean                                // ¿Fue editado?
  editedAt: Date                                 // Cuándo
  createdAt, updatedAt: Date
}
```

---

### 💾 **SAVEDPROFILE MODEL** - Perfiles favoritos
```javascript
{
  user: ObjectId (User)                          // Usuario que guarda
  savedUser: ObjectId (User)                     // Perfil guardado
  createdAt: Date
}
```

---

### 🏫 **CAMPUS MODEL** - (No usado actualmente en BD)
```javascript
{
  name: String
  shortName: String
  city: String
  institution: ObjectId
  isActive: Boolean
}
```

---

## 🔄 3. FLUJOS EXISTENTES

### 📌 **A. SISTEMA DE CONEXIONES**

**Flujo completo:**
```
1. Usuario A ve perfil de Usuario B en el FEED
   ↓
2. Usuario A envía solicitud (POST /api/connections)
   → Crea Connection con status: "pending"
   ↓
3. Usuario B ve solicitud pendiente
   ↓
4. Usuario B acepta (PUT /api/connections/:id/accept)
   → Cambia status a "accepted"
   ↓
5. Ambos se pueden ver en sus CONTACTOS
   → Pueden iniciar conversación
```

**Endpoints:**
- `POST /api/connections` → Enviar solicitud
- `GET /api/connections/pending` → Ver pendientes
- `PUT /api/connections/:id/accept` → Aceptar
- `PUT /api/connections/:id/reject` → Rechazar
- `GET /api/connections/contacts` → Lista de contactos aceptados

---

### 🎯 **B. ALGORITMO DE FEED (COMPATIBILIDAD)**

**Ubicación:** `server/src/controllers/userController.js` → `calcCompatibility()`

```javascript
function calcCompatibility(userA, userB) {
  let score = 0;
  
  // FILTROS ESTRICTOS (retorna 0 si no pasa)
  if (userA.institution !== userB.institution) return 0;
  if (userA.currentCampus !== userB.currentCampus) return 0;
  if (!userB.isActive) return 0;
  if (userB.interests.length === 0) return 0;
  
  // PUNTUACIÓN (0-100)
  
  // Intereses compartidos → 40 puntos máximo
  const sharedInterests = userA.interests.filter(i => 
    userB.interests.includes(i)
  );
  const maxInterests = Math.max(
    userA.interests.length,
    userB.interests.length,
    1
  );
  score += (sharedInterests.length / maxInterests) * 40;
  
  // Objetivos compartidos → 30 puntos máximo
  const sharedObjectives = userA.objectives.filter(o =>
    userB.objectives.includes(o)
  );
  const maxObjectives = Math.max(
    userA.objectives.length,
    userB.objectives.length,
    1
  );
  score += (sharedObjectives.length / maxObjectives) * 30;
  
  // Misma facultad → +20 puntos
  if (userA.faculty && userB.faculty && 
      userA.faculty === userB.faculty) {
    score += 20;
  }
  
  // Semestres cercanos (diferencia ≤ 2) → +10 puntos
  if (Math.abs((userA.semester || 1) - (userB.semester || 1)) <= 2) {
    score += 10;
  }
  
  return Math.round(score);
}
```

**GET /api/users/feed** retorna:
```javascript
[
  {
    usuario: { 
      _id, fullName, email, interests, objectives,
      career, faculty, semester, profilePicture, bio, ...
    },
    compatibilidad: 75  // 0-100
  },
  ...
]
// Ordenado por compatibilidad DESC
```

---

### 💬 **C. SISTEMA DE MENSAJERÍA**

**Crear conversación automáticamente:**
```
Usuario A → envía mensaje a Usuario B
  ↓
¿Existe Conversation entre A y B?
  ├─ NO → Se crea automáticamente con roomId
  └─ SÍ → Se reutiliza
  ↓
Se crea Message
Se actualiza lastMessage, lastMessageAt, unreadCount
Se emite via Socket.io
```

**Endpoints:**
- `POST /api/messages` → `{ to: userId, text: "..." }`
- `GET /api/messages/conversations` → Todas las conversaciones
- `GET /api/messages/conversation/:id` → Últimos 100 mensajes
- `PUT /api/messages/:id` → Editar mensaje

---

### 📸 **D. SISTEMA DE FOTOS**

**Foto de Perfil (1):**
- Remplaza anterior automáticamente
- Almacenado en Cloudinary
- Campo: `User.profilePicture`

**Galería Personal (máx 6):**
- Array en `User.photos[]`
- Cada foto tiene `{ url, order }`
- Se puede reordenar y eliminar

**Endpoints:**
- `POST /api/users/profile-picture` → Subir/reemplazar
- `DELETE /api/users/profile-picture` → Eliminar
- `POST /api/users/photos` → Subir foto a galería
- `GET /api/users/my-photos` → Ver mis fotos
- `PATCH /api/users/photos/reorder` → Reordenar
- `DELETE /api/users/photos/:photoId` → Eliminar foto

---

## 🖥️ 4. FRONTEND - ESTRUCTURA ACTUAL

### 📄 **Páginas Implementadas**
| Página | Ruta | Estado | Funcionalidad |
|--------|------|--------|---------------|
| **LandingPage** | `/` | ✅ | Página pública de bienvenida |
| **LoginPage** | `/login` | ✅ | Autenticación (email + password) |
| **RegisterPage** | `/register` | ✅ | Registro 2 pasos (Auth → Perfil) |
| **FeedPage** | `/feed` | ✅ | Feed con usuarios compatibles |
| **ChatPage** | `/chat` | ❌ VACÍO | Debe implementar mensajería |
| **ProfilePage** | `/profile` | ❌ VACÍO | Debe mostrar/editar perfil |
| **SavedPage** | `/saved` | ❌ VACÍO | Debe mostrar perfiles guardados |

### 🎨 **Componentes Existentes**
```
src/components/
├── auth/
│   └── AnimatedBackground.jsx      (Fondo animado login/register)
├── landing/
│   ├── CampusSection.jsx
│   ├── ConnectSection.jsx
│   ├── Footer.jsx
│   ├── HeroSection.jsx
│   ├── Navbar.jsx
│   ├── NetworkingSection.jsx
│   └── OpportunitiesSection.jsx
└── ui/
    └── animated-shader-hero.jsx
```

### 🔐 **Autenticación Frontend**
```javascript
// authStore.js (Zustand)
{
  usuario: { _id, fullName, email, interests, ... }  // Desde BD
  token: "eyJ..."                                      // JWT
  setAuth(usuario, token)                            // Guarda en localStorage
  logout()                                            // Limpia localStorage
}
```

### 🔗 **Rutas Protegidas**
```jsx
<ProtectedRoute>
  <FeedPage />
</ProtectedRoute>
// Redirige a /login si no hay token
```

---

## 🎯 5. INTERESES Y OBJETIVOS

### 📌 **INTERESES** (19 predefinidos)
```javascript
[
  "React", "Node.js", "MongoDB", "Docker", "Python",
  "Machine Learning", "Figma", "UI/UX", "JavaScript",
  "TypeScript", "AWS", "IoT", "Arduino", "Ciberseguridad",
  "SQL", "HTML", "CSS", "Linux"
]
```
**Almacenamiento:** Array en `User.interests`
**Selección:** En RegisterPage mediante chips

### 🎓 **OBJETIVOS** (5 predefinidos)
```javascript
[
  "Networking",      // Conocer personas
  "Proyectos",       // Hacer proyectos juntos
  "Investigación",   // Hacer investigación
  "Emprendimiento",  // Crear empresa/startup
  "Estudio"          // Estudiar juntos
]
```
**Almacenamiento:** Array en `User.objectives`

---

## 🏫 6. INSTITUCIONES SOPORTADAS

**Archivo:** `server/src/config/institutions.js`

| Email Domain | Institución | Campuses | Ciudad Principal |
|---|---|---|---|
| `soy.sena.edu.co` | SENA | 6 | Múltiples |
| `itm.edu.co` | ITM | 3 | Medellín |
| `udea.edu.co` | Universidad de Antioquia | 4 | Medellín |
| `pascualbravo.edu.co` | Pascual Bravo | 1 | Medellín |
| `unal.edu.co` | Universidad Nacional | 4 | Múltiples |
| `uniminuto.edu.co` | UNIMINUTO | 3 | Múltiples |

**Validación:** Email debe terminar en dominio registrado

---

## 📡 7. ENDPOINTS COMPLETOS

### 🔐 **Autenticación** (`/api/auth`)
```
POST   /register           Body: { fullName, email, password, currentCampus, interests, objectives, ... }
POST   /login              Body: { email, password }
GET    /me                 (protegido)
PUT    /change-password    Body: { passwordActual, passwordNuevo }
```

### 👥 **Usuarios** (`/api/users`)
```
GET    /feed               (protegido) → [{ usuario, compatibilidad }]
GET    /search?q=...       (protegido) → Buscar por nombre
GET    /                   (protegido) → Todos los usuarios
GET    /:id                (protegido) → Perfil específico
PUT    /profile            (protegido) → Actualizar campos
POST   /profile-picture    (protegido, multipart)
DELETE /profile-picture    (protegido)
POST   /photos             (protegido, multipart)
GET    /my-photos          (protegido)
PATCH  /photos/reorder     Body: { orderedIds: [id1, id2, ...] }
DELETE /photos/:photoId    (protegido)
```

### 🔗 **Conexiones** (`/api/connections`)
```
POST   /                   Body: { to: userId }
GET    /pending            (protegido)
GET    /accepted           (protegido)
GET    /contacts           (protegido)
PUT    /:id/accept         (protegido)
PUT    /:id/reject         (protegido)
```

### 💬 **Mensajes** (`/api/messages`)
```
POST   /                   Body: { to: userId, text: "..." }
GET    /conversations      (protegido)
GET    /conversation/:id   (protegido)
PUT    /:id                Body: { text: "..." }
```

### 💾 **Perfiles Guardados** (`/api/savedprofiles`)
```
POST   /                   Body: { savedUser: userId }
GET    /                   (protegido)
DELETE /:id                (protegido)
```

---

## 🚀 8. PARA IMPLEMENTAR EL FEED DE RECOMENDACIÓN

### ✅ **Lo que ya existe:**
- Algoritmo de compatibilidad (`calcCompatibility`)
- Filtrado por institución y campus
- Puntuación por intereses (40%), objetivos (30%), facultad (20%), semestre (10%)
- Endpoint `/api/users/feed` que retorna compatibilidad

### 🎯 **Mejoras sugeridas para el feed:**

1. **Excluir conexiones ya enviadas/aceptadas:**
   ```javascript
   // Agregar a candidatos:
   const conexionesExistentes = await Connection.find({
     $or: [
       { from: yo._id, to: { $in: candidatos } },
       { to: yo._id, from: { $in: candidatos } }
     ],
     status: { $ne: "rejected" }
   });
   // Filtrar candidatos
   ```

2. **Paginación:**
   ```javascript
   GET /api/users/feed?page=1&limit=20
   ```

3. **Caché de compatibilidad:**
   ```javascript
   // Pre-calcular cada 24h
   // Almacenar en Redis o Compatibility collection
   ```

4. **Filtros avanzados:**
   ```javascript
   GET /api/users/feed?faculty=Ingenierías&semester_min=3&semester_max=6
   ```

5. **Ranking dinámico:**
   - Factor: usuarios que respondieron mensajes rápido
   - Factor: actualización reciente del perfil
   - Factor: búsquedas previas similares

6. **Saved profiles en feed:**
   - Mostrar badge si usuario está guardado

---

## 📚 9. RESUMEN DE NOMBRES DE CAMPOS CLAVE

### **Para filtrado de compatibilidad:**
- `institution` - Institución educativa
- `currentCampus` - ID del campus
- `interests` - Array de intereses
- `objectives` - Array de objetivos
- `faculty` - Facultad
- `semester` - Semestre del usuario
- `isActive` - Usuario activo

### **Para conexiones:**
- `Connection.from` - Quién solicita
- `Connection.to` - Quién recibe
- `Connection.status` - pending/accepted/rejected

### **Para mensajes:**
- `Conversation.roomId` - ID único de sala
- `Conversation.participantA/B` - Usuarios
- `Message.sender` - Quién envía
- `Message.readBy` - Quiénes leyeron

---

## 📊 10. FLUJO USUARIO FINAL TÍPICO

```
1. Nuevo usuario
   └─ Va a /register
   └─ Ingresa email institucional
   └─ Sistema obtiene institución y campuses
   └─ Completa perfil (career, interests, objectives)
   └─ Se crea en BD
   └─ Va a /feed

2. En /feed
   └─ Ve usuarios compatibles (ordenados por score)
   └─ Puede filtrar por intereses
   └─ Envía conexión a alguien que le interesa

3. Otro usuario recibe solicitud
   └─ Ve en "Solicitudes pendientes"
   └─ Acepta o rechaza

4. Se conectan
   └─ Pueden verse en "Mis contactos"
   └─ Pueden iniciar conversación

5. Mensajería
   └─ Se abre automáticamente Conversation
   └─ Intercambian mensajes en tiempo real (Socket.io)
   └─ Pueden editar mensajes

6. Perfil
   └─ Pueden editar intereses, objetivos, bio, fotos
   └─ Sus cambios afectan compatibilidad futura
```

---

## 🔧 11. STACK TECNOLÓGICO

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **BD:** MongoDB + Mongoose
- **RT:** Socket.io
- **Auth:** JWT + bcryptjs
- **Storage:** Cloudinary
- **Seguridad:** Helmet, CORS, Rate-limiting

### Frontend
- **Framework:** React 18
- **Build:** Vite
- **Router:** React Router v6
- **State:** Zustand
- **HTTP:** Axios
- **Styling:** TailwindCSS
- **Icons:** Lucide React

---

*Análisis generado: 2026-06-09*
