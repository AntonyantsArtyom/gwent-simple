import type { Card as CardType } from "../../type";
import { Card } from "../Card/Card";

interface GwentHandProps {
  className?: string;
  cards: CardType[];
  selectedCardId?: string | null;
  isDisabled?: boolean;
  isHiddenCards?: boolean;
  onCardClick?: (card: CardType) => void;
}

export function Hand({className, cards, selectedCardId, isDisabled = false, isHiddenCards = false, onCardClick }: GwentHandProps) {
  return (
    <div className={className}>
      {cards.map((card, index) => (
        <Card
          className={`cardInHand${index + 1}`}
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
