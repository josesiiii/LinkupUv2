import { useEffect } from "react";
import useStoryRingStore from "../store/storyRingStore";

// Lee el estado compartido de anillo de historia para un usuario, y dispara
// un fetch perezoso si aún no se cargó esta sesión pero se sabe que tiene
// historia activa (vía un valor de respaldo, ej. user.hasActiveStory).
export default function useStoryRingState(userId, fallbackHasStory) {
  const ring = useStoryRingStore((s) => (userId ? s.rings[userId] : undefined));
  const ensureLoaded = useStoryRingStore((s) => s.ensureLoaded);

  useEffect(() => {
    if (!userId) return;
    if (!ring && fallbackHasStory) ensureLoaded(userId);
  }, [userId, ring, fallbackHasStory, ensureLoaded]);

  return {
    hasActiveStory: ring?.hasActiveStory ?? !!fallbackHasStory,
    seen: ring?.seen ?? false,
  };
}
