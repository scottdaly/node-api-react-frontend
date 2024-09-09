// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CharacterPage from "./pages/CharacterPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/character/:characterId" element={<CharacterPage />} />
      </Routes>
    </Router>
  );
};

export default App;
