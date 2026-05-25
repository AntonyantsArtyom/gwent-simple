"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const rooms_store_js_1 = require("./rooms.store.js");
const auth_store_js_1 = require("./auth.store.js");
const auth_middleware_js_1 = require("./auth.middleware.js");
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
app.post("/api/auth/register", async (req, res) => {
    try {
        const { login, password } = req.body;
        if (!login || !password) {
            res.status(400).json({ message: "Login and password are required" });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ message: "Password must be at least 6 characters" });
            return;
        }
        const user = await (0, auth_store_js_1.createUser)(login, password);
        const token = (0, auth_middleware_js_1.generateToken)(user.id, user.login);
        res.json({
            user: {
                id: user.id,
                login: user.login,
                wins: user.wins,
                losses: user.losses,
                draws: user.draws,
            },
            token,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
app.post("/api/auth/login", async (req, res) => {
    try {
        const { login, password } = req.body;
        if (!login || !password) {
            res.status(400).json({ message: "Login and password are required" });
            return;
        }
        const user = await (0, auth_store_js_1.findUserByCredentials)(login, password);
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const token = (0, auth_middleware_js_1.generateToken)(user.id, user.login);
        res.json({
            user: {
                id: user.id,
                login: user.login,
                wins: user.wins,
                losses: user.losses,
                draws: user.draws,
            },
            token,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get("/api/auth/me", auth_middleware_js_1.authMiddleware, (req, res) => {
    res.json({
        user: {
            id: req.userId,
            login: req.userLogin,
        },
    });
});
app.get("/api/auth/stats", auth_middleware_js_1.authMiddleware, (req, res) => {
    const stats = (0, auth_store_js_1.getUserStats)(req.userId);
    if (!stats) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json(stats);
});
app.get("/api/rooms", (req, res) => {
    const rooms = (0, rooms_store_js_1.getAllRooms)();
    const roomsWithStats = rooms.map((room) => ({
        ...room,
        playersCount: (0, rooms_store_js_1.getPlayersCountInRoom)(room),
    }));
    res.json({
        total: roomsWithStats.length,
        rooms: roomsWithStats,
    });
});
app.get("/api/rooms/:roomId", (req, res) => {
    const roomId = Number(req.params.roomId);
    if (!isValidRoomId(roomId)) {
        res.status(400).json({
            message: "Invalid room id",
        });
        return;
    }
    const room = (0, rooms_store_js_1.getOrCreateRoom)(roomId);
    const roomWithStats = {
        ...room,
        playersCount: (0, rooms_store_js_1.getPlayersCountInRoom)(room),
    };
    res.json(roomWithStats);
});
app.post("/api/rooms/:roomId/join", auth_middleware_js_1.authMiddleware, (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        const body = req.body;
        if (!isValidRoomId(roomId)) {
            res.status(400).json({ message: "Invalid room id" });
            return;
        }
        if (!isValidSide(body.side)) {
            res.status(400).json({ message: "Invalid side" });
            return;
        }
        const room = (0, rooms_store_js_1.joinRoom)(roomId, body.side, req.userId);
        const roomWithStats = {
            ...room,
            playersCount: (0, rooms_store_js_1.getPlayersCountInRoom)(room),
        };
        res.json(roomWithStats);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
app.post("/api/rooms/:roomId/leave", auth_middleware_js_1.authMiddleware, (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        const body = req.body;
        if (!isValidRoomId(roomId)) {
            res.status(400).json({ message: "Invalid room id" });
            return;
        }
        if (!isValidSide(body.side)) {
            res.status(400).json({ message: "Invalid side" });
            return;
        }
        const room = (0, rooms_store_js_1.leaveRoom)(roomId, body.side, req.userId);
        const roomWithStats = {
            ...room,
            playersCount: (0, rooms_store_js_1.getPlayersCountInRoom)(room),
        };
        res.json(roomWithStats);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
app.post("/api/rooms/:roomId/cards", auth_middleware_js_1.authMiddleware, (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        if (!isValidRoomId(roomId)) {
            res.status(400).json({ message: "Invalid room id" });
            return;
        }
        const body = req.body;
        if (!isValidSide(body.side)) {
            res.status(400).json({ message: "Invalid side" });
            return;
        }
        if (!isValidCard(body.card)) {
            res.status(400).json({ message: "Invalid card" });
            return;
        }
        if (!(0, rooms_store_js_1.canPlayCard)(roomId, body.side, req.userId)) {
            res.status(403).json({ message: "You are not playing on this side" });
            return;
        }
        const room = (0, rooms_store_js_1.playCard)({
            roomId,
            side: body.side,
            card: body.card,
        });
        res.json(room);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
app.post("/api/rooms/:roomId/pass", auth_middleware_js_1.authMiddleware, (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        const body = req.body;
        if (!isValidRoomId(roomId)) {
            res.status(400).json({ message: "Invalid room id" });
            return;
        }
        if (!isValidSide(body.side)) {
            res.status(400).json({ message: "Invalid side" });
            return;
        }
        if (!(0, rooms_store_js_1.canPass)(roomId, body.side, req.userId)) {
            res.status(403).json({ message: "You cannot pass right now" });
            return;
        }
        const room = (0, rooms_store_js_1.pass)(roomId, body.side);
        res.json(room);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
app.post("/api/rooms/:roomId/reset", auth_middleware_js_1.authMiddleware, (req, res) => {
    const roomId = Number(req.params.roomId);
    if (!isValidRoomId(roomId)) {
        res.status(400).json({ message: "Invalid room id" });
        return;
    }
    const room = (0, rooms_store_js_1.resetRoom)(roomId);
    res.json(room);
});
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
