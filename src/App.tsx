// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import CharacterPage from "./pages/CharacterPage";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import { AuthProvider, useAuth } from "./AuthContext";

const ProtectedRoute: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/character/:characterId" element={<CharacterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
