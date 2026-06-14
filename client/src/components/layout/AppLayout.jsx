// src/components/layout/AppLayout.jsx
import Sidebar from "./Sidebar";
import { useTheme } from "../../context/ThemeContext";

export default function AppLayout({ children }) {
  const { colors } = useTheme();

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
      <Sidebar />
      <main className="md:pl-20 pb-16 md:pb-0">{children}</main>
    </div>
  );
}
