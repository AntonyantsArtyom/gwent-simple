import { useUserStore } from "../../model/useUserStore";
import roomsImage from "../../../../assets/content/RegistrationContent1.png";
import pattern3 from "../../../../assets/home/small_pattern.svg";
import pattern4 from "../../../../assets/home/Pattern4.svg";
import pattern5 from "../../../../assets/home/Pattern5.svg";
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
    <div className="registrationPageContainer main">
      <div className="contentVertical">
        <img src={pattern4}/>
        <div className="contentHorizontal">
         <img className="sizedImage" style={{'--width':'721px','--height':'536px'} as React.CSSProperties} src={roomsImage} alt="rooms" />
          <form className="registationBlock" onSubmit={handleSubmit}>
            <div className="decorated-text-container">
              <img src={pattern3}/>
              <p className="title-text-Nizhegorodsky">МОЖЕТ, ПАРТИЮ В ГВИНТ?</p>
              <img src={pattern3}/>
            </div>
            <div className="empty-block" style={{ '--height': '63px' } as React.CSSProperties} />
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
              <button className="greenButton" type="submit" disabled={userStore.isLoading}>
                <p className="content-text-manrope" style={{ '--size': '16px', '--weight': '700' , '--color': '#F4F7FB'} as React.CSSProperties}>
                  {userStore.isLoading ? "Загрузка..." : "Зарегестрироваться"}
                </p>
              </button>
              <p onClick={() => !userStore.isLoading && navigate("/login")} className="content-text-manrope cursorPointer" style={{ '--size': '16px', '--weight': '700' , '--color': '#F4F7FB'} as React.CSSProperties}>или Войти</p>
            </div>
          </form>
        </div>
        <img src={pattern5}/>
      </div>
      <div className="empty-block" style={{ '--height': '26px' } as React.CSSProperties} />
    </div>
  );
};
