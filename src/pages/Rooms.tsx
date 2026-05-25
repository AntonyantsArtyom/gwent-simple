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

  const getSideForRoom = (room: Room): "player1" | "player2" | null => {
    if (!room.players.player1) {
      return "player1";
    }
    if (!room.players.player2) {
      return "player2";
    }
    return null;
  };

  if (loading) {
    return <div className="roomsPageContainer">Loading...</div>;
  }

  return (
    <div className="roomsPageContainer">
      <img className="roomsImage" src={roomsImage} />
      <div className="rooms">
        {rooms.map((room) => {
          const player1Joined = !!room.players.player1;
          const player2Joined = !!room.players.player2;
          const playersCount = (player1Joined ? 1 : 0) + (player2Joined ? 1 : 0);
          const isFull = playersCount === 2;
          const side = getSideForRoom(room);

          let statusText = "";
          if (isFull) {
            statusText = " (Full)";
          } else if (playersCount === 1) {
            statusText = " (1/2)";
          } else {
            statusText = " (0/2)";
          }

          return (
            <button
              key={room.id}
              onClick={() => {
                if (side) {
                  navigate(`/game/${room.id}?side=${side}`);
                }
              }}
              className="roomButton"
              disabled={isFull || !side}
              style={{
                opacity: isFull || !side ? 0.5 : 1,
                cursor: isFull || !side ? "not-allowed" : "pointer",
              }}
            >
              Комната {room.id + 1}
              {statusText}
            </button>
          );
        })}
      </div>
      <img className="line" src={line} />
      <img className="bottomImage" src={bottom} />
    </div>
  );
};
