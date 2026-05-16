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

  room.updatedAt = Date.now();

  return room;
}
