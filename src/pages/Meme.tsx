import "./styles.css";
import meme from "../assets/content/mah.jpeg"
import pattern4 from "../assets/home/Pattern4.svg";
import pattern5 from "../assets/home/Pattern5.svg";

export const Meme = () => {
  return (
    <div className="main">
        <div className="contentVertical">
            <img src={pattern4}/>
            <img className="sizedImage" style={{'--width':'1000px'} as React.CSSProperties} src={meme} />
            <img src={pattern5}/>
        </div>
    </div>
  );
};