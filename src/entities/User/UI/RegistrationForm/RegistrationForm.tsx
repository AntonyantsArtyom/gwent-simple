import { useUserStore } from "../../model/useUserStore";
import roomsImage from "../../../../assets/rooms.png";
import bottom from "../../../../assets/bottom.png";
import line from "../../../../assets/line.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const RegistrationForm = () => {
  const [loginValue, setLoginValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const navigate = useNavigate();

  const userStore = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (passwordValue !== confirmPassword) {
      setValidationError("Пароли не совпадают");
      return;
    }

    if (passwordValue.length < 6) {
      setValidationError("Пароль должен быть не менее 6 символов");
      return;
    }

    try {
      await userStore.register(loginValue, passwordValue);
      navigate("/rooms");
    } catch (err) {
      // ошибка уже установлена в сторе
    }
  };

  return (
    <div className="registrationPageContainer">
      <img className="roomsImage" src={roomsImage} />
      <form className="registationBlock" onSubmit={handleSubmit}>
        <input type="text" placeholder="Логин" value={loginValue} onChange={(e) => setLoginValue(e.target.value)} disabled={userStore.isLoading} required />
        <input
          type="password"
          placeholder="Пароль"
          value={passwordValue}
          onChange={(e) => setPasswordValue(e.target.value)}
          disabled={userStore.isLoading}
          required
        />
        <input
          type="password"
          placeholder="Пароль (повтор)"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={userStore.isLoading}
          required
        />

        {validationError && <p className="error">{validationError}</p>}
        {userStore.error && <p className="error">{userStore.error}</p>}

        <div className="registrationBottom">
          <button type="submit" disabled={userStore.isLoading}>
            {userStore.isLoading ? "Загрузка..." : "регистрация"}
          </button>
          <p onClick={() => !userStore.isLoading && navigate("/login")}>есть аккаунт</p>
        </div>
      </form>
      <img className="line" src={line} />
      <img className="bottomImage" src={bottom} />
    </div>
  );
};
