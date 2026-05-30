import { useState } from "react";
import type { Card as CardType } from "../../type";

interface GwentCardProps {
  className?: string;
  card: CardType;
  isSelected?: boolean;
  isDisabled?: boolean;
  isHidden?: boolean;
  onClick?: (card: CardType) => void;
}

export function Card({className, card, isSelected = false, isDisabled = false, isHidden = false, onClick }: GwentCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (isDisabled || isHidden) return;

    onClick?.(card);
  };

  const cardStyle: React.CSSProperties = {
    padding: 8,
    border: `2px solid ${isSelected ? "#ffd36a" : "#8b6f3e"}`,
    borderRadius: 8,
    background: isHidden ? "linear-gradient(135deg, #3a2416, #120b07)" : "linear-gradient(180deg, #2b2118, #14100c)",
    color: "#f5ddb0",
    cursor: isDisabled || isHidden ? "not-allowed" : "pointer",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    opacity: isDisabled ? 0.5 : 1,
    transform: isSelected ? "translateY(-8px)" : isHovered && !isDisabled && !isHidden ? "translateY(-6px)" : "translateY(0)",
    boxShadow: isSelected ? "0 0 16px rgba(255, 211, 106, 0.6)" : "none",
    transition: "transform 0.2s ease, border-color 0.2s ease, opacity 0.2s ease",
    overflow: "hidden",
  };

  const powerStyle: React.CSSProperties = {
    position: "absolute",
    top: 8,
    left: 8,
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "#e8d09b",
    color: "#1b130c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 18,
  };

  const contentStyle: React.CSSProperties = {
    minHeight: 56,
    padding: 8,
    borderRadius: 6,
    background: "rgba(0, 0, 0, 0.45)",
  };

  const nameStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1.2,
  };

  const rowStyle: React.CSSProperties = {
    marginTop: 4,
    fontSize: 12,
    opacity: 0.75,
  };

  const hiddenPatternStyle: React.CSSProperties = {
    position: "absolute",
    inset: 10,
    border: "2px solid rgba(232, 208, 155, 0.35)",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 42,
    fontWeight: 700,
    color: "rgba(232, 208, 155, 0.75)",
  };

  if (isHidden) {
    return (
      <button type="button" style={cardStyle} disabled>
        <div style={hiddenPatternStyle}>?</div>
      </button>
    );
  }

  return (
    <button
      className={className}
      type="button"
      disabled={isDisabled}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={powerStyle}>{card.power}</div>

      <div style={contentStyle}>
        <div style={nameStyle}>{card.name}</div>
        <div style={rowStyle}>{card.row}</div>
      </div>
    </button>
  );
}