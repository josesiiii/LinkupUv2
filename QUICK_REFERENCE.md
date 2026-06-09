# 🚀 LINKUPUV2 - QUICK REFERENCE

## 📍 ENTIDADES CLAVE

```
┌─────────────────────────────────────────────────────┐
│ USER                                                │
├─────────────────────────────────────────────────────┤
│ • id, fullName, email, password                     │
│ • institution, currentCampus, city, department      │
│ • career, faculty, semester                         │
│ • interests[], objectives[]  ← CLAVE PARA FEED     │
│ • bio, profilePicture, photos[]                     │
│ • isActive, createdAt, updatedAt                    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ CONNECTION                                          │
├─────────────────────────────────────────────────────┤
│ • from (UserId), to (UserId)                        │
│ • status: pending | accepted | rejected             │
│ • createdAt                                         │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ CONVERSATION                                        │
├─────────────────────────────────────────────────────┤
│ • roomId (userId1_userId2)                          │
│ • participantA, participantB                        │
│ • lastMessage, lastMessageAt                        │
│ • unreadCountA, unreadCountB                        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ MESSAGE                                             │
├─────────────────────────────────────────────────────┤
│ • conversation (ConversationId)                     │
│ • sender (UserId)                                   │
│ • text, readBy[], edited, editedAt                  │
│ • createdAt, updatedAt                              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ SAVEDPROFILE                                        │
├─────────────────────────────────────────────────────┤
│ • user (UserId), savedUser (UserId)                 │
│ • createdAt                                         │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 ALGORITMO DE FEED (calcCompatibility)

```
if (institution ≠ same) → return 0        ❌ FILTRO ESTRICTO
if (currentCampus ≠ same) → return 0      ❌ FILTRO ESTRICTO

score = 0

score += (interesesCompartidos / max) * 40     (40 pts máx)
score += (objetivosCompartidos / max) * 30    (30 pts máx)
score += (mismaFacultad) * 20                 (20 pts máx)
score += (|semestre_diff| ≤ 2) * 10           (10 pts máx)

→ Total: 0-100
```

**GET /api/users/feed** → Array de `{ usuario, compatibilidad }`

---

## 🔌 ENDPOINTS PRINCIPALES

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
PUT    /api/auth/change-password
```

### Feed & Búsqueda
```
GET    /api/users/feed              ← COMPATIBILIDAD
GET    /api/users/search?q=...      ← Por nombre
```

### Conexiones
```
POST   /api/connections              ← Enviar solicitud
GET    /api/connections/pending      ← Mis solicitudes
GET    /api/connections/contacts     ← Mis conectados
PUT    /api/connections/:id/accept
PUT    /api/connections/:id/reject
```

### Mensajes
```
POST   /api/messages                 ← Enviar
GET    /api/messages/conversations   ← Listar chats
GET    /api/messages/conversation/:id ← Historial
```

### Perfil
```
PUT    /api/users/profile            ← Editar
POST   /api/users/profile-picture    ← Foto avatar
POST   /api/users/photos             ← Añadir a galería
```

---

## 📊 INTERESES Y OBJETIVOS

### Intereses (19)
```javascript
["React", "Node.js", "MongoDB", "Docker", "Python",
 "Machine Learning", "Figma", "UI/UX", "JavaScript",
 "TypeScript", "AWS", "IoT", "Arduino", "Ciberseguridad",
 "SQL", "HTML", "CSS", "Linux"]
```

### Objetivos (5)
```javascript
["Networking", "Proyectos", "Investigación",
 "Emprendimiento", "Estudio"]
```

---

## 🏫 INSTITUCIONES

```
Dominio              | Institución                    | Campuses
─────────────────────┼────────────────────────────────┼─────────
soy.sena.edu.co      | SENA                           | 6
itm.edu.co           | ITM                            | 3
udea.edu.co          | Universidad de Antioquia       | 4
pascualbravo.edu.co  | Pascual Bravo                  | 1
unal.edu.co          | Universidad Nacional           | 4
uniminuto.edu.co     | UNIMINUTO                      | 3
```

