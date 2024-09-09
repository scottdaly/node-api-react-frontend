import { useEffect, useState } from "react";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

interface Character {
  name: string;
  description: string;
  id: number;
  createdat: string;
  model: string;
  userid: number;
}

export default function Index() {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/characters", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("got data", data);
        setCharacters(data);
      })
      .catch((error) => console.error("Error fetching characters:", error));
  }, []);

  return (
    <div className="font-sans p-4">
      <div className="flex flex-col items-center min-h-screen">
        <h2 className="text-2xl font-bold">Welcome to the Home Page</h2>
        <p className="text-lg mt-4">
          This is the home page of our application.
        </p>
        <div className="flex flex-col items-center justify-center mt-8">
          <h3 className="text-xl font-bold">Characters</h3>
          <div className="flex gap-8 mt-4">
            {characters.map((character, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center w-64 h-48 py-4 border border-zinc-100 rounded-md shadow-md hover:cursor-pointer hover:bg-zinc-100 transition-all duration-300"
              >
                <strong>{character.name}</strong>
                {character.description}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
