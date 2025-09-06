import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: false,
    isCheckingAuth: true,

    register: async (username, email, password) => {
        set({ isLoading: true });
        try {
            const response = await fetch("https://bookworm-5n78.onrender.com/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password })
            })
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }
            await AsyncStorage.setItem("token", data.token);
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            set({ user: data.user, token: data.token, isLoading: false });

            return { success: true}
        } catch (error) {
            set({ isLoading: false });
            return { success: false, err: error.message };
        }
    },
    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await fetch("https://bookworm-5n78.onrender.com/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            })
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }
            await AsyncStorage.setItem("token", data.token);
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            set({ user: data.user, token: data.token, isLoading: false });
            return { success: true}
        } catch (error) {
            set({ isLoading: false });
            return { success: false, err: error.message };
        }
    },
    
    checkAuth: async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const userJson = await AsyncStorage.getItem("user");
            const user = userJson ? JSON.parse(userJson) : null;
            set({ user, token });
        } catch (error) {
            console.log("Auth check failed:", error);
        }finally {
            set({ isCheckingAuth: false });
        }
    },
    logout: async () => {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user");
            set({ user: null, token: null });
    }
}))