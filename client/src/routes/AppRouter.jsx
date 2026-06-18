import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// ── Páginas públicas ────────────────────────────────────────────────
const LandingPage  = lazy(() => import("../pages/LandingPage"));
const LoginPage    = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));

// Auth secundarias (agrupadas en un mismo chunk — se usan juntas raramente)
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const ResetPassword  = lazy(() => import("../pages/ResetPassword"));
const AuthCallback   = lazy(() => import("../pages/AuthCallback"));

// ── Páginas de la app (cada una carga su propio chunk) ──────────────
const FeedPage                = lazy(() => import("../pages/FeedPage"));
const ProfilePage             = lazy(() => import("../pages/ProfilePage"));
const SavedPage               = lazy(() => import("../pages/SavedPage"));
const ChatPage                = lazy(() => import("../pages/ChatPage"));
const ConnectionsPage         = lazy(() => import("../pages/ConnectionsPage"));
const PendingConnectionsPage  = lazy(() => import("../pages/PendingConnectionsPage"));
const PublicProfilePage       = lazy(() => import("../pages/PublicProfilePage"));

// ── Fallback de carga ───────────────────────────────────────────────
// Se muestra mientras el chunk de la página se descarga (~100-300ms la primera vez).
// Diseñado para ser idéntico al spinner del ProtectedRoute, sin flash visual.
function PageLoader() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          border: "3px solid rgba(255,61,158,0.12)",
          borderTopColor: "#FF3D9E",
          borderRadius: "50%",
          animation: "page-spin 0.7s linear infinite",
        }}
      />
      <style>{`
        @keyframes page-spin {
          0%   { transform: rotate(0deg);   }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ── Router ──────────────────────────────────────────────────────────
function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Landing page pública */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth */}
          <Route path="/login"          element={<LoginPage />} />
          <Route path="/register"       element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/auth/callback"  element={<AuthCallback />} />

          {/* App protegida */}
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <FeedPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/connections"
            element={
              <ProtectedRoute>
                <ConnectionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/connections/pending"
            element={
              <ProtectedRoute>
                <PendingConnectionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <SavedPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id"
            element={
              <ProtectedRoute>
                <PublicProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Cualquier otra ruta */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRouter;
