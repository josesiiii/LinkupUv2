// src/components/layout/Sidebar.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home, MessageCircle, Bookmark, Users, UserCircle, LogOut, Sun, Moon,
} from "lucide-react";
import Logo from "../ui/Logo";
import useAuthStore from "../../store/authStore";
import { useTheme } from "../../context/ThemeContext";

const NAV_ITEMS = [
  { icon: Home,          label: "Inicio",     path: "/feed" },
  { icon: MessageCircle, label: "Mensajes",   path: "/chat" },
  { icon: Bookmark,      label: "Guardados",  path: "/saved" },
  { icon: Users,         label: "Conexiones", path: "/connections" },
];

const MOBILE_ITEMS = [
  ...NAV_ITEMS,
  { icon: UserCircle, label: "Perfil", path: "/profile" },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { theme, toggleTheme, colors } = useTheme();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const itemStyle = (active) => ({
    background: active ? colors.pinkLight : "transparent",
    color: active ? colors.pink : colors.textMuted,
    fontWeight: active ? 600 : 500,
  });

  const itemHover = (active) => ({
    onMouseEnter: (e) => {
      if (!active) {
        e.currentTarget.style.background = colors.pinkLight;
        e.currentTarget.style.color = colors.pink;
      }
    },
    onMouseLeave: (e) => {
      if (!active) {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = colors.textMuted;
      }
    },
  });

  const tooltipStyle = {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    color: colors.textDark,
  };

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`hidden md:flex fixed left-0 top-0 z-50 h-screen flex-col transition-all duration-300 ease-in-out ${
          isExpanded ? "w-56 shadow-xl" : "w-16"
        }`}
        style={{ background: colors.surface, borderRight: `1px solid ${colors.border}`, transition: "background 200ms ease, border-color 200ms ease" }}
      >
        {/* Logo */}
        <div
          className={`flex items-center h-16 px-4 overflow-hidden ${
            isExpanded ? "justify-start gap-3" : "justify-center"
          }`}
          style={{ borderBottom: `1px solid ${colors.border}` }}
        >
          <Logo size={28} showText={isExpanded} textColor={colors.textDark} textSize="1rem" />
        </div>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col gap-1 py-4 px-2 overflow-hidden">
          {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                  isExpanded ? "" : "justify-center"
                }`}
                style={itemStyle(active)}
                {...itemHover(active)}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span
                  className={`text-sm whitespace-nowrap transition-all duration-300 ${
                    isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                  }`}
                >
                  {label}
                </span>
                {!isExpanded && (
                  <span
                    className="absolute left-full ml-2 px-2 py-1 text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
                    style={tooltipStyle}
                  >
                    {label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom items */}
        <div className="flex flex-col gap-1 py-4 px-2" style={{ borderTop: `1px solid ${colors.border}` }}>
          {(() => {
            const active = isActive("/profile");
            return (
              <Link
                to="/profile"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                  isExpanded ? "" : "justify-center"
                }`}
                style={itemStyle(active)}
                {...itemHover(active)}
              >
                <UserCircle className="h-5 w-5 flex-shrink-0" />
                <span
                  className={`text-sm whitespace-nowrap transition-all duration-300 ${
                    isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                  }`}
                >
                  Mi Perfil
                </span>
                {!isExpanded && (
                  <span
                    className="absolute left-full ml-2 px-2 py-1 text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
                    style={tooltipStyle}
                  >
                    Mi Perfil
                  </span>
                )}
              </Link>
            );
          })()}

          {/* Toggle de tema */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all duration-200 group relative ${
              isExpanded ? "" : "justify-center"
            }`}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: colors.textMuted }}
            onMouseEnter={(e) => { e.currentTarget.style.background = colors.pinkLight; e.currentTarget.style.color = colors.pink; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = colors.textMuted; }}
          >
            {theme === "dark" ? <Sun className="h-5 w-5 flex-shrink-0" /> : <Moon className="h-5 w-5 flex-shrink-0" />}
            <span
              className={`text-sm whitespace-nowrap transition-all duration-300 ${
                isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
              }`}
            >
              {theme === "dark" ? "Modo claro" : "Modo oscuro"}
            </span>
            {!isExpanded && (
              <span
                className="absolute left-full ml-2 px-2 py-1 text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
                style={tooltipStyle}
              >
                {theme === "dark" ? "Modo claro" : "Modo oscuro"}
              </span>
            )}
          </button>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all duration-200 group relative ${
              isExpanded ? "" : "justify-center"
            }`}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#e0556f" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(224,85,111,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span
              className={`text-sm whitespace-nowrap transition-all duration-300 ${
                isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
              }`}
            >
              Cerrar sesión
            </span>
            {!isExpanded && (
              <span
                className="absolute left-full ml-2 px-2 py-1 text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
                style={tooltipStyle}
              >
                Cerrar sesión
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Nav ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden h-16"
        style={{ background: colors.surface, borderTop: `1px solid ${colors.border}` }}
      >
        {MOBILE_ITEMS.map(({ icon: Icon, label, path }) => {
          const active = isActive(path);
          return (
            <Link
              key={path}
              to={path}
              className="flex-1 flex flex-col items-center justify-center gap-0.5"
              style={{ color: active ? colors.pink : colors.textMuted }}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px]">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
