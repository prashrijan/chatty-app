import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    setSelectedUser: (selectedUser) => {
        set({ selectedUser });
    },

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            console.log(res);
            set({ users: res.data.data });
        } catch (error) {
            console.log("Error in getUsers: ", error);
            toast.error(error.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data.data });
        } catch (error) {
            console.log("Error in getMessages: ", error);
            toast.error(error.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (data) => {
        try {
            const { selectedUser, messages } = get();

            const res = await axiosInstance.post(
                `/messages/send/${selectedUser._id}`,
                data
            );

            set({ messages: [...messages, res.data.data] });
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();

        if (!selectedUser) return;
        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            if (newMessage.senderId !== selectedUser._id) return;
            set({
                messages: [...get().messages, newMessage],
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
}));
