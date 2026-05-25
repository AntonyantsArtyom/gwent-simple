import { useMemo, useState, useEffect } from "react";
import type { Board as BoardType, Card as CardType, RowType } from "../type";
import { playCardInRoom, resetRoom, joinRoom, leaveRoom, type PlayerSide } from "../api/roomApi";
import { useRoomPolling } from "../api/useRoomPolling";
import { mapRoomToBoard } from "../api/mapRoomToBoard";
import { Board } from "../components/Board/Board";
import { Hand } from "../components/Hand/Hand";
import { useNavigate } from "react-router-dom";

const initialCards: CardType[] = [
  {
    id: "1",
    name: "Geralt",
    power: 15,
    row: "melee",
  },
  {
    id: "2",
    name: "Triss",
    power: 7,
    row: "ranged",
  },
  {
    id: "3",
    name: "Ballista",
    power: 6,
    row: "siege",
  },
  {
    id: "4",
    name: "Vesemir",
    power: 6,
    row: "melee",
  },
  {
    id: "5",
    name: "Archer",
    power: 4,
    row: "ranged",
  },
];

function getRoomIdFromUrl(): number {
  const parts = window.location.pathname.split("/");
  const roomId = Number(parts.at(-1));

  if (Number.isNaN(roomId) || roomId < 0) {
    return 0;
  }

  return roomId;
}

function getSideFromUrl(): PlayerSide {
  const params = new URLSearchParams(window.location.search);
  const side = params.get("side");

  return side === "player2" ? "player2" : "player1";
}

export function Game() {
  const roomId = getRoomIdFromUrl();
  const side = getSideFromUrl();
  const navigate = useNavigate();

  const { room, isLoading } = useRoomPolling(roomId);

  const [hand, setHand] = useState<CardType[]>(initialCards);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [hasJoined, setHasJoined] = useState(false);

  const selectedCard = hand.find((card) => card.id === selectedCardId) ?? null;

  const board: BoardType | null = useMemo(() => {
    if (!room) return null;

    return mapRoomToBoard(room, side);
  }, [room, side]);

  useEffect(() => {
    if (!hasJoined && room) {
      joinRoom(roomId, side).catch(console.error);
      setHasJoined(true);
    }
  }, [room, roomId, side, hasJoined]);

  useEffect(() => {
    return () => {
      if (hasJoined) {
        leaveRoom(roomId, side).catch(console.error);
      }
    };
  }, [roomId, side, hasJoined]);

  const playersCount = room?.players ? (room.players.player1 ? 1 : 0) + (room.players.player2 ? 1 : 0) : 0;

  const handleCardClick = (card: CardType) => {
    setSelectedCardId(card.id);
  };

  const handlePlayerRowClick = async (row: RowType) => {
    if (!selectedCard) return;
    if (selectedCard.row !== row) return;

    await playCardInRoom({
      roomId,
      side,
      card: selectedCard,
    });

    setHand((prevHand) => prevHand.filter((card) => card.id !== selectedCard.id));

    setSelectedCardId(null);
  };

  const handleResetRoom = async () => {
    await resetRoom(roomId);

    setHand(initialCards);
    setSelectedCardId(null);
  };

  const handleLeaveRoom = async () => {
    await leaveRoom(roomId, side);
    setHasJoined(false);
    navigate("/rooms");
  };

  if (isLoading || !board) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#16120d",
          color: "#f5ddb0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading room...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#16120d",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: 12,
          background: "#0f0b07",
          color: "#f5ddb0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid #5f4728",
        }}
      >
        <div>
          Room: {roomId} | Side: {side} | Players: {playersCount}/2
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={handleResetRoom}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #8b6f3e",
              background: "#2b2118",
              color: "#f5ddb0",
              cursor: "pointer",
            }}
          >
            Reset room
          </button>

          <button
            type="button"
            onClick={handleLeaveRoom}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #8b6f3e",
              background: "#2b2118",
              color: "#f5ddb0",
              cursor: "pointer",
            }}
          >
            Leave room
          </button>
        </div>
      </div>

      <Board board={board} selectedCard={selectedCard} onPlayerRowClick={handlePlayerRowClick} />
      <Hand cards={hand} selectedCardId={selectedCardId} onCardClick={handleCardClick} />
    </div>
  );
}
