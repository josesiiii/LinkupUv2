# 📊 LINKUPUV2 - DIAGRAMAS DE FLUJO

## 1. FLUJO DE REGISTRO Y LOGIN

```
┌─────────────────────────────────────────────────────────────┐
│                     USUARIO NUEVO                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────┐
        │  Accede a /register      │
        └───────────┬──────────────┘
                    │
                    ▼
    ┌───────────────────────────────────┐
    │  PASO 1: Ingresa credenciales     │
    │  • fullName                        │
    │  • email (ej: juan@udea.edu.co)   │
    │  • password (mín 8 chars)         │
    │  • selecciona campus              │
    └────────────┬──────────────────────┘
                 │
                 ▼
    ┌──────────────────────────────────┐
    │ Sistema valida dominio email    │
    │ ej: @udea.edu.co → UdeA         │
    │                                  │
    │ Si ✅ → obtiene campuses         │
    │ Si ❌ → error                    │
    └────────────┬─────────────────────┘
                 │
                 ▼
    ┌──────────────────────────────────┐
    │  PASO 2: Completa perfil         │
    │  • career (carrera)               │
    │  • faculty (facultad)             │
    │  • semester (1-12)                │
    │  • bio (descripción)              │
    │  • interests[] (chips)            │
    │  • objectives[] (chips)           │
    └────────────┬─────────────────────┘
                 │
                 ▼
    ┌──────────────────────────────────┐
    │  POST /auth/register              │
    │                                  │
    │  Backend:                         │
    │  1. Hash password (bcryptjs)     │
    │  2. Crea User en BD              │
    │  3. Genera JWT (7 días)          │
    └────────────┬─────────────────────┘
                 │
                 ▼
    ┌──────────────────────────────────┐
    │  localStorage.setItem:            │
    │  • usuario (JSON)                │
    │  • token (JWT)                   │
    └────────────┬─────────────────────┘
                 │
                 ▼
    ┌──────────────────────────────────┐
    │  ✅ Redirige a /feed             │
    │                                  │
    │  Usuario logueado                │
    └──────────────────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│                    LOGIN - USUARIO EXISTENTE                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────┐
        │  Accede a /login         │
        └───────────┬──────────────┘
                    │
                    ▼
    ┌───────────────────────────────────┐
    │  POST /auth/login                 │
    │  • email                          │
    │  • password                       │
    └────────────┬──────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
    ✅ Válido         ❌ Inválido
    (score: 75)       (error)
        │                 │
        ▼                 ▼
    JWT               Error en
    generado          pantalla
        │
        ▼
    localStorage
        │
        ▼
    /feed
```

---

## 2. FLUJO DEL FEED - ALGORITMO DE COMPATIBILIDAD

