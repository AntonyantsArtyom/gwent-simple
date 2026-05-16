import type { Card as CardType } from "../../type";
import { Card } from "../Card/Card";

interface GwentHandProps {
  cards: CardType[];
  selectedCardId?: string | null;
  isDisabled?: boolean;
  isHiddenCards?: boolean;
  onCardClick?: (card: CardType) => void;
}

export function Hand({ cards, selectedCardId, isDisabled = false, isHiddenCards = false, onCardClick }: GwentHandProps) {
  const handStyle: React.CSSProperties = {
    width: "100%",
    minHeight: 220,
    padding: 16,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 12,
    background: "rgba(0, 0, 0, 0.35)",
    borderTop: "2px solid #5f4728",
  };

  return (
    <div style={handStyle}>
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          isSelected={!isHiddenCards && selectedCardId === card.id}
          isDisabled={isDisabled}
          isHidden={isHiddenCards}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
}
