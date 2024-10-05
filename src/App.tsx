// src/App.tsx
import React, { useState, useEffect } from "react";
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
import Modal from "./components/Modal";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

const ProtectedRoute: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const { user, authLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      setLoading(false);
    }
  }, [authLoading]);

  if (authLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (!loading && !user) return <Navigate to="/login" />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Home openLoginModal={() => setIsLoginModalOpen(true)} />}
          />
          <Route path="/character/:characterId" element={<CharacterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Modal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        >
          <LoginForm
            onClose={() => setIsLoginModalOpen(false)}
            openRegisterModal={() => {
              setIsLoginModalOpen(false);
              setIsRegisterModalOpen(true);
            }}
          />
        </Modal>
        <Modal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
        >
          <RegisterForm
            onClose={() => setIsRegisterModalOpen(false)}
            openLoginModal={() => {
              setIsRegisterModalOpen(false);
              setIsLoginModalOpen(true);
            }}
          />
        </Modal>
      </Router>
    </AuthProvider>
  );
};

export default App;
