import { Link } from "react-router-dom";
import logo from "../../assets/home/gwentLogo.png";
import login from "../../assets/home/loginButton.png";
import { Pages, TITLES_MAP } from "./constants/constants";

import css from "./Header.module.css";

export const Header = () => {
  return (
    <header className={css.header}>
      <div className={css.headerLeft}>
        <Link to="/home">
          <img src={logo} alt="Gwent Logo" />
        </Link>
        {Pages.map((page) => {
          return (
            <Link key={page} to={page} className={css.link}>
              {TITLES_MAP[page]}
            </Link>
          );
        })}
      </div>
      <Link to={"/registration"} className={css.headerRight}>
        Войти
        <img src={login} alt="Login" />
      </Link>
    </header>
  );
};
