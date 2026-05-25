"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_store_js_1 = require("./auth.store.js");
const JWT_SECRET = "your-secret-key-change-in-production";
function generateToken(userId, login) {
    return jsonwebtoken_1.default.sign({ userId, login }, JWT_SECRET, { expiresIn: "24h" });
}
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: "No token provided" });
        return;
    }
    const parts = authHeader.split(" ");
    if (parts.length !== 2) {
        res.status(401).json({ message: "Token error" });
        return;
    }
    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
        res.status(401).json({ message: "Token malformatted" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = (0, auth_store_js_1.getUserById)(decoded.userId);
        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }
        req.userId = decoded.userId;
        req.userLogin = decoded.login;
        return next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token" });
        return;
    }
}
