import type { Board } from "../type";
import type { PlayerSide, Room } from "./roomApi";

export function mapRoomToBoard(room: Room, side: PlayerSide): Board {
  const opponentSide: PlayerSide = side === "player1" ? "player2" : "player1";

  return {
    player: room.board[side],
    opponent: room.board[opponentSide],
  };
}
