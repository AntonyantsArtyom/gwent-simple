import styles from './Footer.module.css'
import gwentLogo from "../../assets/home/gwentLogo.png";
import discordIcon from "../../assets/home/DiscordIconCircled.svg";
import telegramIcon from "../../assets/home/TelegramIconCircled.svg";
import youtubeIcon from "../../assets/home/YoutubeIconCircled.svg";
import vkIcon from "../../assets/home/VKIconCircled.svg";
import maxIcon from "../../assets/home/NoMaxIcon.svg";
import { Link } from 'react-router-dom';

function FooterComponent() {
  return (
        <footer className={styles.footer}>
            <div className={styles.footerPattern}>
            </div>
            <div className={styles.footerGwentLogo}>
                <Link to="/"><img src={gwentLogo} /></Link>
            </div>
            <div className={styles.footerMail}> 
                <p className="content-text-rubick">GwentTournament@mail.ru</p>
            </div>
            <div className={styles.footerSocials}>
                <a href="" className={styles.iconImg}><img src={discordIcon} /></a>
                <a href="" className={styles.iconImg}><img src={telegramIcon} /></a>
                <a href="" className={styles.iconImg}><img src={youtubeIcon} /></a>
                <a href="" className={styles.iconImg}><img src={vkIcon} /></a>
                <Link to="/not-ready" className={styles.iconImg}><img src={maxIcon} /></Link>
            </div>
            <div className={styles.footerLinks}> 
                <div className={styles.footerColumn}>
                    <p>Сайт</p>
                    <Link to="/not-ready" className="content-text-rubick">Соревнования</Link>
                    <Link to="/not-ready" className="content-text-rubick">Новости</Link>
                 </div>
                  <div className={styles.footerColumn}>
                    <p>Услуги</p>
                    <Link to="/not-ready" className="content-text-rubick">Мерч</Link>
                    <Link to="/not-ready" className="content-text-rubick">Билеты</Link>
                </div>
                <div className={styles.footerColumn}>
                    <p>Компания</p>
                    <Link to="/not-ready" className="content-text-rubick">Соревнование</Link>
                    <Link to="/not-ready" className="content-text-rubick">Новости</Link>
                </div>
                <div className={styles.footerColumn}>
                    <p>Остальное</p>
                    <Link to="/not-ready" className="content-text-rubick">Форум</Link>
                    <Link to="/not-ready" className="content-text-rubick">Тех. Поддержка</Link>
                </div>
            </div>
            <div className={styles.footerAgreements}>
                <Link to="/not-ready" className="content-text-rubick">Соглашение</Link>
                <Link to="/not-ready" className="content-text-rubick">Конфиденциальность</Link>
                <Link to="/not-ready" className="content-text-rubick">Правила форума</Link>
            </div>
            <div className={styles.footerYear}> 
                <p className="content-text-rubick" style={{ '--color': '#19A976' } as React.CSSProperties}>2026</p>
            </div>
        </footer> 
  );
}

export { FooterComponent as Footer };