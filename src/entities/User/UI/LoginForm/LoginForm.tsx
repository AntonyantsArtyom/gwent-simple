import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../model/useUserStore";
import roomsImage from "../../../../assets/content/RegistrationContent2.png";
import bottom from "../../../../assets/bottom.png";
import line from "../../../../assets/line.png";

export const LoginForm = () => {
  const navigate = useNavigate();

  const userStore = useUserStore();

  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!loginValue.trim()) {
      setValidationError("Введите логин");
      return;
    }

    if (!password) {
      setValidationError("Введите пароль");
      return;
    }

    try {
      await userStore.login(loginValue, password);
      navigate("/");
    } catch (err) {
      // ошибка уже в сторе
    }
  };

  return (
    <div className="registrationPageContainer">
      <img className="roomsImage" src={roomsImage} alt="rooms" />
      <form className="registationBlock" onSubmit={handleSubmit}>
        <input type="text" placeholder="Логин" value={loginValue} onChange={(e) => setLoginValue(e.target.value)} required />
        <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {validationError && <p className="error">{validationError}</p>}
        {userStore.error && <p className="error">{userStore.error}</p>}

        <div className="registrationBottom">
          <button type="submit" disabled={userStore.isLoading}>
            {userStore.isLoading ? "Загрузка..." : "войти"}
          </button>
          <p onClick={() => navigate("/registration")}>нет аккаунта</p>
        </div>
      </form>
      <img className="line" src={line} alt="line" />
      <img className="bottomImage" src={bottom} alt="bottom" />
    </div>
  );
};
