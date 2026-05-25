"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.findUserByCredentials = findUserByCredentials;
exports.getUserByLogin = getUserByLogin;
exports.getUserById = getUserById;
exports.addWin = addWin;
exports.addLoss = addLoss;
exports.addDraw = addDraw;
exports.getUserStats = getUserStats;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const users = new Map();
async function createUser(login, password) {
    if (users.has(login)) {
        throw new Error("User already exists");
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    const passwordHash = await bcryptjs_1.default.hash(password, salt);
    const user = {
        id: crypto.randomUUID(),
        login,
        passwordHash,
        wins: 0,
        losses: 0,
        draws: 0,
        createdAt: Date.now(),
    };
    users.set(login, user);
    return user;
}
async function findUserByCredentials(login, password) {
    const user = users.get(login);
    if (!user) {
        return null;
    }
    const isValid = await bcryptjs_1.default.compare(password, user.passwordHash);
    return isValid ? user : null;
}
function getUserByLogin(login) {
    return users.get(login);
}
function getUserById(id) {
    return Array.from(users.values()).find((user) => user.id === id);
}
function addWin(userId) {
    const user = getUserById(userId);
    if (user)
        user.wins++;
}
function addLoss(userId) {
    const user = getUserById(userId);
    if (user)
        user.losses++;
}
function addDraw(userId) {
    const user = getUserById(userId);
    if (user)
        user.draws++;
}
function getUserStats(userId) {
    const user = getUserById(userId);
    if (!user)
        return null;
    return {
        login: user.login,
        wins: user.wins,
        losses: user.losses,
        draws: user.draws,
        total: user.wins + user.losses + user.draws,
    };
}
(async () => {
    try {
        await createUser("test", "123456");
        console.log("Test user created: test / 123456");
    }
    catch (e) { }
})();
