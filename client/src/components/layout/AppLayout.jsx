// src/components/layout/AppLayout.jsx
import Navbar from "../ui/Navbar";
import { COLORS } from "../../styles/authTheme";

export default function AppLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: `linear-gradient(150deg, ${COLORS.cream} 0%, ${COLORS.blush} 55%, #ffe4f2 100%)`,
        fontFamily: "'DM Sans', 'Inter', sans-serif",
      }}
    >
      <Navbar />
      <main style={{ paddingTop: 96 }}>{children}</main>
    </div>
  );
}