---

## 🖥️ PÁGINAS FRONTEND

| Página | Ruta | Estado | Funcionalidad |
|--------|------|--------|---------------|
| Landing | `/` | ✅ | Público |
| Login | `/login` | ✅ | Auth |
| Register | `/register` | ✅ | Signup 2 pasos |
| **Feed** | `/feed` | ✅ | **RECOMENDACIONES** |
| Chat | `/chat` | ❌ | To-do |
| Profile | `/profile` | ❌ | To-do |
| Saved | `/saved` | ❌ | To-do |

---

## 🔐 AUTENTICACIÓN

```
┌─────────────┐      ┌─────────────┐
│  Login      │      │  Register   │
└──────┬──────┘      └──────┬──────┘
       │                    │
       └────────┬───────────┘
                │
         POST /auth/register o /auth/login
                │
         Genera JWT (válido 7 días)
                │
         Guardar en localStorage:
         • usuario
         • token
                │
         Redirige a /feed
                │
         Middleware: protegerRuta valida token
```

---

## 💾 FLOW DE MENSAJERÍA

```
Usuario A → Envía mensaje a Usuario B

  ¿Existe Conversation?
  ├─ NO  → Se crea automáticamente
  └─ SÍ  → Se reutiliza

  Se crea Message
  Se actualiza Conversation:
    • lastMessage
    • lastMessageAt
    • unreadCount (para B +1)

  Socket.io emite a sala "roomId"
```

---

## 🔗 FLOW DE CONEXIONES

```
USUARIO A ve a USUARIO B en /feed
           │
           ↓
    Envía conexión
           │
           ↓
USUARIO B recibe solicitud pendiente
           │
           ├─→ Acepta  → status: "accepted" → Contactos
           │
           └─→ Rechaza → status: "rejected"
```

---

## 🎨 COMPONENTES FRONTEND

```
src/components/
├── auth/
│   └── AnimatedBackground.jsx
├── landing/
│   ├── Navbar.jsx
│   ├── HeroSection.jsx
│   ├── CampusSection.jsx
│   ├── ConnectSection.jsx
│   ├── NetworkingSection.jsx
│   ├── OpportunitiesSection.jsx
│   └── Footer.jsx
└── ui/
    └── animated-shader-hero.jsx
```

---

## 🚀 RECOMENDACIONES PARA MEJORAR FEED

1. **Excluir conexiones pendientes/aceptadas** del feed
2. **Paginación:** `?page=1&limit=20`
3. **Filtros avanzados:** `?faculty=...&semester_min=...`
4. **Caché:** Pre-calcular compatibilidad
5. **Ranking dinámico:** Por actividad, respuestas rápidas
6. **Búsqueda específica:** Más allá de nombres

---

## 📝 CAMPOS PARA COMPATIBILIDAD

**FILTROS (Eliminan):**
- `institution` ≠ same → score 0
- `currentCampus` ≠ same → score 0

**PUNTUACIÓN (Suman):**
- `interests[]` similares
- `objectives[]` similares
- `faculty` igual
- `semester` dentro de 2 diferencia

**INFORMACIÓN:**
- `career`, `semester`, `bio`, `photos`

---

## 🔗 URLS Y PATHS IMPORTANTES

```
Server: http://localhost:5000/api
Frontend: http://localhost:5173

KEY ROUTES:
/api/users/feed                    ← FEED DE RECOMENDACIÓN
/api/connections                   ← SISTEMA DE CONEXIONES
/api/messages                      ← MENSAJERÍA
/api/auth                          ← AUTENTICACIÓN

Socket.io events:
- registerUser(userId)
- joinRoom(roomId)
- sendMessage(data)
- receiveMessage(data)
```

---

*Última actualización: 2026-06-09*
