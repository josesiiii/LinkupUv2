# 🎯 GUÍA: IMPLEMENTAR FEED DE RECOMENDACIÓN

## 📋 RESUMEN EJECUTIVO

El feed ya tiene un **algoritmo de compatibilidad funcional** en:
- 📁 `server/src/controllers/userController.js`
- 🔗 Endpoint: `GET /api/users/feed`
- 📊 Retorna: Array de usuarios con score 0-100

**Tu trabajo:** Mejorarlo y completar la UI en frontend

---

## 🔴 PROBLEMAS ACTUALES

1. ❌ **No excluye conexiones previas** (pendientes/aceptadas)
   - El feed muestra usuarios a los que ya enviaste solicitud
   - Solución: Filtrar por Connection table

2. ❌ **No muestra criterios de compatibilidad en UI**
   - Solo muestra score numérico
   - Solución: Mostrar qué tienen en común

3. ❌ **Sin paginación**
   - Si hay 500 usuarios compatibles, retorna todos
   - Solución: Implementar limit + offset

4. ❌ **FeedPage UI incompleta**
   - No muestra perfiles en cards
   - No hay botones para acciones (conectar, guardar, etc.)

---

## 🟢 LO QUE YA ESTÁ LISTO

✅ **Backend - Algoritmo de compatibilidad**
```javascript
calcCompatibility(userA, userB) {
  // Valida: misma institución, mismo campus
  // Puntúa: intereses (40), objetivos (30), facultad (20), semestre (10)
  // Retorna: 0-100
}
```

✅ **Backend - Endpoint GET /api/users/feed**
```javascript
// Retorna usuarios compatibles ordenados por score DESC
GET /api/users/feed
Response: [
  {
    usuario: { _id, fullName, interests, objectives, ... },
    compatibilidad: 75
  }
]
```

✅ **Frontend - Llamada a API**
```javascript
useEffect(() => {
  const response = await api.get("/users/feed");
  setFeed(response.data);
}, []);
```

✅ **Frontend - Filtrado local por interés**
```javascript
const feedFiltrado = filtroInteres
  ? feed.filter(item => 
      item.usuario.interests.some(i => 
        i.includes(filtroInteres)
      )
    )
  : feed;
```

---

## 🛠️ MEJORAS RECOMENDADAS (Prioridad)

### **ALTA PRIORIDAD**

#### 1️⃣ Excluir conexiones previas del feed

**Backend - Modificar `feedUsuarios`:**

```javascript
// En: server/src/controllers/userController.js

export const feedUsuarios = async (req, res) => {
  try {
    const yo = await User.findById(req.usuario._id);
    if (!yo) return res.status(404).json({ message: "Usuario no encontrado" });

    const miCampus = yo.currentCampus || yo.campus;
    const miInstitucion = yo.institution;

    // ✨ NUEVO: Obtener conexiones existentes
    const conexionesExistentes = await Connection.find({
      $or: [
        { from: yo._id },
        { to: yo._id }
      ],
      status: { $ne: "rejected" }  // pending o accepted
    }).select("from to");

    // Extraer IDs de usuarios con conexiones pendientes/aceptadas
    const idsConexionados = conexionesExistentes.map(conn => 
      conn.from.toString() === yo._id.toString() ? conn.to : conn.from
    );

    // Candidatos SIN conexiones previas
    const candidatos = await User.find({
      _id: {
        $ne: yo._id,
        $nin: idsConexionados  // ✨ EXCLUIR conexionados
      },
      institution: miInstitucion,
      $or: [
        { currentCampus: miCampus },
        { campus: miCampus }
      ],
      isActive: true,
      interests: { $exists: true, $not: { $size: 0 } }
    }).select("-password -__v");

    const feed = candidatos
      .map(usuario => ({
        usuario,
        compatibilidad: calcCompatibility(yo, usuario)
      }))
      .filter(r => r.compatibilidad > 0)
      .sort((a, b) => b.compatibilidad - a.compatibilidad);

    res.status(200).json(feed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

#### 2️⃣ Agregar detalles de compatibilidad

**Backend - Extender respuesta:**

```javascript
// Modificar el map de candidatos para incluir breakdown

