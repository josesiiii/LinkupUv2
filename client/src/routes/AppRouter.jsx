import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage    from "../pages/LandingPage";
import LoginPage      from "../pages/LoginPage";
import RegisterPage   from "../pages/RegisterPage";
import FeedPage       from "../pages/FeedPage";
import ProfilePage    from "../pages/ProfilePage";
import SavedPage      from "../pages/SavedPage";
import ChatPage       from "../pages/ChatPage";
import ConnectionsPage from "../pages/ConnectionsPage";
import ProtectedRoute from "./ProtectedRoute";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page pública */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

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

        {/* Cualquier otra ruta */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
