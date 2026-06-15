// src/components/profile/ProfileCard.jsx

export default function ProfileCard({ user, colors, theme, footer }) {
  return (
    <div
      style={{
        ...(theme === "dark"
          ? { background: colors.surface }
          : { background: "rgba(255,255,255,0.5)" }),
        border: `1px solid ${colors.border}`,
        borderRadius: 24, padding: 20,
        boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        textAlign: "center",
        transition: "transform 150ms, box-shadow 150ms",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 10px rgba(0,0,0,0.05)";
      }}
    >
      {user?.profilePicture ? (
        <img
          src={user.profilePicture}
          alt={user?.fullName}
          style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: `2px solid ${colors.border}` }}
        />
      ) : (
        <div
          style={{
            width: 72, height: 72, borderRadius: "50%", background: colors.gradient,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 26,
          }}
        >
          {user?.fullName?.charAt(0)?.toUpperCase() || "?"}
        </div>
      )}

      <div style={{ minWidth: 0, width: "100%" }}>
        <p style={{ margin: "0 0 2px 0", fontSize: 15, fontWeight: 700, color: colors.textDark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {user?.fullName || "Usuario"}
        </p>
        {user?.bio && (
          <p style={{
            margin: 0, fontSize: 13, color: colors.textMuted, lineHeight: 1.4,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {user.bio}
          </p>
        )}
      </div>

      {user?.interests?.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
          {user.interests.slice(0, 3).map((interest) => (
            <span key={interest} style={{ fontSize: 11, fontWeight: 500, color: colors.textDark, background: colors.pinkLight, padding: "4px 10px", borderRadius: 100 }}>
              {interest}
            </span>
          ))}
        </div>
      )}

      {footer && <div style={{ width: "100%", marginTop: 4 }}>{footer}</div>}
    </div>
  );
}
