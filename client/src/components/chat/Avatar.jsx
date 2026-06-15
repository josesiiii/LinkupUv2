// src/components/chat/Avatar.jsx
import { getInitials } from "./utils";

export default function Avatar({ name, src, size = 40, colors, online = false, showStatus = false }) {
  const statusDotColor = online ? "#2ecc71" : "#9a9a9a";

  return (
    <div style={{ position: "relative", flexShrink: 0, width: size, height: size }}>
      {src ? (
        <img
          src={src}
          alt={name}
          style={{
            width: size, height: size, borderRadius: "50%",
            objectFit: "cover", display: "block",
          }}
        />
      ) : (
        <div
          style={{
            width: size, height: size, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: colors.pinkLight, color: colors.pink,
            fontSize: size * 0.4, fontWeight: 700,
          }}
        >
          {getInitials(name)}
        </div>
      )}

      {showStatus && (
        <span
          style={{
            position: "absolute",
            bottom: -1,
            right: -1,
            width: Math.max(10, size * 0.26),
            height: Math.max(10, size * 0.26),
            borderRadius: "50%",
            background: statusDotColor,
            border: `2px solid ${colors.surface}`,
          }}
        />
      )}
    </div>
  );
}
