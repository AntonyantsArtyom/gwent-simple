import "./styles.css";

import bottom from "../assets/bottom.png";
import line from "../assets/line.png";
import roomsImage from "../assets/rooms.png";
import { useNavigate } from "react-router-dom";

export const Rooms = () => {
  const rooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const navigate = useNavigate();

  return (
    <div className="roomsPageContainer">
      <img className="roomsImage" src={roomsImage} />
      <div className="rooms">
        {rooms.map((room) => (
          <button onClick={() => navigate(`/game/${room}?side=player1`)} className="roomButton">
            Комната {room}
          </button>
        ))}
      </div>
      <img className="line" src={line} />
      <img className="bottomImage" src={bottom} />
    </div>
  );
};