```
┌─────────────────────────────────────────────────────────────┐
│  Usuario A entra a /feed                                    │
│  GET /api/users/feed                                        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────┐
    │ Backend - findUserA by token   │
    │ Obtiene:                        │
    │ • institution                   │
    │ • currentCampus                 │
    │ • interests[]                   │
    │ • objectives[]                  │
    │ • faculty                       │
    │ • semester                      │
    └────────────┬───────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────────┐
    │ Query BD para CANDIDATOS:              │
    │ WHERE:                                  │
    │  • _id ≠ User A                       │
    │  • institution = User A.institution   │
    │  • campus = User A.campus             │
    │  • isActive = true                    │
    │  • interests.length > 0               │
    └────────────┬───────────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────────┐
    │ Para CADA candidato:                   │
    │ calcCompatibility(UserA, Candidato)   │
    └────────────┬───────────────────────────┘
                 │
        ┌────────┴─────────────────────────────┐
        │                                      │
        ▼                                      ▼
    ┌──────────────────────┐      ┌──────────────────────┐
    │ Institución ≠?       │      │ Campus ≠?            │
    │ Sí ──┐               │      │ Sí ──┐               │
    │      └→ score = 0    │      │      └→ score = 0    │
    │      (no puntúa)     │      │      (no puntúa)     │
    └──────────────────────┘      └──────────────────────┘
                 │
        ┌────────┘
        │
        ▼
    ┌─────────────────────────────────────┐
    │  PUNTUACIÓN (0-100)                 │
    │                                     │
    │  score = 0                          │
    │                                     │
    │  + (interesCompartidos/max) × 40    │
    │    "React, Node" → 20 puntos        │
    │                                     │
    │  + (objetivosCompartidos/max) × 30  │
    │    "Proyectos" → 15 puntos          │
    │                                     │
    │  + (mismaFacultad ? 20 : 0)         │
    │    "Ingeniería" = "Ingeniería"      │
    │                                     │
    │  + (|semestre_diff| ≤ 2 ? 10 : 0)   │
    │    |5 - 6| = 1 → 10 puntos          │
    │                                     │
    │  = 75                               │
    └──────────────────────┬──────────────┘
                           │
                           ▼
    ┌────────────────────────────────┐
    │ {                              │
    │   usuario: { ... },            │
    │   compatibilidad: 75           │
    │ }                              │
    └────────────────────────────────┘

[REPETIR PARA TODOS LOS CANDIDATOS]

    ▼

    ┌────────────────────────────────┐
    │ Filtrar: compatibilidad > 0    │
    │ Ordenar: DESC (mayor primero)  │
    │                                │
    │ [                              │
    │   { usuario: B, score: 85 },   │
    │   { usuario: C, score: 75 },   │
    │   { usuario: D, score: 50 }    │
    │ ]                              │
    └────────────┬───────────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │ Frontend - FeedPage        │
    │                            │
    │ Mostrar tarjetas:          │
    │ [Usuario B - 85%]          │
    │ [Usuario C - 75%]          │
    │ [Usuario D - 50%]          │
    └────────────────────────────┘
```

---

## 3. FLUJO DE CONEXIONES

```
┌──────────────────────────────────────────────────────────┐
│          USUARIO A VE USUARIO B EN FEED                 │
└────────────┬─────────────────────────────────────────────┘
             │
             ▼
    ┌────────────────────────────────┐
    │ Click en botón "Conectar"      │
    │                                │
    │ POST /api/connections          │
    │ { to: B._id }                  │
    └────────────┬───────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────┐
    │ Backend valida:                    │
    │ • from ≠ to (no auto-conexiones)   │
    │ • No conexión previa existente    │
    └────────────┬──────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
    ✅ Valid         ❌ Error
        │                 │
        ▼                 ▼
    CREATE Connection   Error msg
        │
    ┌───┴────────────────────────────┐
    │ Connection DB:                 │
    │ • from: A._id                  │
    │ • to: B._id                    │
    │ • status: "pending"            │
    │ • createdAt: now               │
    └────────────┬────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────┐
    │ Frontend:                       │
    │ Remove B from feed             │
    │ Show "Solicitud enviada"       │
    └────────────┬───────────────────┘
                 │
                 ▼
    ┌──────────────────────────────────────────────┐
    │ USUARIO B ve solicitud en "Pendientes"     │
    │                                              │
    │ GET /api/connections/pending                │
    │ ↓                                            │
    │ [{ from: A, status: "pending" }]           │
    └────────────┬─────────────────────────────────┘
                 │
        ┌────────┴─────────┐
        │                  │
        ▼                  ▼
    [Aceptar]          [Rechazar]
        │                  │
        ▼                  ▼
    PUT /connections   PUT /connections
    /:id/accept        /:id/reject
        │                  │
        ▼                  ▼
    status =           status =
    "accepted"         "rejected"
        │                  │
        └────────┬─────────┘
                 │
        ┌────────┴──────────────────┐
        │                           │
        ▼                           ▼
    ✅ Conectados            ❌ Rechazado
        │                      │
        ▼                      ▼
    GET /connections     A no ve a B
    /contacts            en el feed
        │
        ▼
    [A, B]
        │
        ▼
    Pueden iniciar
    conversación
```

---

## 4. FLUJO DE MENSAJERÍA

