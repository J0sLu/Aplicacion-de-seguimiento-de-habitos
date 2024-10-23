import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";  // estilo de las notis
import authStore from "./stores/AuthStore";
import authActionCreator from "./action-creators/AuthActionCreator";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
  return (
    <Router>
      <ToastContainer /> {/* contenedor de notificaciones */}
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              onLogin={authActionCreator.login}
              onSignup={authActionCreator.signup}
              authStore={authStore}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute authStore={authStore}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute authStore={authStore}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
