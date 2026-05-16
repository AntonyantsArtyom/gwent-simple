import type { RowType, Board as BoardType, Card as CardType } from "../../type";
import { Card } from "../Card/Card";

interface GwentBoardProps {
  board: BoardType;
  selectedCard?: CardType | null;
  onPlayerRowClick?: (row: RowType) => void;
}

const rowLabels: Record<RowType, string> = {
  melee: "Ближний бой",
  ranged: "Дальний бой",
  siege: "Осада",
};

export function Board({ board, selectedCard, onPlayerRowClick }: GwentBoardProps) {
  const opponentRows: RowType[] = ["siege", "ranged", "melee"];
  const playerRows: RowType[] = ["melee", "ranged", "siege"];

  return (
    <div
      style={{
        width: "100%",
        padding: 16,
        background: "#1b140d",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {opponentRows.map((row) => (
        <GwentBoardRow key={`opponent-${row}`} title={`Враг: ${rowLabels[row]}`} cards={board.opponent[row]} />
      ))}

      <div
        style={{
          height: 2,
          background: "#8b6f3e",
          margin: "8px 0",
          opacity: 0.7,
        }}
      />

      {playerRows.map((row) => (
        <GwentBoardRow
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
  title: string;
  cards: CardType[];
  isActive?: boolean;
  onClick?: () => void;
}

function GwentBoardRow({ title, cards, isActive = false, onClick }: GwentBoardRowProps) {
  const totalPower = cards.reduce((sum, card) => sum + card.power, 0);

  return (
    <div
      onClick={onClick}
      style={{
        minHeight: 130,
        padding: 12,
        border: `2px solid ${isActive ? "#ffd36a" : "#5f4728"}`,
        borderRadius: 8,
        background: isActive ? "rgba(255, 211, 106, 0.12)" : "rgba(0, 0, 0, 0.28)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div
        style={{
          width: 120,
          color: "#f5ddb0",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        <div>{title}</div>

        <div
          style={{
            marginTop: 8,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "#e8d09b",
            color: "#1b130c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          {totalPower}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
          flex: 1,
        }}
      >
        {cards.length === 0 ? (
          <span
            style={{
              color: "#8f7650",
              fontSize: 14,
            }}
          >
            Пустой ряд
          </span>
        ) : (
          cards.map((card) => (
            <div
              key={card.id}
              style={{
                transform: "scale(0.65)",
                transformOrigin: "left center",
                width: 78,
                height: 117,
              }}
            >
              <Card card={card} isDisabled />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
