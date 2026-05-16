import express from "express";
import cors from "cors";

import { getAllRooms, getOrCreateRoom, playCard, resetRoom, joinRoom, leaveRoom, getPlayersCountInRoom } from "./rooms.store.js";
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

app.post("/api/rooms/:roomId/join", (req, res) => {
  const roomId = Number(req.params.roomId);
  const body = req.body as { side?: unknown };

  if (!isValidRoomId(roomId)) {
    res.status(400).json({
      message: "Invalid room id",
    });
    return;
  }

  if (!isValidSide(body.side)) {
    res.status(400).json({
      message: "Invalid side",
    });
    return;
  }

  const room = joinRoom(roomId, body.side);
  const roomWithStats = {
    ...room,
    playersCount: getPlayersCountInRoom(room),
  };

  res.json(roomWithStats);
});

app.post("/api/rooms/:roomId/leave", (req, res) => {
  const roomId = Number(req.params.roomId);
  const body = req.body as { side?: unknown };

  if (!isValidRoomId(roomId)) {
    res.status(400).json({
      message: "Invalid room id",
    });
    return;
  }

  if (!isValidSide(body.side)) {
    res.status(400).json({
      message: "Invalid side",
    });
    return;
  }

  const room = leaveRoom(roomId, body.side);
  const roomWithStats = {
    ...room,
    playersCount: getPlayersCountInRoom(room),
  };

  res.json(roomWithStats);
});

app.post("/api/rooms/:roomId/cards", (req, res) => {
  const roomId = Number(req.params.roomId);

  if (!isValidRoomId(roomId)) {
    res.status(400).json({
      message: "Invalid room id",
    });
    return;
  }

  const body = req.body as {
    side?: unknown;
    card?: unknown;
  };

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

  const room = playCard({
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

  const room = resetRoom(roomId);

  res.json(room);
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
