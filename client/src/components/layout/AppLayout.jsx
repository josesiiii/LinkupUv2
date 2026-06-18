// src/components/layout/AppLayout.jsx
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useTheme } from "../../context/ThemeContext";

export default function AppLayout({ children }) {
  const { colors } = useTheme();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" && window.innerWidth >= 768
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: colors.bg,
        color: colors.textDark,
        fontFamily: "'Inter', sans-serif",
        transition: "background 200ms ease, color 200ms ease",
      }}
    >
      <Sidebar onExpandChange={setSidebarExpanded} />
      <main
        className="pb-16 md:pb-0"
        style={{
          paddingLeft: isDesktop ? (sidebarExpanded ? 280 : 80) : 0,
          transition: "padding-left 300ms ease",
        }}
      >
        {children}
      </main>
    </div>
  );
}
