import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2, Eye, Volume2, VolumeX, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import useAuthStore from "../../store/authStore";
import api from "../../api/axios";

const STORY_DURATION = 5000;
const HOLD_THRESHOLD = 180;

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return "ahora";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function StoryViewer({
  open,
  onClose,
  storiesFeed,
  activeAuthorIndex,
  activeStoryIndex,
  setActiveAuthorIndex,
  setActiveStoryIndex,
  onView,
  onDelete,
  ownStories = []
}) {
  const usuario = useAuthStore((s) => s.usuario);
  const navigate = useNavigate();

  const [paused, setPaused] = useState(false);
  const [persistentPause, setPersistentPause] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showViewers, setShowViewers] = useState(false);
  const [viewers, setViewers] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const effectivePaused = paused || persistentPause;

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const elapsedRef = useRef(0);
  const viewedInSession = useRef(new Set());
  const videoRef = useRef(null);
  const effectivePausedRef = useRef(effectivePaused);
  effectivePausedRef.current = effectivePaused;
  const holdTimerRef = useRef(null);
  const isHoldRef = useRef(false);

  // Determinar si estamos viendo stories propias o del feed
  const isOwnMode = storiesFeed.length === 0 && ownStories.length > 0;
  const currentGroup = isOwnMode ? null : storiesFeed[activeAuthorIndex];
  const currentStories = isOwnMode ? ownStories : currentGroup?.stories || [];
  const currentStory = currentStories[activeStoryIndex];
  const currentAuthor = isOwnMode ? usuario : currentGroup?.author;
  const isOwn = currentAuthor?._id === usuario?._id || isOwnMode;

  const totalStories = currentStories.length;

  const goNext = () => {
    if (activeStoryIndex < totalStories - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    } else if (!isOwnMode && activeAuthorIndex < storiesFeed.length - 1) {
      setActiveAuthorIndex(activeAuthorIndex + 1);
      setActiveStoryIndex(0);
    } else {
      onClose();
    }
  };

  const goPrev = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    } else if (!isOwnMode && activeAuthorIndex > 0) {
      setActiveAuthorIndex(activeAuthorIndex - 1);
      setActiveStoryIndex(0);
    }
  };

  // Marcar como vista — nunca contar al propio autor
  useEffect(() => {
    if (!open || !currentStory) return;
    const id = currentStory._id?.toString();
    if (id && !viewedInSession.current.has(id) && !isOwn) {
      viewedInSession.current.add(id);
      onView?.(id);
    }
  }, [open, currentStory?._id]);

  // Timer para imágenes — se crea una sola vez por story (no se reinicia al pausar/reanudar,
  // así el progreso se conserva correctamente; el propio tick decide si avanzar o no).
  useEffect(() => {
    if (!open || !currentStory) return;
    if (currentStory.mediaType === "video") return;

    clearInterval(timerRef.current);
    setProgress(0);
    elapsedRef.current = 0;
    startTimeRef.current = Date.now();

    const tick = () => {
      if (effectivePausedRef.current) return;
      const elapsed = elapsedRef.current + (Date.now() - startTimeRef.current);
      const pct = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(timerRef.current);
        goNext();
      }
    };

    timerRef.current = setInterval(tick, 50);
    return () => clearInterval(timerRef.current);
  }, [open, activeAuthorIndex, activeStoryIndex, currentStory?._id, currentStory?.mediaType]);

  // Pausa/reanuda — solo contabiliza el tiempo transcurrido, sin tocar el intervalo.
  useEffect(() => {
    if (effectivePaused) {
      elapsedRef.current += Date.now() - (startTimeRef.current || Date.now());
    } else {
      startTimeRef.current = Date.now();
    }
  }, [effectivePaused]);

  // Reset al cambiar story
  useEffect(() => {
    setProgress(0);
    elapsedRef.current = 0;
    setShowViewers(false);
    setConfirmDelete(false);
    setPersistentPause(false);
  }, [activeAuthorIndex, activeStoryIndex]);

  // Cargar viewers si es story propia
  useEffect(() => {
    if (!open || !isOwn || !currentStory) return;
    api.get(`/stories/${currentStory._id}/viewers`)
      .then((r) => setViewers(r.data || []))
      .catch(() => setViewers([]));
  }, [open, currentStory?._id, isOwn]);

  const clearHoldTimer = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const handlePointerDown = () => {
    isHoldRef.current = false;
    clearHoldTimer();
    holdTimerRef.current = setTimeout(() => {
      isHoldRef.current = true;
      setPaused(true);
    }, HOLD_THRESHOLD);
  };

  const handlePointerUp = () => {
    clearHoldTimer();
    if (isHoldRef.current) {
      isHoldRef.current = false;
      setPaused(false);
    } else {
      setPersistentPause((p) => !p);
    }
  };

  const handlePointerLeave = () => {
    clearHoldTimer();
    if (isHoldRef.current) {
      isHoldRef.current = false;
      setPaused(false);
    }
  };

  const handleDelete = async () => {
    if (!currentStory) return;
    try {
      await onDelete?.(currentStory._id);
      onClose();
    } catch {
      // ignorar
    }
  };

  if (!open || !currentStory) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "#000",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
        >
          {/* Contenido 9:16 */}
          <div style={{ position: "relative", height: "100vh", aspectRatio: "9/16", maxWidth: "100vw", overflow: "hidden" }}>

            {/* Media */}
            {currentStory.mediaType === "image" ? (
              <img
                src={currentStory.mediaUrl}
                alt="story"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                draggable={false}
              />
            ) : (
              <video
                ref={videoRef}
                src={currentStory.mediaUrl}
                autoPlay
                muted={muted}
                playsInline
                onEnded={goNext}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            )}

            {/* Barras de progreso */}
            <div style={{ position: "absolute", top: 8, left: 8, right: 8, display: "flex", gap: 3, zIndex: 10 }}>
              {currentStories.map((_, i) => (
                <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.35)", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 2,
                      background: "#fff",
                      width: i < activeStoryIndex ? "100%" : i === activeStoryIndex ? `${progress}%` : "0%",
                      transition: i === activeStoryIndex && currentStory.mediaType === "image" ? "none" : undefined
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Header */}
            <div style={{ position: "absolute", top: 20, left: 12, right: 12, display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 10 }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: 10, cursor: !isOwn && currentAuthor?._id ? "pointer" : "default" }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isOwn && currentAuthor?._id) {
                    onClose();
                    navigate(`/users/${currentAuthor._id}`);
                  }
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
              >
                {currentAuthor?.profilePicture ? (
                  <img src={currentAuthor.profilePicture} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "2px solid #fff" }} />
                ) : (
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#FF3D9E", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16, border: "2px solid #fff" }}>
                    {(currentAuthor?.fullName || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p style={{ margin: 0, color: "#fff", fontWeight: 600, fontSize: 14, textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
                    {currentAuthor?.fullName}
                  </p>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.75)", fontSize: 11 }}>
                    {timeAgo(currentStory.expiresAt ? new Date(currentStory.expiresAt).getTime() - 24 * 3600000 : Date.now())}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  onClick={(e) => { e.stopPropagation(); setPersistentPause((p) => !p); }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerUp={(e) => e.stopPropagation()}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 4 }}
                  title={persistentPause ? "Reanudar" : "Pausar"}
                >
                  {persistentPause ? <Play size={20} /> : <Pause size={20} />}
                </button>
                {currentStory.mediaType === "video" && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setMuted((m) => !m); }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onPointerUp={(e) => e.stopPropagation()}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 4 }}
                  >
                    {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); onClose(); }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerUp={(e) => e.stopPropagation()}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 4 }}
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Zonas de navegación — stopPropagation en pointer events para que un tap de
                navegación nunca dispare la lógica de pausa del wrapper */}
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              style={{ position: "absolute", left: 0, top: 0, width: "35%", height: "100%", background: "transparent", border: "none", cursor: "pointer", zIndex: 5 }}
            />
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              style={{ position: "absolute", right: 0, top: 0, width: "35%", height: "100%", background: "transparent", border: "none", cursor: "pointer", zIndex: 5 }}
            />

            {/* Flechas desktop */}
            {(activeStoryIndex > 0 || activeAuthorIndex > 0) && (
              <div style={{ position: "absolute", left: -48, top: "50%", transform: "translateY(-50%)", zIndex: 20 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerUp={(e) => e.stopPropagation()}
                  style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
                >
                  <ChevronLeft size={22} />
                </button>
              </div>
            )}
            {(activeStoryIndex < totalStories - 1 || (!isOwnMode && activeAuthorIndex < storiesFeed.length - 1)) && (
              <div style={{ position: "absolute", right: -48, top: "50%", transform: "translateY(-50%)", zIndex: 20 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerUp={(e) => e.stopPropagation()}
                  style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
                >
                  <ChevronRight size={22} />
                </button>
              </div>
            )}

            {/* Footer para stories propias */}
            {isOwn && (
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 16px 24px", background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)", zIndex: 10 }}>
                {!confirmDelete ? (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowViewers((v) => !v); }}
                      onPointerDown={(e) => e.stopPropagation()}
                      onPointerUp={(e) => e.stopPropagation()}
                      style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 20, padding: "8px 14px", color: "#fff", cursor: "pointer", fontSize: 13 }}
                    >
                      <Eye size={16} />
                      {currentStory.viewerCount ?? viewers.length} vistas
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
                      onPointerDown={(e) => e.stopPropagation()}
                      onPointerUp={(e) => e.stopPropagation()}
                      style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }}
                      onPointerDown={(e) => e.stopPropagation()}
                      onPointerUp={(e) => e.stopPropagation()}
                      style={{ flex: 1, padding: "10px 0", borderRadius: 12, background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", cursor: "pointer", fontWeight: 600 }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                      onPointerDown={(e) => e.stopPropagation()}
                      onPointerUp={(e) => e.stopPropagation()}
                      style={{ flex: 1, padding: "10px 0", borderRadius: 12, background: "#FF3D9E", border: "none", color: "#fff", cursor: "pointer", fontWeight: 600 }}
                    >
                      Eliminar
                    </button>
                  </div>
                )}

                {/* Lista de viewers */}
                {showViewers && viewers.length > 0 && (
                  <div style={{ marginTop: 12, background: "rgba(0,0,0,0.6)", borderRadius: 16, padding: "12px 14px", maxHeight: 180, overflowY: "auto" }}>
                    {viewers.map((v) => (
                      <div key={v._id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        {v.user?.profilePicture ? (
                          <img src={v.user.profilePicture} style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#FF3D9E", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>
                            {(v.user?.fullName || "U").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span style={{ color: "#fff", fontSize: 13, flex: 1 }}>{v.user?.fullName}</span>
                        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>{timeAgo(v.viewedAt)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
