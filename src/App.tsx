import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Rooms } from "./pages/Rooms";
import { Game } from "./pages/Game";
import { Registration } from "./pages/Registration";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Header } from "./shared/header/Header";
import { Footer } from "./shared/footer/Footer"
import { useUserStore } from "./entities/User/model/useUserStore";
import { useEffect } from "react";

export function App() {
  const userStore = useUserStore();

  useEffect(() => {
    userStore.auth();
  }, []);

  return (
    <Router>
      <div className="gridContainer">
        <Header />
        <Routes>
          <Route path="/home" element={<><Home /><Footer /></>} />
          <Route path="/game/:id" element={<Game />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
