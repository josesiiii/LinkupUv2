// src/components/layout/AccountSwitcher.jsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, LogOut, Sun, Moon, Plus, Check } from "lucide-react";
import Dropdown from "../ui/Dropdown";
import useAuthStore from "../../store/authStore";
import { useTheme } from "../../context/ThemeContext";

export default function AccountSwitcher({ trigger, includeExtras = false, panelStyle, align = "left", isExpanded = true, onCollapseRef }) {
  const navigate = useNavigate();
  const usuario = useAuthStore((state) => state.usuario);
  const accounts = useAuthStore((state) => state.accounts);
  const switchAccount = useAuthStore((state) => state.switchAccount);
  const removeAccount = useAuthStore((state) => state.removeAccount);
  const { theme, toggleTheme, colors } = useTheme();
  const closeFnRef = useRef(null);

  useEffect(() => {
    if (onCollapseRef) {
      onCollapseRef.current = () => closeFnRef.current?.();
    }
  }, [onCollapseRef]);

  const handleSwitchAccount = (userId) => {
    if (userId === usuario?._id) return;
    switchAccount(userId);
    navigate("/feed");
  };

  const handleLogout = () => {
    if (usuario?._id) removeAccount(usuario._id);
    navigate("/login");
  };

  const items = [
    ...accounts.map((acc) => ({
      render: ({ close }) => (
        <button
          key={acc.usuario._id}
          onClick={() => { handleSwitchAccount(acc.usuario._id); close(); }}
          className="flex items-center gap-3 px-3 py-2.5 text-sm w-full text-left"
          style={{ color: colors.textDark, background: "transparent", border: "none", cursor: "pointer" }}
          title={!isExpanded ? acc.usuario.fullName : undefined}
        >
          {acc.usuario.profilePicture ? (
            <img src={acc.usuario.profilePicture} alt={acc.usuario.fullName} className="h-7 w-7 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ background: colors.pinkLight, color: colors.pink }}>
              {(acc.usuario.fullName || "U").charAt(0).toUpperCase()}
            </div>
          )}
          {isExpanded && <span className="flex-1 truncate">{acc.usuario.fullName}</span>}
          {isExpanded && acc.usuario._id === usuario?._id && <Check className="h-4 w-4 flex-shrink-0" style={{ color: colors.pink }} />}
          {!isExpanded && acc.usuario._id === usuario?._id && (
            <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: colors.pink }} />
          )}
        </button>
      ),
    })),
    {
      icon: Plus,
      label: "Agregar cuenta",
      onClick: () => navigate("/login?addAccount=1"),
    },
    ...(includeExtras
      ? [
          { render: () => <div style={{ borderTop: `1px solid ${colors.border}` }} /> },
          { icon: UserCircle, label: "Mi Perfil", onClick: () => navigate("/profile") },
          {
            icon: theme === "dark" ? Sun : Moon,
            label: theme === "dark" ? "Modo claro" : "Modo oscuro",
            onClick: toggleTheme,
          },
          { icon: LogOut, label: "Cerrar sesión", danger: true, onClick: handleLogout },
        ]
      : []),
  ];

  return (
    <Dropdown
      align={align}
      items={items}
      panelStyle={panelStyle}
      trigger={(renderProps) => {
        closeFnRef.current = renderProps.close;
        return trigger(renderProps);
      }}
    />
  );
}
