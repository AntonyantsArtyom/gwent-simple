import { create } from "zustand";
import { api } from "../../../shared/api";

interface User {
  id: string;
  login: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (login: string, password: string) => Promise<void>;
  register: (login: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  token: localStorage.getItem("token"),
  isLoading: false,
  error: null,

  login: async (login: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/auth/login", { login, password });
      localStorage.setItem("token", data.token);
      set({ user: data.user, token: data.token, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  register: async (login: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/auth/register", { login, password });
      localStorage.setItem("token", data.token);
      set({ user: data.user, token: data.token, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  checkAuth: async () => {
    const token = get().token;
    if (!token) return;

    set({ isLoading: true });
    try {
      const { data } = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: data.user, isLoading: false });
    } catch (error) {
      localStorage.removeItem("token");
      set({ user: null, token: null, isLoading: false });
    }
  },
}));
