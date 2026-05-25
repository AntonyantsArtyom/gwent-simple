"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateRoom = getOrCreateRoom;
exports.playCard = playCard;
exports.resetRoom = resetRoom;
const rooms = new Map();
function createEmptyBoard() {
    return {
        melee: [],
        ranged: [],
        siege: [],
    };
}
function getOrCreateRoom(roomId) {
    const existingRoom = rooms.get(roomId);
    if (existingRoom) {
        return existingRoom;
    }
    const room = {
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
function playCard(params) {
    const room = getOrCreateRoom(params.roomId);
    room.board[params.side][params.card.row].push(params.card);
    room.updatedAt = Date.now();
    return room;
}
function resetRoom(roomId) {
    const room = getOrCreateRoom(roomId);
    room.board = {
        player1: createEmptyBoard(),
        player2: createEmptyBoard(),
    };
    room.updatedAt = Date.now();
    return room;
}
