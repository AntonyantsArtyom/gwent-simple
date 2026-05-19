import "./styles.css";
import bottom from "../assets/bottom.png";
import line from "../assets/line.png";
import roomsImage from "../assets/rooms.png";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="registrationPageContainer">
      <img className="roomsImage" src={roomsImage} />
      <div className="registationBlock">
        <input type="text" placeholder="Логин" />
        <input type="password" placeholder="Пароль" />
        <div className="registrationBottom">
          <button>вход</button>
          <p
            onClick={() => {
              navigate(`/registration`);
            }}
          >
            нет аккаунта
          </p>
        </div>
      </div>
      <img className="line" src={line} />
      <img className="bottomImage" src={bottom} />
    </div>
  );
};
