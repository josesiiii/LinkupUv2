import { useTheme } from "../../context/ThemeContext";

const SIZES = {
  sm: { outer: 52, inner: 46, font: 16 },
  md: { outer: 68, inner: 62, font: 22 },
  lg: { outer: 80, inner: 74, font: 26 }
};

const GRADIENT = "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)";

export default function StoryCircle({ user, seen = false, onClick, size = "md" }) {
  const { colors } = useTheme();
  const { outer, inner, font } = SIZES[size] || SIZES.md;

  const hasStory = user?.hasActiveStory;
  const ringBg = hasStory
    ? seen
      ? colors.border
      : GRADIENT
    : "transparent";

  const gap = hasStory ? 3 : 0;
  const firstName = (user?.fullName || "U").split(" ")[0];

  return (
    <button
      onClick={() => onClick?.(user)}
      style={{
        background: "none", border: "none", cursor: "pointer",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        flexShrink: 0, padding: 0
      }}
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
      <span style={{ fontSize: 11, color: colors.textMuted, maxWidth: outer + 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {firstName}
      </span>
    </button>
  );
}