```
┌─────────────────────────────────────────────────┐
│  USUARIO A quiere escribir a USUARIO B         │
└────────────┬──────────────────────────────────┘
             │
             ▼
    ┌──────────────────────────┐
    │ Click en contacto B      │
    │                          │
    │ En /chat o contactos     │
    └────────────┬─────────────┘
                 │
                 ▼
    ┌──────────────────────────────────────────┐
    │ POST /api/messages                       │
    │                                          │
    │ {                                        │
    │   to: B._id,                            │
    │   text: "Hola, ¿cómo estás?"           │
    │ }                                        │
    └────────────┬───────────────────────────┘
                 │
                 ▼
    ┌─────────────────────────────────────┐
    │ Backend - ¿Conversation existe?    │
    │                                     │
    │ WHERE:                              │
    │  (participantA = A AND             │
    │   participantB = B)                │
    │  OR                                 │
    │  (participantA = B AND             │
    │   participantB = A)                │
    └────────────┬───────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
    NO - Crear      SÍ - Reutilizar
    nueva           existente
        │                 │
        └────────┬────────┘
                 │
                 ▼
    ┌─────────────────────────────────────┐
    │ CREATE Message                      │
    │                                     │
    │ {                                   │
    │   conversation: convId,             │
    │   sender: A._id,                    │
    │   text: "Hola, ¿cómo estás?",     │
    │   readBy: [A._id],                 │
    │   created: now                      │
    │ }                                   │
    └────────────┬────────────────────────┘
                 │
                 ▼
    ┌──────────────────────────────────────────┐
    │ UPDATE Conversation                      │
    │                                          │
    │ • lastMessage: "Hola, ¿cómo estás?"   │
    │ • lastMessageAt: now                    │
    │ • lastMessageSender: A._id              │
    │ • unreadCountB: +1                      │
    └────────────┬─────────────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────────┐
    │ Socket.io emit                         │
    │                                        │
    │ io.to(roomId).emit("receiveMessage", {│
    │   sender: A,                           │
    │   text: "...",                         │
    │   timestamp: now                       │
    │ })                                     │
    └────────────┬───────────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────┐
    │ B recibe en tiempo real            │
    │ (si está en /chat)                 │
    │                                    │
    │ "A: Hola, ¿cómo estás?"           │
    └────────────┬──────────────────────┘
                 │
                 ▼
    ┌──────────────────────────────────┐
    │ B puede:                         │
    │ • Responder                      │
    │ • Editar (si es su mensaje)     │
    │ • Marcar como leído             │
    └──────────────────────────────────┘
```

---

## 5. FLUJO DE ACTUALIZACIÓN DE PERFIL

```
┌──────────────────────────────┐
│  Usuario va a /profile       │
│  O edita desde settings      │
└────────────┬─────────────────┘
             │
             ▼
    ┌───────────────────────────────┐
    │ Formulario de edición:        │
    │                               │
    │ • fullName                    │
    │ • bio                         │
    │ • career                      │
    │ • faculty                     │
    │ • semester                    │
    │ • interests[] (chips)         │
    │ • objectives[] (chips)        │
    │ • + foto de perfil (upload)   │
    │ • + galería (max 6 fotos)     │
    └────────────┬──────────────────┘
                 │
                 ▼
    ┌──────────────────────────────┐
    │ Click: "Guardar cambios"     │
    │                              │
    │ PUT /api/users/profile       │
    │ {                            │
    │   fullName, bio, career,     │
    │   faculty, semester,         │
    │   interests[], objectives[]  │
    │ }                            │
    └────────────┬─────────────────┘
                 │
                 ▼
    ┌──────────────────────────────────┐
    │ Backend actualiza User          │
    │                                 │
    │ $set: {                         │
    │   fullName, bio, ...           │
    │   interests: newInterests[]    │
    │   objectives: newObjectives[]  │
    │ }                              │
    └────────────┬──────────────────┘
                 │
                 ▼
    ┌──────────────────────────────────┐
    │ ✅ Perfil actualizado           │
    │                                 │
    │ EFECTO:                        │
    │ • Cambios en localStorage      │
    │ • Feed cambia compatibilidad   │
    │   (otros verán nuevo score)    │
    └──────────────────────────────────┘

    Foto de perfil: Cloudinary upload
    
    Galería: Array photos[] max 6
             Cada foto con { url, order }
```

