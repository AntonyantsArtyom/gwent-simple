"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const rooms_store_js_1 = require("./rooms.store.js");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = 3001;
function isValidRoomId(roomId) {
    return Number.isInteger(roomId) && roomId >= 0;
}
function isValidSide(side) {
    return side === "player1" || side === "player2";
}
function isValidCard(card) {
    if (!card || typeof card !== "object") {
        return false;
    }
    const value = card;
    return typeof value.id === "string" && typeof value.name === "string" && typeof value.power === "number" && ["melee", "ranged", "siege"].includes(value.row);
}
app.get("/api/rooms/:roomId", (req, res) => {
    const roomId = Number(req.params.roomId);
    if (!isValidRoomId(roomId)) {
        res.status(400).json({
            message: "Invalid room id",
        });
        return;
    }
    const room = (0, rooms_store_js_1.getOrCreateRoom)(roomId);
    res.json(room);
});
app.post("/api/rooms/:roomId/cards", (req, res) => {
    const roomId = Number(req.params.roomId);
    if (!isValidRoomId(roomId)) {
        res.status(400).json({
            message: "Invalid room id",
        });
        return;
    }
    const body = req.body;
    if (!isValidSide(body.side)) {
        res.status(400).json({
            message: "Invalid side",
        });
        return;
    }
    if (!isValidCard(body.card)) {
        res.status(400).json({
            message: "Invalid card",
        });
        return;
    }
    const room = (0, rooms_store_js_1.playCard)({
        roomId,
        side: body.side,
        card: body.card,
    });
    res.json(room);
});
app.post("/api/rooms/:roomId/reset", (req, res) => {
    const roomId = Number(req.params.roomId);
    if (!isValidRoomId(roomId)) {
        res.status(400).json({
            message: "Invalid room id",
        });
        return;
    }
    const room = (0, rooms_store_js_1.resetRoom)(roomId);
    res.json(room);
});
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
