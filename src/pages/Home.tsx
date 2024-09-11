// src/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { Character } from "../types";
import { useAuth } from "../AuthContext";
const Home: React.FC = () => {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await api.get<Character[]>("/characters");
        setCharacters(response.data);
      } catch (err) {
        setError("Failed to fetch characters.");
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  const handleGoogleLogin = () => {
    window.open("http://localhost:3000/auth/google", "_self");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  if (loading) return <p>Loading characters...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between px-8 py-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Nevermade</h1>
        {user ? (
          <div>
            <button
              onClick={handleDashboard}
              className="border border-zinc-300 hover:bg-zinc-100 text-zinc-800 px-4 py-2 rounded-md transition-colors duration-300"
            >
              Dashboard
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={handleGoogleLogin}
              className="border border-zinc-300  hover:bg-zinc-100 text-zinc-800 px-4 py-2 rounded-md transition-colors duration-300"
            >
              Login with Google
            </button>
          </div>
        )}
      </div>
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Choose a Character
        </h1>
        {user ? (
          <div>Welcome, {user.name}!</div>
        ) : (
          <div>
            Please log in to view this page.{" "}
            <p>
              Go to <Link to="/dashboard">Dashboard</Link>
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {characters.map((character) => (
            <Link
              key={character.id}
              to={`/character/${character.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-4 text-center"
            >
              <img
                src={character.image || "https://via.placeholder.com/150"} // Placeholder if no image
                alt={character.name}
                className="w-24 h-24 mx-auto rounded-full mb-4"
              />
              <h2 className="text-xl font-semibold">{character.name}</h2>
              <p className="text-sm text-gray-600">{character.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
