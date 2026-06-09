import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const NAV_ITEMS = [
{
label: "Feed",
path: "/feed",
icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
),
},
{
label: "Mi Perfil",
path: "/profile",
icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
),
},
{
label: "Conexiones",
path: "/connections",
icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
),
},
{
label: "Guardados",
path: "/saved",
icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
),
},
{
label: "Configuración",
path: "/settings",
dividerBefore: true,
icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
),
},
];

function Avatar({ src, name, size = "md" }) {
const sizeClasses = {
sm: "w-8 h-8 text-xs",
md: "w-10 h-10 text-sm",
lg: "w-14 h-14 text-lg",
};
return src ? (
<img
    src={src}
    alt={name}
    className={`${sizeClasses[size]} rounded-full object-cover border-2 border-blue-500 flex-shrink-0`}
/>
) : (
<div
    className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold border-2 border-blue-500 flex-shrink-0`}
>
    {name?.charAt(0)?.toUpperCase() || "?"}
</div>
);
}

function Navbar() {
const navigate = useNavigate();
const location = useLocation();
const { usuario, logout } = useAuthStore((state) => ({
usuario: state.usuario,
logout: state.logout,
}));
const [drawerAbierto, setDrawerAbierto] = useState(false);
const drawerRef = useRef(null);

useEffect(() => {
function handleKeyDown(e) {
    if (e.key === "Escape") setDrawerAbierto(false);
}
document.addEventListener("keydown", handleKeyDown);
return () => document.removeEventListener("keydown", handleKeyDown);
}, []);

// Bloquear scroll del body cuando el drawer está abierto
useEffect(() => {
if (drawerAbierto) {
    document.body.style.overflow = "hidden";
} else {
    document.body.style.overflow = "";
}
return () => {
    document.body.style.overflow = "";
};
}, [drawerAbierto]);

const handleLogout = () => {
logout();
navigate("/login");
};

const handleNav = (path) => {
navigate(path);
setDrawerAbierto(false);
};

const isActive = (path) => location.pathname === path;

return (
<>
    {/* NAVBAR FIJA */}
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur border-b border-zinc-800/60">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

        {/* LOGO */}
        <button
        onClick={() => handleNav("/feed")}
        className="flex items-center gap-2 group focus:outline-none"
        >
        <span className="text-xl">🤝</span>
        <span className="text-base font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hidden sm:inline">
            LinkUp
        </span>
        </button>

        {/* ÍCONOS CENTRALES — acceso rápido estilo IG */}
        <div className="flex items-center gap-1">
        {NAV_ITEMS.filter((item) => !item.dividerBefore).map((item) => (
            <button
            key={item.path}
            onClick={() => handleNav(item.path)}
            title={item.label}
            className={`p-2 rounded-lg transition-colors relative focus:outline-none ${
                isActive(item.path)
                ? "text-white"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
            }`}
            >
            {item.icon}
            {isActive(item.path) && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
            )}
            </button>
        ))}
        </div>

        {/* AVATAR — abre drawer */}
        <button
        onClick={() => setDrawerAbierto(true)}
        className="flex items-center gap-2.5 focus:outline-none group"
        aria-label="Abrir menú de usuario"
        >
        <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-white leading-tight line-clamp-1 max-w-[120px]">
            {usuario?.fullName || "Usuario"}
            </p>
            <p className="text-[10px] text-zinc-500 leading-tight line-clamp-1 max-w-[120px]">
            {usuario?.institution || ""}
            </p>
        </div>
        <div className="ring-2 ring-transparent group-hover:ring-blue-500 rounded-full transition-all duration-200">
            <Avatar src={usuario?.profilePicture} name={usuario?.fullName} size="sm" />
        </div>
        </button>
    </div>
    </nav>

    {/* OVERLAY */}
    {drawerAbierto && (
    <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={() => setDrawerAbierto(false)}
    />
    )}

    {/* DRAWER LATERAL */}
    <div
    ref={drawerRef}
    className={`fixed top-0 right-0 h-full w-72 z-50 bg-zinc-950 border-l border-zinc-800 flex flex-col transition-transform duration-300 ease-out ${
        drawerAbierto ? "translate-x-0" : "translate-x-full"
    }`}
    >
    {/* HEADER DEL DRAWER — perfil */}
    <div className="relative bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-b border-zinc-800 p-5">
        <button
        onClick={() => setDrawerAbierto(false)}
        className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition focus:outline-none"
        aria-label="Cerrar menú"
        >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-4 h-4">
            <path d="M18 6 6 18M6 6l12 12" />
        </svg>
        </button>

        <button
        onClick={() => handleNav("/profile")}
        className="flex items-center gap-3 w-full text-left group"
        >
        <Avatar src={usuario?.profilePicture} name={usuario?.fullName} size="lg" />
        <div className="min-w-0">
            <p className="font-bold text-white text-sm leading-tight truncate group-hover:text-blue-400 transition">
            {usuario?.fullName || "Usuario"}
            </p>
            <p className="text-xs text-zinc-400 truncate mt-0.5">
            {usuario?.email || ""}
            </p>
            {usuario?.institution && (
            <span className="inline-block mt-1.5 px-2 py-0.5 bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[10px] rounded-full leading-tight">
                {usuario.institution}
            </span>
            )}
        </div>
        </button>

        {/* Campus badge */}
        {usuario?.currentCampus && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="w-3.5 h-3.5 flex-shrink-0">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="truncate">{usuario.currentCampus}</span>
        </div>
        )}
    </div>

    {/* NAVEGACIÓN */}
    <nav className="flex-1 overflow-y-auto py-3">
        {NAV_ITEMS.map((item) => (
        <div key={item.path}>
            {item.dividerBefore && (
            <div className="mx-4 my-2 border-t border-zinc-800" />
            )}
            <button
            onClick={() => handleNav(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors focus:outline-none ${
                isActive(item.path)
                ? "bg-blue-500/10 text-blue-400 border-r-2 border-blue-500"
                : "text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
            }`}
            >
            <span className={isActive(item.path) ? "text-blue-400" : "text-zinc-400"}>
                {item.icon}
            </span>
            <span className="text-sm font-medium">{item.label}</span>
            {isActive(item.path) && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
            )}
            </button>
        </div>
        ))}
    </nav>

    {/* FOOTER — cerrar sesión */}
    <div className="border-t border-zinc-800 p-3">
        <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg transition text-left focus:outline-none"
        >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span className="text-sm font-medium">Cerrar sesión</span>
        </button>
    </div>
    </div>
</>
);
}

export default Navbar;