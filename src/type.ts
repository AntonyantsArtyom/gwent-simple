export type RowType = "melee" | "ranged" | "siege";

export interface Card {
  id: string;
  name: string;
  power: number;
  row: RowType;
}

export interface Board {
  player: Record<RowType, Card[]>;
  opponent: Record<RowType, Card[]>;
}
