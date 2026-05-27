import "../home.css";
import pattern1 from "../assets/home/Pattern1.svg";
import pattern2 from "../assets/home/Pattern2.svg";
import pattern3 from "../assets/home/small_pattern.svg";
import indexContent1 from "../assets/content/IndexContent1.png";
import indexContent2 from "../assets/content/IndexContent2.png";
import indexContent3 from "../assets/content/IndexContent3.png";
import logo1 from "../assets/home/partners_logo1.svg"
import logo2 from "../assets/home/partners_logo2.svg"
import logo3 from "../assets/home/partners_logo3.svg"
import discordLogo from "../assets/home/DiscordIconSquared.svg"
import telegramLogo from "../assets/home/TelegramIconSquared.svg"
import vkLogo from "../assets/home/VKIconSquared.svg"
import buttom from "../assets/home/Buttom.svg";
export const Home = () => {
  return (
    <>
      <div className="main">
            <div className="content">
                <img src={pattern1}></img>
                <img src={indexContent1}></img>
                <a className="overlay-element" style={{ '--x': '100px', '--y': '493px' } as React.CSSProperties}><img src={buttom}></img></a>
                <img src={pattern2}></img>
            </div>
            <div className="content">
                <div className="decorated-text-container">
                    <img src={pattern3}></img>
                    <a className="title-text-Nizhegorodsky">ЭТАПЫ ЧЕМПИОНАТА</a>
                    <img src={pattern3}></img>
                </div>
                <img src={indexContent2}></img>
            </div>
            <div className="content">
                <div className="decorated-text-container">
                    <img src={pattern3}></img>
                    <a className="title-text-Nizhegorodsky">ОПИСАНИЕ МЕРОПРИЯТИЯ</a>
                    <img src={pattern3}></img>
                </div>
                <p className="content-text-manrope">Новое представление о интересном погружении в сетинг онлайн игры Gwent Master где участники соревнуются в мастерском ведении бояс помощью расклада карт. Каждая карта - отдельный войн со своими характеристиками и способностями. Интересным этап для финалистовбудет попробовать на яву показать свои способности ведения боя на мечах.</p>
                <img src={pattern1}></img>
            </div>
            <div className="content">
                <div className="decorated-text-container">
                    <img src={pattern3}></img>
                    <a className="title-text-Nizhegorodsky">НАШИ ПАРТНЁРЫ</a>
                    <img src={pattern3}></img>
                </div>
                <div className="partners">
                    <a href="#"><img src={logo1}></img></a>
                    <a href="#"><img src={logo2}></img></a>
                    <a href="#"><img src={logo3}></img></a>
                </div>
                <img src={pattern2}></img>
            </div>
            <div className="content">
                <div className="decorated-text-container">
                    <img src={pattern3}></img>
                    <a className="title-text-Nizhegorodsky">СЛЕДИ ЗА НОВОСТЯМИ</a>
                    <img src={pattern3}></img>
                </div>
                <img src={indexContent3}></img>
                <a href="#" className="overlay-element" style={{ '--x': '188px', '--y': '525px' } as React.CSSProperties}><img src={telegramLogo}></img></a>
                <a href="#" className="overlay-element" style={{ '--x': '170px', '--y': '525px' } as React.CSSProperties}><img src={discordLogo}></img></a>
                <a href="#" className="overlay-element" style={{ '--x': '240px', '--y': '525px' } as React.CSSProperties}><img src={vkLogo}></img></a>
            </div>
            <div className="empty-block" style={{ '--h': '300px' } as React.CSSProperties} />
      </div>
    </>
  );
};
