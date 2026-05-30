export type RowType = "melee" | "ranged" | "siege";
export type WeatherType = "frost" | "haze" | "rain" | "clear"

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
