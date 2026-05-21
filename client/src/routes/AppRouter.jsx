import {

  BrowserRouter,

  Routes,

  Route

} from "react-router-dom";

import LoginPage from "../pages/LoginPage";

import RegisterPage from "../pages/RegisterPage";

import FeedPage from "../pages/FeedPage";

import ProtectedRoute from "./ProtectedRoute";

function AppRouter() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

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