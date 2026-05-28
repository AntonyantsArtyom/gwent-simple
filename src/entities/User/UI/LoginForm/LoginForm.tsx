import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../model/useUserStore";
import roomsImage from "../../../../assets/content/RegistrationContent2.png";
import pattern3 from "../../../../assets/home/small_pattern.svg";
import pattern4 from "../../../../assets/home/Pattern4.svg";
import pattern5 from "../../../../assets/home/Pattern5.svg";

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
    <div className="registrationPageContainer main">
      <div className="contentVertical">
        <img src={pattern4}/>
        <div className="contentHorizontal">
          <img className="roomsImage" src={roomsImage} alt="rooms" />
          <form className="registationBlock" onSubmit={handleSubmit}>
            <div className="decorated-text-container">
              <img src={pattern3}/>
              <p className="title-text-Nizhegorodsky">С ВОЗВРАЩЕНИЕМ, ПУТНИК</p>
              <img src={pattern3}/>
            </div>
            <div className="empty-block" style={{ '--height': '63px' } as React.CSSProperties} />
            <input type="text" placeholder="Логин" value={loginValue} onChange={(e) => setLoginValue(e.target.value)} required />
            <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />

            {validationError && <p className="error">{validationError}</p>}
            {userStore.error && <p className="error">{userStore.error}</p>}

            <div className="registrationBottom">
              <button className="greenButton" type="submit" disabled={userStore.isLoading}>
                <p className="content-text-manrope" style={{ '--size': '16px', '--weight': '700' , '--color': '#F4F7FB'} as React.CSSProperties}>
                  {userStore.isLoading ? "Загрузка..." : "Войти"}
                </p>
              </button>
              <p onClick={() => navigate("/registration")} className="content-text-manrope cursorPointer" style={{ '--size': '16px', '--weight': '700' , '--color': '#F4F7FB'} as React.CSSProperties}>нет аккаунта</p>
            </div>
          </form>
        </div>
        <img src={pattern5}/>
      </div>
      <div className="empty-block" style={{ '--height': '26px' } as React.CSSProperties} />
    </div>
  );
};
