// src/components/chat/Avatar.jsx
import { getInitials } from "./utils";

export default function Avatar({ name, src, size = 40, colors }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{
          width: size, height: size, borderRadius: "50%",
          objectFit: "cover", flexShrink: 0,
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: colors.pinkLight, color: colors.pink,
        fontSize: size * 0.4, fontWeight: 700,
      }}
    >
      {getInitials(name)}
    </div>
  );
}
