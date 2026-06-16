// src/components/chat/Avatar.jsx
import { getInitials } from "./utils";

const STORY_GRADIENT = "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)";

export default function Avatar({ name, src, size = 40, colors, online = false, showStatus = false, hasStory = false, onStoryClick }) {
  const statusDotColor = online ? "#2ecc71" : "#9a9a9a";
  const ringPad = hasStory ? 3 : 0;
  const imgSize = hasStory ? size - ringPad * 2 - 4 : size;

  const handleClick = (e) => {
    if (hasStory && onStoryClick) {
      e.stopPropagation();
      onStoryClick();
    }
  };

  return (
    <div
      style={{ position: "relative", flexShrink: 0, width: size, height: size }}
      onClick={hasStory && onStoryClick ? handleClick : undefined}
      title={hasStory ? "Ver historia" : undefined}
    >
      {/* Story ring */}
      {hasStory ? (
        <div style={{
          width: size, height: size, borderRadius: "50%",
          background: STORY_GRADIENT, padding: ringPad,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: onStoryClick ? "pointer" : "default",
        }}>
          <div style={{
            width: "100%", height: "100%", borderRadius: "50%",
            background: colors.surface, padding: 2,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {src ? (
              <img src={src} alt={name} style={{ width: imgSize, height: imgSize, borderRadius: "50%", objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ width: imgSize, height: imgSize, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: colors.pinkLight, color: colors.pink, fontSize: imgSize * 0.4, fontWeight: 700 }}>
                {getInitials(name)}
              </div>
            )}
          </div>
        </div>
      ) : (
        src ? (
          <img src={src} alt={name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{ width: size, height: size, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: colors.pinkLight, color: colors.pink, fontSize: size * 0.4, fontWeight: 700 }}>
            {getInitials(name)}
          </div>
        )
      )}

      {showStatus && (
        <span style={{
          position: "absolute", bottom: -1, right: -1,
          width: Math.max(10, size * 0.26), height: Math.max(10, size * 0.26),
          borderRadius: "50%", background: statusDotColor,
          border: `2px solid ${colors.surface}`,
        }} />
      )}
    </div>
  );
}
