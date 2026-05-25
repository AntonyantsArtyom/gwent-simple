import type { Card, RowType } from "../type";

export type PlayerSide = "player1" | "player2";

export type PlayerBoard = Record<RowType, Card[]>;

export interface Room {
  id: number;
  board: Record<PlayerSide, PlayerBoard>;
  createdAt: number;
  updatedAt: number;
  players: {
    player1: string | null;
    player2: string | null;
  };
}

const API_URL = "http://localhost:3001/api";

function getToken(): string | null {
  return localStorage.getItem("token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

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
      ...authHeaders(),
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
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to reset room");
  }

  return response.json();
}

export async function joinRoom(roomId: number, side: PlayerSide): Promise<Room> {
  const response = await fetch(`${API_URL}/rooms/${roomId}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ side }),
  });

  if (!response.ok) {
    throw new Error("Failed to join room");
  }

  return response.json();
}

export async function leaveRoom(roomId: number, side: PlayerSide): Promise<Room> {
  const response = await fetch(`${API_URL}/rooms/${roomId}/leave`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ side }),
  });

  if (!response.ok) {
    throw new Error("Failed to leave room");
  }

  return response.json();
}