---

## 6. ARQUITECTURA DE DATOS

```
┌─────────────────────────────────┐
│         USER Collection          │
├─────────────────────────────────┤
│ _id                             │
│ fullName, email, password       │
│ institution, currentCampus      │
│ career, faculty, semester       │
│ bio, profilePicture, photos[]   │
│ interests[], objectives[]  ◄─── CLAVE PARA FEED
│ isActive                        │
│ createdAt, updatedAt            │
└────┬──────────────────────────┬──┘
     │                          │
     │ 1:N                  1:N │
     │                          │
     ▼                          ▼
┌──────────────────┐  ┌──────────────────┐
│ CONNECTION       │  │ MESSAGE          │
├──────────────────┤  ├──────────────────┤
│ from (UserId)    │  │ sender (UserId)  │
│ to (UserId)      │  │ text             │
│ status: pending/ │  │ readBy[]         │
│ accepted/rejected│  │ edited           │
└──────────────────┘  └────────┬─────────┘
                               │
                        references
                               │
                               ▼
                    ┌──────────────────────┐
                    │ CONVERSATION        │
                    ├──────────────────────┤
                    │ participantA         │
                    │ participantB         │
                    │ roomId               │
                    │ lastMessage          │
                    │ lastMessageAt        │
                    │ unreadCount A/B      │
                    └──────────────────────┘

┌──────────────────────┐
│ SAVEDPROFILE        │
├──────────────────────┤
│ user (UserId)       │
│ savedUser (UserId)  │
│ createdAt           │
└──────────────────────┘
```

---

## 7. FLUJO DE VERIFICACIÓN DE EMAIL

```
┌─────────────────────────────────┐
│ Usuario ingresa email            │
│ ej: juan@udea.edu.co             │
└─────────────┬───────────────────┘
              │
              ▼
    ┌─────────────────────────────┐
    │ Sistema extrae dominio:     │
    │ @udea.edu.co                │
    └─────────────┬───────────────┘
                  │
                  ▼
    ┌──────────────────────────────────┐
    │ Busca en INSTITUTIONS config     │
    │                                  │
    │ "udea.edu.co": {                 │
    │   name: "Universidad de ...",   │
    │   campuses: [...]               │
    │ }                                │
    └─────────────┬────────────────────┘
                  │
          ┌───────┴────────┐
          │                │
          ▼                ▼
    ✅ Encontrado   ❌ No existe
          │                │
          ▼                ▼
    Retorna           Error:
    institución       "Email no
    y campuses        válido"
          │                │
          └───────┬────────┘
                  │
    (Si ✅) Frontend muestra
    dropdown de campuses
```

---

## 8. CICLO DE VIDA DE UN USUARIO

```
        START
          │
          ▼
    ┌──────────────┐
    │  Registro    │ (email verificado)
    └──────┬───────┘
           │
           ▼
    ┌────────────────────┐
    │  Perfil incompleto  │
    │  • Sin intereses    │
    │  • Sin objetivos    │
    └──────┬──────────────┘
           │
           ▼
    ┌──────────────────────────┐
    │  Entra a /feed           │
    │  Recibe recomendaciones  │
    └──────┬───────────────────┘
           │
           ▼
    ┌──────────────────────────┐
    │  Envía conexiones        │
    │  (Connection pending)    │
    └──────┬───────────────────┘
           │
           ▼
    ┌──────────────────────────┐
    │  Recibe solicitudes      │
    │  (Decision: accept/reject)
    └──────┬───────────────────┘
           │
           ▼
    ┌──────────────────────────┐
    │  Conectado (accepted)    │
    │  Puede mensajear         │
    └──────┬───────────────────┘
           │
           ▼
    ┌──────────────────────────┐
    │  Chat en /chat           │
    │  Real-time messaging     │
    └──────┬───────────────────┘
           │
           ▼
    ┌──────────────────────────┐
    │  Actualiza perfil        │
    │  (Cambios de compatibilidad)
    └──────┬───────────────────┘
           │
           ▼
       ACTIVE
       (ciclo continuo)
```

---

*Diagramas generados: 2026-06-09*
