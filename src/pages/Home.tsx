import "../home.css";
import gwentLogo from "../assets/home/gwentLogo.png";
import loginButton from "../assets/home/loginButton.png";
import pattern1 from "../assets/home/Pattern1.svg";
import pattern2 from "../assets/home/Pattern2.svg";
import indexContent1 from "../assets/content/IndexContent1.png";
import indexContent2 from "../assets/content/IndexContent2.png";
import discordIcon from "../assets/home/DiscordIconCircled.svg";
import telegramIcon from "../assets/home/TelegramIconCircled.svg";
import vkIcon from "../assets/home/VKIconCircled.svg";

export const Home = () => {
  return (
    <>
      <div className="grid-container">
        <div className="main">
          <div className="content">
            <img src={pattern1} alt="Pattern 1" />
            <img src={indexContent1} alt="Content 1" />
            <img src={pattern2} alt="Pattern 2" />
          </div>
          <div className="content">
            <span className="title-text-Nizhegorodsky">ЭТАПЫ ЧЕМПИОНАТА</span>
            <img src={indexContent2} alt="Content 2" />
          </div>
        </div>
        <footer>
          <div className="footerPattern">
            <img src={pattern1} alt="Pattern" />
          </div>
          <div className="footerGwentLogo">
            <a href="#">
              <img src={gwentLogo} alt="Gwent Logo" />
            </a>
          </div>
          <div className="footerMail">
            <span className="content-text-rubick">GwentTournament@mail.ru</span>
          </div>
          <div className="footerSocials">
            <a href="#">
              <img src={discordIcon} alt="Discord" />
            </a>
            <a href="#">
              <img src={telegramIcon} alt="Telegram" />
            </a>
            <a href="#">
              <img src={vkIcon} alt="VK" />
            </a>
          </div>
          <div className="footerLinks">
            <div className="footer-column">
              <h3>Сайт</h3>
              <a href="#" className="content-text-rubick">
                Соревнования
              </a>
              <a href="#" className="content-text-rubick">
                Новости
              </a>
            </div>
            <div className="footer-column">
              <h3>Услуги</h3>
              <a href="#" className="content-text-rubick">
                Мерч
              </a>
              <a href="#" className="content-text-rubick">
                Билеты
              </a>
            </div>
            <div className="footer-column">
              <h3>Компания</h3>
              <a href="#" className="content-text-rubick">
                Соревнование
              </a>
              <a href="#" className="content-text-rubick">
                Новости
              </a>
            </div>
            <div className="footer-column">
              <h3>Остальное</h3>
              <a href="#" className="content-text-rubick">
                Форум
              </a>
              <a href="#" className="content-text-rubick">
                Тех. Поддержка
              </a>
            </div>
          </div>
          <div className="footerAgreements">
            <a href="#" className="content-text-rubick">
              Соглашение
            </a>
            <a href="#" className="content-text-rubick">
              Конфидециальность
            </a>
            <a href="#" className="content-text-rubick">
              Правила форума
            </a>
          </div>
          <div className="footerYear">
            <span className="content-text-rubick green-text">2026</span>
          </div>
        </footer>
      </div>
    </>
  );
};
