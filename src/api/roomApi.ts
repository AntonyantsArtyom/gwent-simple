import type { Card, RowType } from "../type";

export type PlayerSide = "player1" | "player2";

export type PlayerBoard = Record<RowType, Card[]>;

export interface Room {
  id: number;
  board: Record<PlayerSide, PlayerBoard>;
  createdAt: number;
  updatedAt: number;
}

const API_URL = "http://localhost:3001/api";

export async function getRoom(roomId: number): Promise<Room> {
  const response = await fetch(`${API_URL}/rooms/${roomId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch room");
  }

  return response.json();
}

export async function getAllRooms(): Promise<{ total: number; rooms: Room[] }> {
  const response = await fetch(`${API_URL}/rooms`);

  if (!response.ok) {
    throw new Error("Failed to fetch all rooms");
  }

  return response.json();
}

export async function playCardInRoom(params: { roomId: number; side: PlayerSide; card: Card }): Promise<Room> {
  const response = await fetch(`${API_URL}/rooms/${params.roomId}/cards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      side: params.side,
      card: params.card,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to play card");
  }

  return response.json();
}

export async function resetRoom(roomId: number): Promise<Room> {
  const response = await fetch(`${API_URL}/rooms/${roomId}/reset`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to reset room");
  }

  return response.json();
}
