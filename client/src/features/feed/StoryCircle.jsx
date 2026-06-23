import { useRef, useState } from "react";
import { Plus, ChevronDown, Eye, UploadCloud } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import PortalDropdown from "../../components/ui/PortalDropdown";
import useStoryRingState from "../../hooks/useStoryRingState";

const SIZES = {
  sm: { outer: 52, inner: 46, font: 16 },
  md: { outer: 68, inner: 62, font: 22 },
  lg: { outer: 80, inner: 74, font: 26 }
};

const GRADIENT = "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)";

const LONG_PRESS_MS = 500;

export default function StoryCircle({
  user, seen = false, onClick, size = "md", isOwn = false,
  onViewMyStory, onUploadStory,
}) {
  const { colors } = useTheme();
  const { outer, inner, font } = SIZES[size] || SIZES.md;

  const { hasActiveStory: hasStory } = useStoryRingState(user?._id, user?.hasActiveStory);
  const ringBg = hasStory
    ? seen
      ? colors.border
      : GRADIENT
    : "transparent";

  const gap = hasStory ? 3 : 0;
  const firstName = (user?.fullName || "U").split(" ")[0];
  const label = isOwn ? "Tu historia" : firstName;

  const [menuOpen, setMenuOpen] = useState(false);
  const anchorRef = useRef(null);
  const longPressTimer = useRef(null);
  const didLongPress = useRef(false);

  const clearLongPressTimer = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handlePointerDown = () => {
    if (!isOwn) return;
    didLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      setMenuOpen(true);
    }, LONG_PRESS_MS);
  };

  const handlePointerUpOrLeave = () => {
    clearLongPressTimer();
  };

  const handleClick = () => {
    if (didLongPress.current) {
      didLongPress.current = false;
      return;
    }
    onClick?.(user);
  };

  const menuItems = [
    { label: "Ver mi historia", icon: Eye, onClick: () => onViewMyStory?.(), disabled: !hasStory },
    { label: "Subir historia", icon: UploadCloud, onClick: () => onUploadStory?.() },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
      <div
        ref={anchorRef}
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(); }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUpOrLeave}
        onPointerLeave={handlePointerUpOrLeave}
        style={{ position: "relative", width: outer + gap * 2, height: outer + gap * 2, cursor: "pointer" }}
      >
        <div
          style={{
            width: outer + gap * 2, height: outer + gap * 2,
            borderRadius: "50%",
            background: ringBg,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: gap
          }}
        >
          <div
            style={{
              width: outer, height: outer, borderRadius: "50%",
              background: colors.surface,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: hasStory ? 2 : 0
            }}
          >
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.fullName}
                style={{ width: inner, height: inner, borderRadius: "50%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <div
                style={{
                  width: inner, height: inner, borderRadius: "50%",
                  background: colors.gradient || "#FF3D9E",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 700, fontSize: font
                }}
              >
                {firstName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {isOwn && !hasStory && (
          <div
            style={{
              position: "absolute", bottom: -2, right: -2,
              width: 22, height: 22, borderRadius: "50%",
              background: "#FF3D9E", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: `2px solid ${colors.surface}`, pointerEvents: "none"
            }}
          >
            <Plus size={13} />
          </div>
        )}

        {isOwn && (
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            title="Más opciones"
            style={{
              position: "absolute", top: -2, right: -2,
              width: 20, height: 20, borderRadius: "50%",
              background: colors.surfaceAlt, color: colors.textDark,
              border: `1.5px solid ${colors.surface}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", padding: 0,
            }}
          >
            <ChevronDown size={12} />
          </button>
        )}
      </div>

      <span style={{ fontSize: 11, color: colors.textMuted, maxWidth: outer + 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {label}
      </span>

      {isOwn && (
        <PortalDropdown
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          anchorRef={anchorRef}
          items={menuItems}
          align="left"
        />
      )}
    </div>
  );
}
