import { useTheme } from "../../context/ThemeContext";
import useStoryRingState from "../../hooks/useStoryRingState";

export const STORY_GRADIENT =
  "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)";

// Primitivo único de avatar + anillo de historia. Fuente de verdad compartida
// (storyRingStore vía useStoryRingState): historia no vista = gradiente LinkUp,
// vista = gris, sin historia = sin anillo. Usado por PublicProfilePage,
// ProfilePage, ContactProfileModal y ProfileCard para evitar reimplementar el
// anillo en cada superficie.
export default function StoryRingAvatar({
  userId,
  name,
  src,
  size = 80,
  shape = "circle",
  fallbackHasStory = false,
  onClick,
  ringWidth = 3,
}) {
  const { colors } = useTheme();
  const { hasActiveStory, seen } = useStoryRingState(userId, fallbackHasStory);

  const radius = shape === "squircle" ? Math.round(size * 0.2) : "50%";
  const ringBg = hasActiveStory ? (seen ? colors.border : STORY_GRADIENT) : "transparent";
  const gap = hasActiveStory ? ringWidth : 0;
  const initial = (name || "U").charAt(0).toUpperCase();

  return (
    <div
      onClick={onClick}
      style={{
        width: size + gap * 2,
        height: size + gap * 2,
        borderRadius: radius,
        background: ringBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: gap,
        cursor: onClick ? "pointer" : "default",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          background: colors.surface,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: hasActiveStory ? 2 : 0,
          overflow: "hidden",
        }}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            style={{ width: "100%", height: "100%", borderRadius: radius, objectFit: "cover", display: "block" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: radius,
              background: colors.gradient || "#FF3D9E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: Math.round(size * 0.32),
            }}
          >
            {initial}
          </div>
        )}
      </div>
    </div>
  );
}
