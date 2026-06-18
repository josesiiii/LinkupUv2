// src/components/layout/Sidebar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home, MessageCircle, Bookmark, Users, Inbox, UserCircle, ChevronUp, LayoutDashboard,
} from "lucide-react";
import Logo from "../ui/Logo";
import AccountSwitcher from "./AccountSwitcher";
import useAuthStore from "../../store/authStore";
import { useTheme } from "../../context/ThemeContext";
import api from "../../api/axios";

const BADGE_COLORS = {
  chat:     "linear-gradient(135deg, #FF3D9E 0%, #FF3D3D 100%)",
  pending:  "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)",
  default:  "linear-gradient(135deg, #FF3D9E 0%, #FF6FB5 100%)",
};

function Badge({ count, color }) {
  if (!count || count < 1) return null;
  return (
    <span style={{
      position: "absolute", top: -5, right: -5,
      minWidth: 20, height: 20,
      background: color || BADGE_COLORS.default,
      color: "#fff",
      fontSize: 11, fontWeight: 800,
      borderRadius: 999,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "0 5px",
      border: "2px solid var(--badge-border, #fff)",
      lineHeight: 1,
      boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
      zIndex: 20,
      animation: "badge-pop 0.2s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function Sidebar({ onExpandChange }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const closeMenuRef = useRef(null);
  const location = useLocation();
  const usuario = useAuthStore((state) => state.usuario);
  const { colors } = useTheme();

  const [pendingCount, setPendingCount]   = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    onExpandChange?.(isExpanded);
  }, [isExpanded]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch badges
  useEffect(() => {
    let cancelled = false;

    const fetchBadges = async () => {
      try {
        const [pendingRes, convsRes] = await Promise.all([
          api.get("/connections/pending"),
          api.get("/conversations"),
        ]);
        if (cancelled) return;

        setPendingCount((pendingRes.data || []).length);

        const convs = convsRes.data || [];
        const totalUnread = convs.reduce((acc, conv) => {
          const isA = conv.participantA?._id?.toString() === usuario?._id?.toString();
          return acc + (isA ? (conv.unreadCountA || 0) : (conv.unreadCountB || 0));
        }, 0);
        setUnreadMessages(totalUnread);
      } catch {
        // Silent — badges are non-critical
      }
    };

    fetchBadges();
    const interval = setInterval(fetchBadges, 60_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [usuario?._id]);

  useEffect(() => {
    if (!isExpanded && closeMenuRef.current) {
      closeMenuRef.current();
    }
  }, [isExpanded]);

  const isActive = (path) => location.pathname === path;

  const NAV_ITEMS = [
    { icon: Home,          label: "Inicio",      path: "/feed",                badge: 0 },
    { icon: MessageCircle, label: "Mensajes",    path: "/chat",                badge: unreadMessages,  badgeColor: BADGE_COLORS.chat },
    { icon: Bookmark,      label: "Guardados",   path: "/saved",               badge: 0 },
    { icon: Users,         label: "Conexiones",  path: "/connections",         badge: 0 },
    { icon: Inbox,         label: "Solicitudes", path: "/connections/pending", badge: pendingCount,   badgeColor: BADGE_COLORS.pending },
    ...(usuario?.role === "admin"
      ? [{ icon: LayoutDashboard, label: "Admin", path: "/admin", badge: 0 }]
      : []),
  ];

  const MOBILE_ITEMS = [
    ...NAV_ITEMS,
    { icon: UserCircle, label: "Perfil", path: "/profile", badge: 0 },
  ];

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
        onMouseLeave={() => setIsExpanded(false)}
        animate={{ width: isExpanded ? 280 : 80 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:flex fixed left-0 top-0 z-50 h-screen flex-col overflow-hidden"
        style={{
          background: colors.surface,
          borderRight: `1px solid ${colors.border}`,
          "--badge-border": colors.surface,
        }}
      >
        {/* Logo */}
        <div
          className={`flex items-center h-16 px-5 overflow-hidden ${isExpanded ? "justify-start gap-3" : "justify-center"}`}
          style={{ borderBottom: `1px solid ${colors.border}` }}
        >
          <Logo size={32} showText={isExpanded} textColor={colors.textDark} textSize="1.1rem" />
        </div>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col gap-3 py-4 px-3 overflow-hidden">
          {NAV_ITEMS.map(({ icon: Icon, label, path, badge, badgeColor }) => {
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
                <span className="relative flex-shrink-0 z-10" style={{ overflow: "visible" }}>
                  <Icon className="h-5 w-5" />
                  {!isExpanded && <Badge count={badge} color={badgeColor} />}
                </span>
                <span
                  className={`text-sm whitespace-nowrap relative z-10 transition-opacity duration-300 ${
                    isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                  }`}
                >
                  {label}
                </span>
                {isExpanded && badge > 0 && (
                  <span style={{
                    marginLeft: "auto",
                    minWidth: 20, height: 20,
                    background: badgeColor || BADGE_COLORS.default,
                    color: "#fff",
                    fontSize: 11, fontWeight: 800,
                    borderRadius: 999,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "0 6px",
                    flexShrink: 0,
                    zIndex: 10,
                  }}>
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
                {!isExpanded && (
                  <span
                    className="absolute left-full ml-2 px-2 py-1 text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
                    style={tooltipStyle}
                  >
                    {label}{badge > 0 ? ` (${badge})` : ""}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="relative py-3 px-3" style={{ borderTop: `1px solid ${colors.border}` }}>
          <AccountSwitcher
            includeExtras
            isExpanded={isExpanded}
            onCollapseRef={closeMenuRef}
            align="left"
            panelStyle={
              isExpanded
                ? { position: "absolute", bottom: "100%", left: 12, right: 12, marginBottom: 8, width: "auto" }
                : { position: "absolute", bottom: "100%", left: 0, marginBottom: 8, minWidth: 220 }
            }
            trigger={({ open, toggle }) => (
              <button
                onClick={toggle}
                className={`flex items-center gap-3 w-full rounded-xl px-2 py-2 ${isExpanded ? "" : "justify-center"}`}
                style={{ background: open ? colors.pinkLight : "transparent", border: "none", cursor: "pointer" }}
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
                    style={{ color: colors.textMuted, transform: open ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 200ms" }}
                  />
                )}
              </button>
            )}
          />
        </div>
      </motion.aside>

      {/* Mobile Bottom Nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden h-16"
        style={{
          background: colors.surface,
          borderTop: `1px solid ${colors.border}`,
          "--badge-border": colors.surface,
        }}
      >
        {MOBILE_ITEMS.map(({ icon: Icon, label, path, badge, badgeColor }) => {
          const active = isActive(path);
          return (
            <Link
              key={path}
              to={path}
              className="flex-1 flex flex-col items-center justify-center gap-0.5"
              style={{ color: active ? colors.pink : colors.textMuted }}
            >
              <span className="relative" style={{ overflow: "visible" }}>
                <Icon className="h-5 w-5" />
                <Badge count={badge} color={badgeColor} />
              </span>
              <span className="text-[10px]">{label}</span>
            </Link>
          );
        })}
      </nav>

      <style>{`
        @keyframes badge-pop {
          0%   { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </>
  );
}
