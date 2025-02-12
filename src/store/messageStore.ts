import { create } from 'zustand';
import * as api from '../lib/api';

export interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  username: string;
}

interface MessageState {
  messages: Message[];
  fetchMessages: () => Promise<void>;
  addMessage: (content: string, userId: string) => Promise<void>;
}

export const useMessageStore = create<MessageState>((set) => ({
  messages: [],
  fetchMessages: async () => {
    const { messages } = await api.fetchMessages();
    set({ messages });
  },
  addMessage: async (content: string, userId: string) => {
    const { message } = await api.sendMessage(content, userId);
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },
}));