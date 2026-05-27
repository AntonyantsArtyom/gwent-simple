import styles from './Footer.module.css'
import gwentLogo from "../../assets/home/gwentLogo.png";
import pattern1 from "../../assets/home/Pattern1.svg";
import discordIcon from "../../assets/home/DiscordIconCircled.svg";
import telegramIcon from "../../assets/home/TelegramIconCircled.svg";
import youtubeIcon from "../../assets/home/YoutubeIconCircled.svg";
import vkIcon from "../../assets/home/VKIconCircled.svg";
import maxIcon from "../../assets/home/NoMaxIcon.svg";

function FooterComponent() {
  return (
    <footer className={styles.footer}>
            <div className={styles.footerPattern}>
                <img src={pattern1}></img>
            </div>
            <div className={styles.footerGwentLogo}>
                <a href="index.html"><img src={gwentLogo}></img></a>
            </div>
            <div className={styles.footerMail}> 
                <a className="content-text-rubick">GwentTournament@mail.ru</a>
            </div>
            <div className={styles.footerSocials}>
                <a href="#" className={styles.iconImg}><img src={discordIcon}></img></a>
                <a href="#" className={styles.iconImg}><img src={telegramIcon}></img></a>
                <a href="#" className={styles.iconImg}><img src={youtubeIcon}></img></a>
                <a href="#" className={styles.iconImg}><img src={vkIcon}></img></a>
                <a href="fifth_social.html" className={styles.iconImg}><img src={maxIcon}></img></a>
            </div>
            <div className={styles.footerLinks}> 
                <div className={styles.footerColumn}>
                    <p>Сайт</p>
                    <a href="#" className="content-text-rubick">Соревнования</a>
                    <a href="#" className="content-text-rubick">Новости</a>
                 </div>
                  <div className={styles.footerColumn}>
                    <p>Услуги</p>
                    <a href="#" className="content-text-rubick">Мерч</a>
                    <a href="#" className="content-text-rubick">Билеты</a>
                </div>
                <div className={styles.footerColumn}>
                    <p>Компания</p>
                    <a href="#" className="content-text-rubick">Соревнование</a>
                    <a href="#" className="content-text-rubick">Новости</a>
                </div>
                <div className={styles.footerColumn}>
                    <p>Остальное</p>
                    <a href="#" className="content-text-rubick">Форум</a>
                    <a href="#" className="content-text-rubick">Тех. Поддержка</a>
                </div>
            </div>
            <div className={styles.footerAgreements}>
                <a href="#" className="content-text-rubick">Соглашение</a>
                <a href="#" className="content-text-rubick">Конфиденциальность</a>
                <a href="#" className="content-text-rubick">Правила форума</a>
            </div>
            <div className={styles.footerYear}> 
                <p className="content-text-rubick" style={{ '--color': '#19A976' } as React.CSSProperties}>2026</p>
            </div>
        </footer> 
  );
}

export { FooterComponent as Footer };