import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Rooms } from "./pages/Rooms";
import { Game } from "./pages/Game";

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/game/:id" element={<Game />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/" element={<Navigate to="/rooms" replace />} />
      </Routes>
    </Router>
  );
}
