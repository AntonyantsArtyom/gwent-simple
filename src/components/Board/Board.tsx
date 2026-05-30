import type { RowType,WeatherType, Board as BoardType, Card as CardType } from "../../type";
import { Card } from "../Card/Card";

import frost from "../../assets/home/frost.svg"
import rain from "../../assets/home/rain.svg"
import haze from "../../assets/home/haze.svg"
import clear from "../../assets/home/clear.svg"


interface GwentBoardProps {
  className?: string;
  board: BoardType;
  selectedCard?: CardType | null;
  onPlayerRowClick?: (row: RowType) => void;
}

const rowLabels: Record<RowType, string> = {
  melee: "Ближний бой",
  ranged: "Дальний бой",
  siege: "Осада",
};

const weatherLabels: Record<WeatherType, string> = {
  frost: "Мороз",
  haze: "Туман",
  rain: "Дождь",
  clear: "Ясно"
};

export function Board({className, board, selectedCard, onPlayerRowClick }: GwentBoardProps) {
  const opponentRows: RowType[] = ["siege", "ranged", "melee"];
  const playerRows: RowType[] = ["melee", "ranged", "siege"];

  return (
    <div className={className}>
      {opponentRows.map((row,index) => (
        <GwentBoardRow 
          className={`enemies${row}`}
          index={index+1}
          weather={haze}
          key={`opponent-${row}`} 
          title={`Враг: ${rowLabels[row]}`} 
          cards={board.opponent[row]} />
      ))}
      {playerRows.map((row,index) => (
        <GwentBoardRow
          className={`allies${row}`}
          index={index+4}
          weather={frost}
          key={`player-${row}`}
          title={`Игрок: ${rowLabels[row]}`}
          cards={board.player[row]}
          isActive={selectedCard?.row === row}
          onClick={() => onPlayerRowClick?.(row)}
        />
      ))}
    </div>
  );
}

interface GwentBoardRowProps {
  className?: string;
  index?: number;
  weather?: string;
  title: string;
  cards: CardType[];
  isActive?: boolean;
  onClick?: () => void;
}

function GwentBoardRow({className,index,weather=clear, title, cards, isActive = false, onClick }: GwentBoardRowProps) {
  const totalPower = cards.reduce((sum, card) => sum + card.power, 0);

  return (
    <>
      <p className={`gameMarker${index}`}>{totalPower}</p>
      <img className={`weather${index}`} src={weather}/>
      <div className={`${className} ${isActive ? "activeRow" : ""}`} onClick={onClick}>
          {cards.length === 0 ? null : (
            cards.map((card) => (
                <Card className="cardInRow" key={card.id} card={card} isDisabled />
            ))
          )}
      </div>
    </>
  );
}
