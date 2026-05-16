export type RowType = "melee" | "ranged" | "siege";

export type PlayerSide = "player1" | "player2";

export interface Card {
  id: string;
  name: string;
  power: number;
  row: RowType;
}

export type PlayerBoard = Record<RowType, Card[]>;

export interface Room {
  id: number;
  board: Record<PlayerSide, PlayerBoard>;
  createdAt: number;
  updatedAt: number;
}
