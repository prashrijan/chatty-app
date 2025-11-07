import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
    import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isSigningIn: false,
    isUpdatingProfile: false,
    isAuthChecking: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            console.log(res);

            set({ authUser: res.data });

            get().connectSocket();
        } catch (error) {
            console.log("Error in check auth: ", error);
            set({ authUser: null });
        } finally {
            set({ isAuthChecking: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);

            set({ authUser: res.data });
            toast.success("Account created successfully");
            await get().checkAuth();
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    signin: async (data) => {
        set({ isSigningIn: true });
        try {
            const res = await axiosInstance.post("/auth/signin", data);
            res && res.success && set({ authUser: res.data });
            toast.success("Signed in successfully");
            await get().checkAuth();

            get().connectSocket();
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningIn: false });
        }
    },

    signout: async () => {
        try {
            const res = await axiosInstance.post("/auth/signout");
            res && res.success && set({ authUser: null });

            toast.success("Logged out succesfuuly");
            await get().checkAuth();
            get().disconnectSocket();
        } catch (error) {
            console.log("Error in signout: ", error);
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async (data) => {
        console.log(data);
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put(
                "/auth/update-profilePic",
                data
            );
            res && res.success && set({ authUser: res.data });
            toast.success("Profile picture updated successfully");
        } catch (error) {
            console.log("Error in update profile: ", error);
            toast.error(error.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();

        // if not authenticated or already connected don't do anything
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser.data._id,
            },
        });

        socket.connect();

        set({ socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}));
