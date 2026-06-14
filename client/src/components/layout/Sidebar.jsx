// src/components/layout/Sidebar.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home, MessageCircle, Bookmark, Users, Inbox, UserCircle, LogOut, Sun, Moon, ChevronUp,
} from "lucide-react";
import Logo from "../ui/Logo";
import useAuthStore from "../../store/authStore";
import { useTheme } from "../../context/ThemeContext";

const NAV_ITEMS = [
  { icon: Home,          label: "Inicio",      path: "/feed" },
  { icon: MessageCircle, label: "Mensajes",    path: "/chat" },
  { icon: Bookmark,      label: "Guardados",   path: "/saved" },
  { icon: Users,         label: "Conexiones",  path: "/connections" },
  { icon: Inbox,         label: "Solicitudes", path: "/connections/pending" },
];

const MOBILE_ITEMS = [
  ...NAV_ITEMS,
  { icon: UserCircle, label: "Perfil", path: "/profile" },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const usuario = useAuthStore((state) => state.usuario);
  const logout = useAuthStore((state) => state.logout);
  const { theme, toggleTheme, colors } = useTheme();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const itemStyle = (active) => ({
    color: active ? colors.pink : colors.textMuted,
    fontWeight: active ? 600 : 500,
  });

  const itemHover = (active) => ({
    onMouseEnter: (e) => { if (!active) e.currentTarget.style.color = colors.pink; },
    onMouseLeave: (e) => { if (!active) e.currentTarget.style.color = colors.textMuted; },
  });

  const tooltipStyle = {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    color: colors.textDark,
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => { setIsExpanded(false); setShowMenu(false); }}
        animate={{ width: isExpanded ? 280 : 80 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:flex fixed left-0 top-0 z-50 h-screen flex-col overflow-hidden"
        style={{ background: colors.surface, borderRight: `1px solid ${colors.border}` }}
      >
        {/* Logo */}
        <div
          className={`flex items-center h-16 px-5 overflow-hidden ${isExpanded ? "justify-start gap-3" : "justify-center"}`}
          style={{ borderBottom: `1px solid ${colors.border}` }}
        >
          <Logo size={32} showText={isExpanded} textColor={colors.textDark} textSize="1.1rem" />
        </div>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col gap-1 py-4 px-3 overflow-hidden">
          {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl group ${isExpanded ? "" : "justify-center"}`}
                style={itemStyle(active)}
                {...itemHover(active)}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: colors.pinkLight, borderLeft: `3px solid ${colors.pink}` }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon className="h-5 w-5 flex-shrink-0 relative z-10" />
                <span
                  className={`text-sm whitespace-nowrap relative z-10 transition-opacity duration-300 ${
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

        {/* Footer: avatar + nombre + dropdown */}
        <div className="relative py-3 px-3" style={{ borderTop: `1px solid ${colors.border}` }}>
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-3 right-3 mb-2 rounded-xl overflow-hidden shadow-xl"
                style={{ background: colors.surface, border: `1px solid ${colors.border}` }}
              >
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm"
                  style={{ color: colors.textDark }}
                  onClick={() => setShowMenu(false)}
                >
                  <UserCircle className="h-4 w-4" /> Mi Perfil
                </Link>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm w-full text-left"
                  style={{ color: colors.textDark, background: "transparent", border: "none", cursor: "pointer" }}
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {theme === "dark" ? "Modo claro" : "Modo oscuro"}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm w-full text-left"
                  style={{ color: "#e0556f", background: "transparent", border: "none", cursor: "pointer" }}
                >
                  <LogOut className="h-4 w-4" /> Cerrar sesión
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setShowMenu((v) => !v)}
            className={`flex items-center gap-3 w-full rounded-xl px-2 py-2 ${isExpanded ? "" : "justify-center"}`}
            style={{ background: showMenu ? colors.pinkLight : "transparent", border: "none", cursor: "pointer" }}
          >
            {usuario?.profilePicture ? (
              <img
                src={usuario.profilePicture}
                alt={usuario.fullName}
                className="h-9 w-9 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div
                className="h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                style={{ background: colors.pinkLight, color: colors.pink }}
              >
                {(usuario?.fullName || "U").charAt(0).toUpperCase()}
              </div>
            )}
            {isExpanded && (
              <div className="flex-1 text-left overflow-hidden">
                <p className="text-sm font-semibold truncate" style={{ color: colors.textDark }}>
                  {usuario?.fullName || "Usuario"}
                </p>
                <p className="text-xs truncate" style={{ color: colors.textMuted }}>Ver opciones</p>
              </div>
            )}
            {isExpanded && (
              <ChevronUp
                className="h-4 w-4 flex-shrink-0"
                style={{ color: colors.textMuted, transform: showMenu ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 200ms" }}
              />
            )}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Bottom Nav */}
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
