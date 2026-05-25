import type { Card, PlayerBoard, PlayerSide, Room } from "./types.js";

const rooms = new Map<number, Room>();

function createEmptyBoard(): PlayerBoard {
  return {
    melee: [],
    ranged: [],
    siege: [],
  };
}

export function getOrCreateRoom(roomId: number): Room {
  const existingRoom = rooms.get(roomId);

  if (existingRoom) {
    return existingRoom;
  }

  const room: Room = {
    id: roomId,
    board: {
      player1: createEmptyBoard(),
      player2: createEmptyBoard(),
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    players: {
      player1: null,
      player2: null,
    },
  };

  rooms.set(roomId, room);
  return room;
}

export function playCard(params: { roomId: number; side: PlayerSide; card: Card }): Room {
  const room = getOrCreateRoom(params.roomId);
  room.board[params.side][params.card.row].push(params.card);
  room.updatedAt = Date.now();
  return room;
}

export function resetRoom(roomId: number): Room {
  const room = getOrCreateRoom(roomId);
  room.board = {
    player1: createEmptyBoard(),
    player2: createEmptyBoard(),
  };
  room.players = {
    player1: null,
    player2: null,
  };
  room.updatedAt = Date.now();
  return room;
}

export function getAllRooms(): Room[] {
  return Array.from(rooms.values());
}

export function joinRoom(roomId: number, side: PlayerSide, userId: string): Room {
  const room = getOrCreateRoom(roomId);

  if (room.players[side]) {
    throw new Error("Side already taken");
  }

  const otherSide: PlayerSide = side === "player1" ? "player2" : "player1";
  if (room.players[otherSide] === userId) {
    throw new Error("You are already on the other side");
  }

  room.players[side] = userId;
  room.updatedAt = Date.now();
  return room;
}

export function leaveRoom(roomId: number, side: PlayerSide, userId: string): Room {
  const room = getOrCreateRoom(roomId);

  if (room.players[side] !== userId) {
    throw new Error("You are not on this side");
  }

  room.players[side] = null;
  room.updatedAt = Date.now();
  return room;
}

export function getPlayersCountInRoom(room: Room): number {
  let count = 0;
  if (room.players.player1) count++;
  if (room.players.player2) count++;
  return count;
}

export function canPlayCard(roomId: number, side: PlayerSide, userId: string): boolean {
  const room = rooms.get(roomId);
  if (!room) return false;
  return room.players[side] === userId;
}

for (let i = 0; i < 10; i++) {
  getOrCreateRoom(i);
}
