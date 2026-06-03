import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import api from "../api/axios";

function FeedPage() {
  const usuario = useAuthStore((state) => state.usuario);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState({});
  const [filtroInteres, setFiltroInteres] = useState("");

  // Obtener feed de usuarios compatibles
  useEffect(() => {
    const obtenerFeed = async () => {
      try {
        setLoading(true);
        const response = await api.get("/users/feed");
        setFeed(response.data);
        setError(null);
      } catch (err) {
        setError("No se pudo cargar el feed");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    obtenerFeed();
  }, []);

  // Enviar solicitud de conexión
  const enviarConexion = async (usuarioId) => {
    try {
      setEnviando((prev) => ({
        ...prev,
        [usuarioId]: true
      }));

      await api.post("/connections", {
        to: usuarioId
      });

      // Remover usuario del feed después de enviar conexión
      setFeed((prev) =>
        prev.filter((item) => item.usuario._id !== usuarioId)
      );

      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error al enviar conexión");
    } finally {
      setEnviando((prev) => ({
        ...prev,
        [usuarioId]: false
      }));
    }
  };

  // Filtrar feed por intereses
  const feedFiltrado = filtroInteres
    ? feed.filter((item) =>
        item.usuario.interests.some((i) =>
          i.toLowerCase().includes(
            filtroInteres.toLowerCase()
          )
        )
      )
    : feed;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* HEADER */}
      <div className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold">
                Bienvenido, {usuario?.fullName}
              </h1>
              <p className="text-zinc-400 mt-2">
                🏫 {usuario?.institution} • 📍 {usuario?.currentCampus}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-zinc-400">
                Compatibilidad mostrada
              </p>
              <p className="text-2xl font-bold text-blue-400">
                {feedFiltrado.length}
              </p>
            </div>
          </div>

          {/* FILTRO DE INTERESES */}
          <div className="flex gap-3 items-center">
            <input
              type="text"
              placeholder="Filtrar por interés..."
              value={filtroInteres}
              onChange={(e) =>
                setFiltroInteres(e.target.value)
              }
              className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 flex-1 max-w-sm"
            />
            {filtroInteres && (
              <button
                onClick={() => setFiltroInteres("")}
                className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-lg transition"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin">
                <div className="w-12 h-12 border-4 border-zinc-700 border-t-blue-500 rounded-full" />
              </div>
              <p className="text-zinc-400 mt-4">
                Cargando usuarios compatibles...
              </p>
            </div>
          </div>
        ) : feedFiltrado.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-3xl mb-4">🔍</p>
              <p className="text-xl text-zinc-400">
                {filtroInteres
                  ? "No hay usuarios con ese interés"
                  : "No hay usuarios compatibles en tu campus"}
              </p>
              <p className="text-sm text-zinc-500 mt-2">
                Completa tu perfil para mejorar la compatibilidad
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedFiltrado.map((item) => (
              <UserCard
                key={item.usuario._id}
                usuario={item.usuario}
                compatibilidad={item.compatibilidad}
                loading={enviando[item.usuario._id]}
                onConectar={() =>
                  enviarConexion(item.usuario._id)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// COMPONENTE TARJETA DE USUARIO
function UserCard({
  usuario,
  compatibilidad,
  loading,
  onConectar
}) {
  const obtenerColorCompatibilidad = () => {
    if (compatibilidad >= 80) return "bg-green-900/30 border-green-600";
    if (compatibilidad >= 60) return "bg-blue-900/30 border-blue-600";
    if (compatibilidad >= 40) return "bg-yellow-900/30 border-yellow-600";
    return "bg-orange-900/30 border-orange-600";
  };

  const obtenerTextoCompatibilidad = () => {
    if (compatibilidad >= 80)
      return "✅ Muy compatible";
    if (compatibilidad >= 60)
      return "👍 Compatible";
    if (compatibilidad >= 40)
      return "🤔 Algo compatible";
    return "⚠️ Poco compatible";
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition group">
      {/* IMAGEN Y BADGE COMPATIBILIDAD */}
      <div className="relative h-48 bg-gradient-to-br from-blue-600 to-purple-600 overflow-hidden">
        {usuario.profilePicture ? (
          <img
            src={usuario.profilePicture}
            alt={usuario.fullName}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 text-3xl">
            👤
          </div>
        )}

        {/* BADGE COMPATIBILIDAD */}
        <div
          className={`absolute top-4 right-4 ${obtenerColorCompatibilidad()} border rounded-full px-3 py-2 font-semibold text-sm`}
        >
          {compatibilidad}%
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="p-5">
        {/* NOMBRE Y CARRERA */}
        <h3 className="text-lg font-bold text-white truncate">
          {usuario.fullName}
        </h3>

        {usuario.faculty && (
          <p className="text-sm text-blue-400 mb-3">
            📚 {usuario.faculty}
          </p>
        )}

        {usuario.career && (
          <p className="text-sm text-zinc-400 mb-2">
            {usuario.career}
            {usuario.semester && (
              <span className="ml-2 text-zinc-500">
                • Sem {usuario.semester}
              </span>
            )}
          </p>
        )}

        {/* BIO */}
        {usuario.bio && (
          <p className="text-xs text-zinc-400 mb-4 line-clamp-2">
            "{usuario.bio}"
          </p>
        )}

        {/* INTERESES */}
        {usuario.interests && usuario.interests.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-zinc-500 mb-2">
              Intereses:
            </p>
            <div className="flex flex-wrap gap-2">
              {usuario.interests.slice(0, 3).map((interes, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs bg-zinc-800 text-zinc-200 rounded-full"
                >
                  {interes}
                </span>
              ))}
              {usuario.interests.length > 3 && (
                <span className="px-2 py-1 text-xs bg-zinc-800 text-zinc-400 rounded-full">
                  +{usuario.interests.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* COMPATIBILIDAD TEXTO */}
        <p className="text-xs text-zinc-400 mb-4 font-medium">
          {obtenerTextoCompatibilidad()}
        </p>

        {/* BOTÓN CONECTAR */}
        <button
          onClick={onConectar}
          disabled={loading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
        >
          {loading ? "Enviando..." : "Enviar conexión"}
        </button>
      </div>
    </div>
  );
}

export default FeedPage;    