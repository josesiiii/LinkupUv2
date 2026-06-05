// src/routes/AppRouter.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage    from "../pages/LandingPage";
import LoginPage      from "../pages/LoginPage";
import RegisterPage   from "../pages/RegisterPage";
import FeedPage       from "../pages/FeedPage";
import ProtectedRoute from "./ProtectedRoute";
 
function AppRouter() {x
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page pública */}
        <Route path="/"         element={<LandingPage />} />
 
        {/* Auth — movido de "/" a "/login" */}
        <Route path="/login"    element={<LoginPage />} />
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
      </Routes>
    </BrowserRouter>
  );
}
 
export default AppRouter;