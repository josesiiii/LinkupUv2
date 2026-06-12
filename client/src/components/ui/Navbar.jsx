// src/components/ui/Navbar.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, MessageCircle, Bookmark, Users, LogOut, ChevronDown, Menu, X } from "lucide-react";
import Logo from "./Logo";
import useAuthStore from "../../store/authStore";
import { COLORS } from "../../styles/authTheme";

const NAV_ITEMS = [
  { label: "Feed", path: "/feed", icon: Home },
  { label: "Chats", path: "/chat", icon: MessageCircle },
  { label: "Guardados", path: "/saved", icon: Bookmark },
  { label: "Amigos", path: "/connections", icon: Users },
];

function Avatar({ src, name, size = 36 }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name || "Usuario"}
        style={{
          width: size, height: size, borderRadius: "50%",
          objectFit: "cover", flexShrink: 0,
          border: `1.5px solid ${COLORS.border}`,
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: COLORS.gradient,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: COLORS.textDark, fontWeight: 700, fontSize: size * 0.42,
        flexShrink: 0,
      }}
    >
      {name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const usuario = useAuthStore((state) => state.usuario);
  const logout = useAuthStore((state) => state.logout);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    function handleKey(e) {
      if (e.key === "Escape") setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: scrolled ? "12px" : "20px",
          left: "50%",
          transform: "translateX(-50%)",
          width: scrolled ? "calc(100% - 32px)" : "calc(100% - 48px)",
          maxWidth: "1100px",
          zIndex: 100,
          transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
          background: scrolled ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.5)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: `1px solid ${COLORS.border}`,
          borderRadius: scrolled ? 20 : 24,
          boxShadow: scrolled
            ? "0 8px 32px rgba(60,47,65,0.1), 0 1px 0 rgba(255,255,255,0.6) inset"
            : "0 4px 20px rgba(241,173,194,0.15)",
          padding: scrolled ? "10px 20px" : "12px 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>

          {/* Logo */}
          <button
            onClick={() => handleNav("/feed")}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}
          >
            <Logo size={28} />
          </button>

          {/* Links — desktop */}
          <div className="nav-links-desktop" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
              <button
                key={path}
                onClick={() => handleNav(path)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 100,
                  fontSize: "0.875rem", fontWeight: 500,
                  color: isActive(path) ? COLORS.textDark : COLORS.textMuted,
                  background: isActive(path) ? COLORS.pinkLight : "transparent",
                  border: "none", cursor: "pointer", transition: "all 180ms ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive(path)) {
                    e.currentTarget.style.background = COLORS.pinkLight;
                    e.currentTarget.style.color = COLORS.textDark;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(path)) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = COLORS.textMuted;
                  }
                }}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          {/* Avatar + hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                aria-label="Abrir menú de usuario"
                style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                <Avatar src={usuario?.profilePicture} name={usuario?.fullName} />
                <ChevronDown
                  size={14}
                  color={COLORS.textMuted}
                  style={{ transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "transform 180ms" }}
                />
              </button>

              {dropdownOpen && (
                <div
                  style={{
                    position: "absolute", top: "calc(100% + 12px)", right: 0,
                    width: 240, background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(20px)", border: `1px solid ${COLORS.border}`,
                    borderRadius: 18, boxShadow: "0 12px 36px rgba(60,47,65,0.15)",
                    padding: 16, zIndex: 200,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: usuario?.institution ? 10 : 12 }}>
                    <Avatar src={usuario?.profilePicture} name={usuario?.fullName} size={44} />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: COLORS.textDark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {usuario?.fullName || "Usuario"}
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: COLORS.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {usuario?.email || ""}
                      </p>
                    </div>
                  </div>

                  {usuario?.institution && (
                    <p style={{ margin: "0 0 12px 0", fontSize: 11, fontWeight: 600, color: COLORS.textMid, padding: "4px 10px", background: COLORS.pinkLight, borderRadius: 100, display: "inline-block" }}>
                      {usuario.institution}
                    </p>
                  )}

                  <div style={{ borderTop: `1px solid ${COLORS.border}`, margin: "0 0 8px 0" }} />

                  <button
                    onClick={() => handleNav("/profile")}
                    style={{ width: "100%", textAlign: "left", padding: "9px 10px", borderRadius: 10, border: "none", background: "transparent", fontSize: 13, fontWeight: 500, color: COLORS.textDark, cursor: "pointer", transition: "background 150ms" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.pinkLight)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    Mi perfil
                  </button>

                  <button
                    onClick={handleLogout}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, textAlign: "left", padding: "9px 10px", borderRadius: 10, border: "none", background: "transparent", fontSize: 13, fontWeight: 600, color: "#e0556f", cursor: "pointer", marginTop: 2, transition: "background 150ms" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(224,85,111,0.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <LogOut size={15} /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="nav-hamburger"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Abrir navegación"
              style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 4, color: COLORS.textDark }}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", gap: 2 }}>
            {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
              <button
                key={path}
                onClick={() => handleNav(path)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 12,
                  fontSize: "0.95rem", fontWeight: 500,
                  color: isActive(path) ? COLORS.textDark : COLORS.textMid,
                  background: isActive(path) ? COLORS.pinkLight : "transparent",
                  border: "none", textAlign: "left", cursor: "pointer", transition: "background 150ms",
                }}
                onMouseEnter={(e) => { if (!isActive(path)) e.currentTarget.style.background = COLORS.pinkLight; }}
                onMouseLeave={(e) => { if (!isActive(path)) e.currentTarget.style.background = "transparent"; }}
              >
                <Icon size={17} />
                {label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 720px) {
          .nav-links-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