const feed = candidatos
  .map(usuario => {
    const score = calcCompatibility(yo, usuario);
    
    // ✨ Detalles de compatibilidad
    const sharedInterests = yo.interests.filter(i => 
      usuario.interests.includes(i)
    );
    const sharedObjectives = yo.objectives.filter(o => 
      usuario.objectives.includes(o)
    );
    const mismaFacultad = yo.faculty && 
                          usuario.faculty && 
                          yo.faculty === usuario.faculty;
    const semesterDiff = Math.abs((yo.semester || 1) - (usuario.semester || 1));

    return {
      usuario,
      compatibilidad: score,
      // ✨ NUEVO: Breakdown
      breakdown: {
        interesesCompartidos: sharedInterests,
        objetivosCompartidos: sharedObjectives,
        mismaFacultad: mismaFacultad,
        semestresAprox: semesterDiff <= 2,
        semesterDiff: semesterDiff
      }
    };
  })
  .filter(r => r.compatibilidad > 0)
  .sort((a, b) => b.compatibilidad - a.compatibilidad);
```

#### 3️⃣ Mejorar UI en FeedPage

**Frontend - Mostrar perfiles como cards:**

```jsx
// src/pages/FeedPage.jsx - Reemplazar sección de contenido

{feedFiltrado.length === 0 ? (
  <div>Sin usuarios compatibles</div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {feedFiltrado.map((item) => (
      <div key={item.usuario._id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-blue-500 transition">
        
        {/* HEADER */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {item.usuario.profilePicture && (
              <img 
                src={item.usuario.profilePicture}
                alt={item.usuario.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <h3 className="font-semibold text-white">
                {item.usuario.fullName}
              </h3>
              <p className="text-xs text-zinc-400">
                {item.usuario.semester}º sem • {item.usuario.faculty}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-400">
              {item.compatibilidad}
            </div>
            <p className="text-xs text-zinc-500">compatibilidad</p>
          </div>
        </div>

        {/* BIO */}
        {item.usuario.bio && (
          <p className="text-sm text-zinc-300 mb-4 line-clamp-2">
            {item.usuario.bio}
          </p>
        )}

        {/* BREAKDOWN */}
        <div className="mb-4 text-sm text-zinc-400">
          {item.breakdown.interesesCompartidos.length > 0 && (
            <p>✨ {item.breakdown.interesesCompartidos.join(", ")}</p>
          )}
          {item.breakdown.objetivosCompartidos.length > 0 && (
            <p>🎯 {item.breakdown.objetivosCompartidos.join(", ")}</p>
          )}
          {item.breakdown.mismaFacultad && (
            <p>📚 Misma facultad</p>
          )}
        </div>

        {/* INTERESES */}
        <div className="flex flex-wrap gap-2 mb-4">
          {item.usuario.interests.slice(0, 3).map((int) => (
            <span key={int} className="bg-zinc-800 px-2 py-1 rounded text-xs text-blue-300">
              {int}
            </span>
          ))}
          {item.usuario.interests.length > 3 && (
            <span className="text-xs text-zinc-500">
              +{item.usuario.interests.length - 3}
            </span>
          )}
        </div>

        {/* ACCIONES */}
        <div className="flex gap-2">
          <button
            onClick={() => enviarConexion(item.usuario._id)}
            disabled={enviando[item.usuario._id]}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded transition"
          >
            {enviando[item.usuario._id] ? "..." : "Conectar"}
          </button>
          <button
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded transition"
          >
            💾 Guardar
          </button>
        </div>

      </div>
    ))}
  </div>
)}
```

### **MEDIA PRIORIDAD**

#### 4️⃣ Implementar paginación

**Backend - Agregar query params:**

```javascript
export const feedUsuarios = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // ... código anterior igual ...

    const feed = candidatos
      .map(/* ... */)
      .filter(r => r.compatibilidad > 0)
      .sort((a, b) => b.compatibilidad - a.compatibilidad)
      .slice(skip, skip + limit);  // ✨ PAGINAR

    const total = candidatos.filter(r => r.compatibilidad > 0).length;

    res.status(200).json({
      feed,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Frontend - Cargar más:**

```jsx
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);

const cargarMas = async () => {
  try {
    const response = await api.get("/users/feed", {
      params: { page: page + 1, limit: 20 }
    });
    setFeed([...feed, ...response.data.feed]);
    setPage(page + 1);
    if (page + 1 >= response.data.pagination.pages) {
      setHasMore(false);
    }
  } catch (err) {
    console.error(err);
  }
};
```

#### 5️⃣ Implementar "Guardar perfil"

**Frontend - Agregar función:**

```jsx
const guardarPerfil = async (usuarioId) => {
  try {
    await api.post("/savedprofiles", { savedUser: usuarioId });
    // Mostrar toast o feedback
  } catch (err) {
    console.error(err);
  }
};

// En el button:
<button onClick={() => guardarPerfil(item.usuario._id)}>
  💾 Guardar
</button>
```

#### 6️⃣ Filtros avanzados

**Backend - Agregar query params:**

```javascript
export const feedUsuarios = async (req, res) => {
  try {
    // ... setup inicial igual ...

    const query = {
      _id: { $ne: yo._id, $nin: idsConexionados },
      institution: miInstitucion,
      $or: [
        { currentCampus: miCampus },
        { campus: miCampus }
      ],
      isActive: true,
      interests: { $exists: true, $not: { $size: 0 } }
    };

    // ✨ FILTROS OPCIONALES
    if (req.query.faculty) {
      query.faculty = req.query.faculty;
    }

    if (req.query.semester_min || req.query.semester_max) {
      query.semester = {};
      if (req.query.semester_min) {
        query.semester.$gte = parseInt(req.query.semester_min);
      }
      if (req.query.semester_max) {
        query.semester.$lte = parseInt(req.query.semester_max);
      }
    }

    if (req.query.career) {
      query.career = new RegExp(req.query.career, "i");
    }

    // ... resto del código igual, con query filtrada ...
  }
};
```

**Frontend - Agregar UI de filtros:**

```jsx
const [filters, setFilters] = useState({
  faculty: "",
  semester_min: "",
  semester_max: "",
});

const aplicarFiltros = async () => {
  const response = await api.get("/users/feed", { params: filters });
  setFeed(response.data);
};
```

### **BAJA PRIORIDAD**

#### 7️⃣ Caché de compatibilidad

```javascript
// Usar Redis para cachear scores
// Pre-calcular cada 24h para usuarios activos
// Reduce carga en cada GET /feed
```

#### 8️⃣ Scoring dinámico

```javascript
// Factor: Usuario respondió rápido a mensajes
// Factor: Perfil actualizado recientemente
// Factor: Búsquedas previas similares
```

---

## 📝 CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Backend (2-3 horas)
- [ ] Excluir conexiones previas
- [ ] Agregar breakdown de compatibilidad
- [ ] Implementar paginación
- [ ] Agregar filtros avanzados

### Fase 2: Frontend (4-5 horas)
- [ ] Rediseñar FeedPage con cards
- [ ] Mostrar breakdown de compatibilidad
- [ ] Implementar botones: Conectar, Guardar
- [ ] Agregar UI de filtros
- [ ] Implementar "Cargar más"

### Fase 3: Polish (1-2 horas)
- [ ] Loading states
- [ ] Error handling
- [ ] Validaciones
- [ ] UX improvements

---

## 🧪 TESTING

### Casos de prueba:

```javascript
// 1. Mismo campus, intereses iguales
User A: institución="UdeA", campus="ciudadela", interests=["React", "Node"]
User B: institución="UdeA", campus="ciudadela", interests=["React", "Node"]
→ Esperado: Score alto (~80)

// 2. Diferente campus
User A: campus="ciudadela"
User B: campus="oriente"
→ Esperado: Score 0

// 3. Sin intereses compartidos
User A: interests=["React"]
User B: interests=["Python"]
→ Esperado: Score bajo (~25)

// 4. Conexión pendiente existente
User A → User B (pending)
→ Esperado: User B NO aparece en feed de User A

// 5. Conexión aceptada existente
User A → User B (accepted)
→ Esperado: User B NO aparece en feed de User A
```

---

## 🎨 DISEÑO SUGERIDO PARA CARD

```
┌─────────────────────────────────────────┐
│  [AVATAR]  Nombre Usuario           85% │
│             5º sem • Facultad           │
├─────────────────────────────────────────┤
│  "Bio corta del usuario"                │
├─────────────────────────────────────────┤
│  ✨ React, Machine Learning             │
│  🎯 Networking, Proyectos               │
│  📚 Misma facultad                      │
├─────────────────────────────────────────┤
│  [CONECTAR]  [GUARDAR]                  │
└─────────────────────────────────────────┘
```

---

## 📊 MÉTRICAS A MONITOREAR

1. **Engagement:** % usuarios que envían conexión desde feed
2. **Conversión:** % conexiones que se aceptan
3. **Performance:** Tiempo de respuesta GET /feed
4. **Precisión:** % usuarios recomendados que aceptan
5. **Retencion:** % usuarios que regresan a /feed

---

## 🔗 REFERENCIAS

- Backend modificaciones: `server/src/controllers/userController.js`
- Frontend a actualizar: `client/src/pages/FeedPage.jsx`
- Modelos afectados: `Connection`, `User`
- Endpoints involucrados: `GET /api/users/feed`, `POST /api/connections`, `POST /api/savedprofiles`

*Este documento te da un roadmap claro para mejorar el feed. Implementa de arriba hacia abajo.*
