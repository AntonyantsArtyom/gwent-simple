export type RowType = "melee" | "ranged" | "siege";

export type PlayerSide = "player1" | "player2";

export interface Card {
  id: string;
  name: string;
  power: number;
  row: RowType;
}

export type PlayerBoard = Record<RowType, Card[]>;

export interface RoundResult {
  winner: PlayerSide | "draw";
  player1Power: number;
  player2Power: number;
}

export interface Room {
  id: number;
  board: Record<PlayerSide, PlayerBoard>;
  createdAt: number;
  updatedAt: number;
  players: {
    player1: string | null;
    player2: string | null;
  };
  passed: {
    player1: boolean;
    player2: boolean;
  };
  rounds: RoundResult[];
  score: {
    player1: number;
    player2: number;
  };
  winner: PlayerSide | null;
  gameOver: boolean;
}
