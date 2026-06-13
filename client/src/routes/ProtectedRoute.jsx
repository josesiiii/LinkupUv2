import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import { LIGHT_COLORS as COLORS } from "../styles/authTheme";

function ProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  const [checking, setChecking] = useState(!!token);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    if (!token) return;

    let active = true;

    api
      .get("/auth/me")
      .then((res) => {
        if (!active) return;
        setAuth(res.data, token);
        setValid(true);
      })
      .catch(() => {
        if (!active) return;
        logout();
        setValid(false);
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (checking) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: COLORS.bg,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            border: `3px solid ${COLORS.pinkLight}`,
            borderTopColor: COLORS.pink,
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!valid) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
