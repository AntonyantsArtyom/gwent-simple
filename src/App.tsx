import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Rooms } from "./pages/Rooms";
import { Game } from "./pages/Game";
import { Registration } from "./pages/Registration";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/game/:id" element={<Game />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/rooms" replace />} />
      </Routes>
    </Router>
  );
}
