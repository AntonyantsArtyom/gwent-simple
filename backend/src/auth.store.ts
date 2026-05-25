import bcrypt from "bcryptjs";

export interface User {
  id: string;
  login: string;
  passwordHash: string;
  wins: number;
  losses: number;
  draws: number;
  createdAt: number;
}

const users = new Map<string, User>();

export async function createUser(login: string, password: string): Promise<User> {
  if (users.has(login)) {
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user: User = {
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

export async function findUserByCredentials(login: string, password: string): Promise<User | null> {
  const user = users.get(login);

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  return isValid ? user : null;
}

export function getUserByLogin(login: string): User | undefined {
  return users.get(login);
}

export function getUserById(id: string): User | undefined {
  return Array.from(users.values()).find((user) => user.id === id);
}

export function addWin(userId: string): void {
  const user = getUserById(userId);
  if (user) user.wins++;
}

export function addLoss(userId: string): void {
  const user = getUserById(userId);
  if (user) user.losses++;
}

export function addDraw(userId: string): void {
  const user = getUserById(userId);
  if (user) user.draws++;
}

export function getUserStats(userId: string) {
  const user = getUserById(userId);
  if (!user) return null;

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
  } catch (e) {}
})();
