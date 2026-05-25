import { useMemo, useState, useEffect } from "react";
import type { Board as BoardType, Card as CardType, RowType } from "../type";
import { playCardInRoom, resetRoom, joinRoom, leaveRoom, passInRoom, type PlayerSide } from "../api/roomApi";
import { useRoomPolling } from "../api/useRoomPolling";
import { mapRoomToBoard } from "../api/mapRoomToBoard";
import { Board } from "../components/Board/Board";
import { Hand } from "../components/Hand/Hand";
import { useNavigate } from "react-router-dom";

const ALL_CARDS: CardType[] = [
  { id: "1", name: "Geralt", power: 15, row: "melee" },
  { id: "2", name: "Triss", power: 7, row: "ranged" },
  { id: "3", name: "Ballista", power: 6, row: "siege" },
  { id: "4", name: "Vesemir", power: 6, row: "melee" },
  { id: "5", name: "Archer", power: 4, row: "ranged" },
  { id: "6", name: "Catapult", power: 8, row: "siege" },
  { id: "7", name: "Dragon", power: 12, row: "ranged" },
  { id: "8", name: "Knight", power: 5, row: "melee" },
  { id: "9", name: "Crossbowman", power: 4, row: "siege" },
  { id: "10", name: "Scout", power: 3, row: "ranged" },
  { id: "11", name: "Warrior", power: 10, row: "melee" },
  { id: "12", name: "Mage", power: 6, row: "ranged" },
  { id: "13", name: "Trebuchet", power: 7, row: "siege" },
  { id: "14", name: "Berserker", power: 8, row: "melee" },
  { id: "15", name: "Sniper", power: 5, row: "ranged" },
  { id: "16", name: "Ram", power: 3, row: "siege" },
  { id: "17", name: "Guard", power: 4, row: "melee" },
  { id: "18", name: "Hunter", power: 5, row: "ranged" },
  { id: "19", name: "Cannon", power: 6, row: "siege" },
  { id: "20", name: "Hero", power: 11, row: "melee" },
  { id: "21", name: "Witcher", power: 9, row: "melee" },
  { id: "22", name: "Elf", power: 3, row: "ranged" },
  { id: "23", name: "Dwarf", power: 4, row: "melee" },
  { id: "24", name: "Bomber", power: 7, row: "siege" },
  { id: "25", name: "Assassin", power: 5, row: "ranged" },
  { id: "26", name: "Healer", power: 2, row: "ranged" },
  { id: "27", name: "Shieldmaiden", power: 6, row: "melee" },
  { id: "28", name: "Pirate", power: 4, row: "siege" },
  { id: "29", name: "Wolf", power: 5, row: "melee" },
  { id: "30", name: "Bear", power: 8, row: "melee" },
  { id: "31", name: "Harpy", power: 3, row: "ranged" },
  { id: "32", name: "Golem", power: 7, row: "siege" },
  { id: "33", name: "Vampire", power: 6, row: "melee" },
  { id: "34", name: "Specter", power: 4, row: "ranged" },
  { id: "35", name: "Wraith", power: 5, row: "melee" },
  { id: "36", name: "Gargoyle", power: 3, row: "siege" },
  { id: "37", name: "Druid", power: 4, row: "ranged" },
  { id: "38", name: "Skald", power: 2, row: "ranged" },
  { id: "39", name: "Jarl", power: 7, row: "melee" },
  { id: "40", name: "King", power: 14, row: "melee" },
];

function shuffleAndDraw(deck: CardType[], count: number): CardType[] {
  const shuffled = [...deck].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

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

  const [hand, setHand] = useState<CardType[]>(() => shuffleAndDraw(ALL_CARDS, 10));
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [hasJoined, setHasJoined] = useState(false);

  const selectedCard = hand.find((card) => card.id === selectedCardId) ?? null;

  const board: BoardType | null = useMemo(() => {
    if (!room) return null;
    return mapRoomToBoard(room, side);
  }, [room, side]);

  const playerPower = useMemo(() => {
    if (!room) return 0;
    const board = room.board[side];
    return [...board.melee, ...board.ranged, ...board.siege].reduce((sum, c) => sum + c.power, 0);
  }, [room, side]);

  const opponentPower = useMemo(() => {
    if (!room) return 0;
    const otherSide = side === "player1" ? "player2" : "player1";
    const board = room.board[otherSide];
    return [...board.melee, ...board.ranged, ...board.siege].reduce((sum, c) => sum + c.power, 0);
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

  useEffect(() => {
    if (room?.gameOver) {
      const isWinner = room.winner === side;
      setTimeout(() => {
        alert(isWinner ? "Победа!" : room.winner === null ? "Ничья!" : "Поражение!");
      }, 100);
    }
  }, [room?.gameOver, room?.winner, side]);

  const playersCount = room?.players ? (room.players.player1 ? 1 : 0) + (room.players.player2 ? 1 : 0) : 0;

  const myScore = room?.score?.[side] ?? 0;
  const otherSide = side === "player1" ? "player2" : "player1";
  const opponentScore = room?.score?.[otherSide] ?? 0;
  const hasPassed = room?.passed?.[side] ?? false;
  const opponentPassed = room?.passed?.[otherSide] ?? false;

  const handleCardClick = (card: CardType) => {
    if (room?.gameOver || hasPassed) return;
    setSelectedCardId(card.id);
  };

  const handlePlayerRowClick = async (row: RowType) => {
    if (!selectedCard) return;
    if (selectedCard.row !== row) return;
    if (room?.gameOver || hasPassed) return;

    await playCardInRoom({
      roomId,
      side,
      card: selectedCard,
    });

    setHand((prevHand) => prevHand.filter((card) => card.id !== selectedCard.id));
    setSelectedCardId(null);
  };

  const handlePass = async () => {
    if (room?.gameOver || hasPassed) return;
    await passInRoom(roomId, side);
  };

  const handleResetRoom = async () => {
    await resetRoom(roomId);
    setHand(shuffleAndDraw(ALL_CARDS, 10));
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
          <span style={{ marginLeft: 16 }}>
            Счёт: {myScore} - {opponentScore}
          </span>
          <span style={{ marginLeft: 16 }}>
            Сила: {playerPower} - {opponentPower}
          </span>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={handlePass}
            disabled={hasPassed || room?.gameOver}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #8b6f3e",
              background: hasPassed ? "#4a3a2a" : "#2b2118",
              color: hasPassed ? "#8b7355" : "#f5ddb0",
              cursor: hasPassed || room?.gameOver ? "not-allowed" : "pointer",
            }}
          >
            {hasPassed ? "Пас" : "Пас"}
          </button>

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
            Reset
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
            Leave
          </button>
        </div>
      </div>

      {room?.gameOver && (
        <div
          style={{
            padding: 16,
            background: room.winner === side ? "#2d4a1e" : room.winner === null ? "#4a4a1e" : "#4a1e1e",
            color: "#f5ddb0",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          {room.winner === side ? "ПОБЕДА!" : room.winner === null ? "НИЧЬЯ!" : "ПОРАЖЕНИЕ!"}
        </div>
      )}

      <Board board={board} selectedCard={selectedCard} onPlayerRowClick={handlePlayerRowClick} />
      <Hand cards={hand} selectedCardId={selectedCardId} onCardClick={handleCardClick} />
    </div>
  );
}
