import type { RowType, Board as BoardType, Card as CardType } from "../../type";
import { Card } from "../Card/Card";

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

export function Board({className, board, selectedCard, onPlayerRowClick }: GwentBoardProps) {
  const opponentRows: RowType[] = ["siege", "ranged", "melee"];
  const playerRows: RowType[] = ["melee", "ranged", "siege"];

  return (
    <div className={className}>
      {opponentRows.map((row) => (
        <GwentBoardRow 
          className={`enemies${row}`}
          key={`opponent-${row}`} 
          title={`Враг: ${rowLabels[row]}`} 
          cards={board.opponent[row]} />
      ))}
      {playerRows.map((row) => (
        <GwentBoardRow
          className={`allies${row}`}
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
  title: string;
  cards: CardType[];
  isActive?: boolean;
  onClick?: () => void;
}

function GwentBoardRow({className, title, cards, isActive = false, onClick }: GwentBoardRowProps) {
  const totalPower = cards.reduce((sum, card) => sum + card.power, 0);

  return (
    <div className={`${className} ${isActive ? "activeRow" : ""}`} onClick={onClick}>
        {cards.length === 0 ? null : (
          cards.map((card) => (
              <Card className="cardInRow" key={card.id} card={card} isDisabled />
          ))
        )}
    </div>
  );
}
