"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateRoom = getOrCreateRoom;
exports.playCard = playCard;
exports.pass = pass;
exports.resetRoom = resetRoom;
exports.getAllRooms = getAllRooms;
exports.joinRoom = joinRoom;
exports.leaveRoom = leaveRoom;
exports.getPlayersCountInRoom = getPlayersCountInRoom;
exports.canPlayCard = canPlayCard;
exports.canPass = canPass;
const auth_store_js_1 = require("./auth.store.js");
const rooms = new Map();
function createEmptyBoard() {
    return {
        melee: [],
        ranged: [],
        siege: [],
    };
}
function createEmptyRoom(roomId) {
    return {
        id: roomId,
        board: {
            player1: createEmptyBoard(),
            player2: createEmptyBoard(),
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
        players: {
            player1: null,
            player1Nickname: null,
            player2: null,
            player2Nickname: null
        },
        passed: {
            player1: false,
            player2: false,
        },
        rounds: [],
        score: {
            player1: 0,
            player2: 0,
        },
        winner: null,
        gameOver: false,
    };
}
function calculateTotalPower(board) {
    return [...board.melee, ...board.ranged, ...board.siege].reduce((sum, card) => sum + card.power, 0);
}
function resolveRound(room) {
    const player1Power = calculateTotalPower(room.board.player1);
    const player2Power = calculateTotalPower(room.board.player2);
    let winner;
    if (player1Power > player2Power) {
        winner = "player1";
        room.score.player1++;
    }
    else if (player2Power > player1Power) {
        winner = "player2";
        room.score.player2++;
    }
    else {
        winner = "draw";
    }
    room.rounds.push({
        winner,
        player1Power,
        player2Power,
    });
    if (room.score.player1 >= 2) {
        room.winner = "player1";
        room.gameOver = true;
        if (room.players.player1)
            (0, auth_store_js_1.addWin)(room.players.player1);
        if (room.players.player2)
            (0, auth_store_js_1.addLoss)(room.players.player2);
    }
    else if (room.score.player2 >= 2) {
        room.winner = "player2";
        room.gameOver = true;
        if (room.players.player2)
            (0, auth_store_js_1.addWin)(room.players.player2);
        if (room.players.player1)
            (0, auth_store_js_1.addLoss)(room.players.player1);
    }
    else {
        room.board = {
            player1: createEmptyBoard(),
            player2: createEmptyBoard(),
        };
        room.passed = {
            player1: false,
            player2: false,
        };
    }
    room.updatedAt = Date.now();
}
function getOrCreateRoom(roomId) {
    const existingRoom = rooms.get(roomId);
    if (existingRoom) {
        return existingRoom;
    }
    const room = createEmptyRoom(roomId);
    rooms.set(roomId, room);
    return room;
}
function playCard(params) {
    const room = getOrCreateRoom(params.roomId);
    room.board[params.side][params.card.row].push(params.card);
    room.updatedAt = Date.now();
    return room;
}
function pass(roomId, side) {
    const room = getOrCreateRoom(roomId);
    room.passed[side] = true;
    room.updatedAt = Date.now();
    if (room.passed.player1 && room.passed.player2) {
        resolveRound(room);
    }
    return room;
}
function resetRoom(roomId) {
    const room = getOrCreateRoom(roomId);
    const newRoom = createEmptyRoom(roomId);
    rooms.set(roomId, newRoom);
    return newRoom;
}
function getAllRooms() {
    return Array.from(rooms.values());
}
function joinRoom(roomId, side, userId, userName) {
    const room = getOrCreateRoom(roomId);
    if (room.players[side]) {
        throw new Error("Side already taken");
    }
    const otherSide = side === "player1" ? "player2" : "player1";
    if (room.players[otherSide] === userId) {
        throw new Error("You are already on the other side");
    }
    room.players[side] = userId;
    const nicknameSide = side === "player1" ? "player1Nickname" : "player2Nickname";
    room.players[nicknameSide] = userName;
    room.updatedAt = Date.now();
    return room;
}
function leaveRoom(roomId, side, userId) {
    const room = getOrCreateRoom(roomId);
    if (room.players[side] !== userId) {
        throw new Error("You are not on this side");
    }
    room.players[side] = null;
    room.updatedAt = Date.now();
    return room;
}
function getPlayersCountInRoom(room) {
    let count = 0;
    if (room.players.player1)
        count++;
    if (room.players.player2)
        count++;
    return count;
}
function canPlayCard(roomId, side, userId) {
    const room = rooms.get(roomId);
    if (!room)
        return false;
    if (room.gameOver)
        return false;
    if (room.passed[side])
        return false;
    return room.players[side] === userId;
}
function canPass(roomId, side, userId) {
    const room = rooms.get(roomId);
    if (!room)
        return false;
    if (room.gameOver)
        return false;
    if (room.passed[side])
        return false;
    return room.players[side] === userId;
}
for (let i = 0; i < 10; i++) {
    getOrCreateRoom(i);
}
