// src/components/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Character } from "../types";
import api from "../api";

const Dashboard: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) return <div>Loading...</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
          <button
            onClick={handleLogout}
            className="border border-zinc-300 hover:bg-zinc-100 text-zinc-800 px-4 py-2 rounded-md transition-colors duration-300"
          >
            Logout
          </button>
        </div>

        <p>Email: {user.email}</p>
        <p>Username: {user.username}</p>
      </div>
      <h2 className="text-xl font-bold mb-4">Your Characters</h2>
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
  );
};

export default Dashboard;
