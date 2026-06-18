import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function AdminRoute({ children }) {
  const { usuario, token } = useAuthStore();
  if (!token || !usuario) return <Navigate to="/login" replace />;
  if (usuario.role !== "admin") return <Navigate to="/feed" replace />;
  return children;
}
