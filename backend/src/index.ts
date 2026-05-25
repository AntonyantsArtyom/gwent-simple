import express from "express";
import cors from "cors";
import { getAllRooms, getOrCreateRoom, playCard, resetRoom, joinRoom, leaveRoom, getPlayersCountInRoom, canPlayCard } from "./rooms.store.js";
import { createUser, findUserByCredentials } from "./auth.store.js";
import { generateToken, authMiddleware, AuthRequest } from "./auth.middleware.js";
import type { Card, PlayerSide } from "./types.js";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3001;

function isValidRoomId(roomId: number): boolean {
  return Number.isInteger(roomId) && roomId >= 0;
}

function isValidSide(side: unknown): side is PlayerSide {
  return side === "player1" || side === "player2";
}

function isValidCard(card: unknown): card is Card {
  if (!card || typeof card !== "object") {
    return false;
  }

  const value = card as Card;

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

    const user = await createUser(login, password);
    const token = generateToken(user.id, user.login);

    res.json({
      user: {
        id: user.id,
        login: user.login,
      },
      token,
    });
  } catch (error: any) {
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

    const user = await findUserByCredentials(login, password);

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken(user.id, user.login);

    res.json({
      user: {
        id: user.id,
        login: user.login,
      },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/auth/me", authMiddleware, (req: AuthRequest, res) => {
  res.json({
    user: {
      id: req.userId,
      login: req.userLogin,
    },
  });
});

app.get("/api/rooms", (req, res) => {
  const rooms = getAllRooms();

  const roomsWithStats = rooms.map((room) => ({
    ...room,
    playersCount: getPlayersCountInRoom(room),
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

  const room = getOrCreateRoom(roomId);
  const roomWithStats = {
    ...room,
    playersCount: getPlayersCountInRoom(room),
  };

  res.json(roomWithStats);
});

app.post("/api/rooms/:roomId/join", authMiddleware, (req: AuthRequest, res) => {
  try {
    const roomId = Number(req.params.roomId);
    const body = req.body as { side?: unknown };

    if (!isValidRoomId(roomId)) {
      res.status(400).json({ message: "Invalid room id" });
      return;
    }

    if (!isValidSide(body.side)) {
      res.status(400).json({ message: "Invalid side" });
      return;
    }

    const room = joinRoom(roomId, body.side, req.userId!);
    const roomWithStats = {
      ...room,
      playersCount: getPlayersCountInRoom(room),
    };

    res.json(roomWithStats);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/rooms/:roomId/leave", authMiddleware, (req: AuthRequest, res) => {
  try {
    const roomId = Number(req.params.roomId);
    const body = req.body as { side?: unknown };

    if (!isValidRoomId(roomId)) {
      res.status(400).json({ message: "Invalid room id" });
      return;
    }

    if (!isValidSide(body.side)) {
      res.status(400).json({ message: "Invalid side" });
      return;
    }

    const room = leaveRoom(roomId, body.side, req.userId!);
    const roomWithStats = {
      ...room,
      playersCount: getPlayersCountInRoom(room),
    };

    res.json(roomWithStats);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/rooms/:roomId/cards", authMiddleware, (req: AuthRequest, res) => {
  try {
    const roomId = Number(req.params.roomId);

    if (!isValidRoomId(roomId)) {
      res.status(400).json({ message: "Invalid room id" });
      return;
    }

    const body = req.body as {
      side?: unknown;
      card?: unknown;
    };

    if (!isValidSide(body.side)) {
      res.status(400).json({ message: "Invalid side" });
      return;
    }

    if (!isValidCard(body.card)) {
      res.status(400).json({ message: "Invalid card" });
      return;
    }

    if (!canPlayCard(roomId, body.side, req.userId!)) {
      res.status(403).json({ message: "You are not playing on this side" });
      return;
    }

    const room = playCard({
      roomId,
      side: body.side,
      card: body.card,
    });

    res.json(room);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/rooms/:roomId/reset", authMiddleware, (req: AuthRequest, res) => {
  const roomId = Number(req.params.roomId);

  if (!isValidRoomId(roomId)) {
    res.status(400).json({ message: "Invalid room id" });
    return;
  }

  const room = resetRoom(roomId);
  res.json(room);
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
