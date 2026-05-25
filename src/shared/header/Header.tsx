import { Link } from "react-router-dom";
import logo from "../../assets/home/gwentLogo.png";
import login from "../../assets/home/loginButton.png";
import { Pages, PagesEnum, TITLES_MAP } from "./constants/constants";

import css from "./Header.module.css";
import { useUserStore } from "../../entities/User/model/useUserStore";
import { useEffect, useState } from "react";

export const Header = () => {
  const userStore = useUserStore();

  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(!!userStore.user);
  }, [userStore.user]);

  return (
    <header className={css.header}>
      <div className={css.headerLeft}>
        <Link to="/home">
          <img src={logo} alt="Gwent Logo" />
        </Link>
        {Pages.map((page) => {
          if (page === PagesEnum.rooms && !isAuth) return null;

          return (
            <Link key={page} to={page} className={css.link}>
              {TITLES_MAP[page]}
            </Link>
          );
        })}
      </div>
      {!isAuth ? (
        <Link to={"/registration"} className={css.headerRight}>
          Войти
          <img src={login} alt="Login" />
        </Link>
      ) : (
        <div
          className={css.headerRight}
          onClick={() => {
            userStore.logout();
          }}
        >
          Выйти
          <img src={login} alt="Login" />
        </div>
      )}
    </header>
  );
};
