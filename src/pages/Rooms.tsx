import "./styles.css";
import { useEffect, useState } from "react";
import bottom from "../assets/bottom.png";
import line from "../assets/line.png";
import roomsImage from "../assets/rooms.png";
import { useNavigate } from "react-router-dom";
import { getAllRooms, type Room } from "../api/roomApi";

export const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllRooms()
      .then((data) => {
        setRooms(data.rooms);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load rooms:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="roomsPageContainer">Loading...</div>;
  }

  return (
    <div className="roomsPageContainer">
      <img className="roomsImage" src={roomsImage} />
      <div className="rooms">
        {rooms.map((room) => (
          <button key={room.id} onClick={() => navigate(`/game/${room.id}?side=player1`)} className="roomButton">
            Комната {room.id + 1}
          </button>
        ))}
      </div>
      <img className="line" src={line} />
      <img className="bottomImage" src={bottom} />
    </div>
  );
};
