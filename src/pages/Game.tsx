import "./Game_styles.css"

import { useMemo, useState, useEffect } from "react";
import type { Board as BoardType, Card as CardType, RowType } from "../type";
import { playCardInRoom, resetRoom, joinRoom, leaveRoom, passInRoom, type PlayerSide } from "../api/roomApi";
import { useRoomPolling } from "../api/useRoomPolling";
import { mapRoomToBoard } from "../api/mapRoomToBoard";
import { Board } from "../components/Board/Board";
import { Hand } from "../components/Hand/Hand";
import { useNavigate } from "react-router-dom";

import pattern6 from "../assets/home/Pattern6.svg";
import enemyAvatar from "../assets/home/enemyAvatar.jpg"
import playerAvatar from "../assets/home/toTest.jpg"
import heart from "../assets/home/heart_red.svg"
import noHeart from "../assets/home/heart_grey.svg"

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

function shuffleAndDrawWithDelete(deck: CardType[], count: number, previousHand: CardType[] = []): CardType[] {
  const shuffled = [...deck].sort(() => Math.random() - 0.5);
  console.log("before" , JSON.stringify(previousHand) ,"new" + JSON.stringify(shuffled) , "final" ,[...previousHand, ...shuffled.slice(0, count)])
  const hand = [...previousHand, ...shuffled.slice(0, count)];
  deck = deck.filter(card => !hand.find(cardInHand => cardInHand.id === card.id))
  return hand.slice(0, 10);
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

  useEffect(() => {
    if(room?.rounds.length === 0 || room == null){
      return;
    }

    setHand(shuffleAndDrawWithDelete(ALL_CARDS, 3, hand))
  }, [
    room?.rounds.length
  ])


  const [hand, setHand] = useState<CardType[]>(() => shuffleAndDrawWithDelete(ALL_CARDS, 10));
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

  const handleLeaveRoom = async () => {
    await leaveRoom(roomId, side);
    setHasJoined(false);
    navigate("/rooms");
  };

  const scoreToWin: number = 2;
  const enemyScore: number = (getSideFromUrl() === 'player2' ? room?.score.player1 : room?.score.player2) ?? 0
  const playerScore = (getSideFromUrl() === 'player1' ? room?.score.player1 : room?.score.player2) ?? 0

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
    <div className="main">
      <div className="contentHorizontal" style={{'--gap-x':'0'} as React.CSSProperties}>
        <div className="gameField1">
          <button
            className="giveUpButton"
            type="button"
            onClick={handleLeaveRoom}
          >
            <p className="content-text-manrope" style={{ '--size': '16px', '--weight': '1000' , '--color': '#A4A9A5'} as React.CSSProperties}>[X]</p>
            <p className="content-text-manrope" style={{ '--size': '16px', '--weight': '600' , '--color': '#F4F7FB'} as React.CSSProperties}>Сдаться</p>
          </button>
          <p 
            className="enemyNick content-text-manrope"
            style={{ '--size': '20px', '--color': '#F4F7FB'} as React.CSSProperties}
          >
            {getSideFromUrl() === 'player2' ? room?.players.player1Nickname : room?.players.player2Nickname}</p>
          <button
            className="passButton"
            type="button"
            onClick={handlePass}
            disabled={hasPassed || room?.gameOver}
            style={{
              color: hasPassed ? "#8b7355" : "#8b7355",
              cursor: hasPassed || room?.gameOver ? "not-allowed" : "pointer",
            }}
          >
            <p className="content-text-manrope" style={{ '--size': '16px', '--weight': '1000' , '--color': '#A4A9A5'} as React.CSSProperties}>{hasPassed ? "[Ожидайте]" : "[Space]"}</p>
            <p className="content-text-manrope" style={{ '--size': '16px', '--weight': '600' , '--color': hasPassed ? '#8b7355' : '#F4F7FB' } as React.CSSProperties}>{hasPassed ? "Спасовали" : "Спасовать"}</p>
          </button>
          <img className="enemyAvatar" src={enemyAvatar}/>


          <p 
            className="playerNick content-text-manrope"
            style={{ '--size': '20px', '--color': '#F4F7FB'} as React.CSSProperties}
          >{getSideFromUrl() === 'player1' ? room?.players.player1Nickname :room?.players.player2Nickname}</p>
          <img className="playerAvatar" src={playerAvatar}/>


          <div className="enemyScore">
            {(scoreToWin-playerScore) >= 1 ?  <img src={heart} />:<img src={noHeart} />}
            {(scoreToWin-playerScore) >= 2 ?  <img src={heart} />:<img src={noHeart} />}
          </div>
          <p className="enemyDamage content-text-manrope">{opponentPower}</p>


          <div className="playerScore">
            {(scoreToWin-enemyScore) >= 1 ?  <img src={heart} />:<img src={noHeart} />}
            {(scoreToWin-enemyScore) >= 2 ?  <img src={heart} />:<img src={noHeart} />}
          </div>
          <p className="playerDamage content-text-manrope">{playerPower}</p>
        </div>
        <Board className='gameField3' board={board} selectedCard={selectedCard} onPlayerRowClick={handlePlayerRowClick} />
        <img src={pattern6} />
        <Hand className="gameField4" cards={hand} selectedCardId={selectedCardId} onCardClick={handleCardClick} />
      </div>
    </div>
  );
}
