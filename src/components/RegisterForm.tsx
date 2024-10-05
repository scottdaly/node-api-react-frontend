import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

interface RegisterFormProps {
  onClose: () => void;
  openLoginModal: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onClose,
  openLoginModal,
}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(username, email, password, name);
      onClose();
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  const handleGoogleSignUp = () => {
    window.open("http://localhost:3000/auth/google", "_self");
  };

  return (
    <div>
      <h2 className="text-4xl mb-4">Create your account</h2>
      <p className="my-2 text-zinc-500">
        Already have an account?
        <button
          onClick={openLoginModal}
          className="text-zinc-900 hover:text-blue-500 ml-2"
        >
          Sign in
        </button>
      </p>
      <div className="mt-10">
        <button
          onClick={handleGoogleSignUp}
          className="w-full bg-white text-gray-700 p-2 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center gap-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 0 24 24"
            width="20"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Sign up with Google
        </button>
      </div>
      <div className="flex items-center justify-center my-8">
        <div className="flex-1 h-[1px] bg-gray-300"></div>
        <p className="mx-4 text-gray-500">or</p>
        <div className="flex-1 h-[1px] bg-gray-300"></div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-zinc-800 text-white p-2 rounded-lg hover:bg-zinc-700 mb-2"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
