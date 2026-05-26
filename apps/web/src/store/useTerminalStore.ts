import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface TerminalTab {
  id: string;
  name: string;
}

interface TerminalStore {
  socket: Socket | null;
  tabs: TerminalTab[];
  activeTabId: string | null;
  connectSocket: () => void;
  createSession: (name?: string) => void;
  closeSession: (id: string) => void;
  setActiveTab: (id: string) => void;
}

export const useTerminalStore = create<TerminalStore>((set, get) => ({
  socket: null,
  tabs: [],
  activeTabId: null,

  connectSocket: () => {
    if (get().socket) return;
    const socket = io('http://localhost:4000');
    set({ socket });

    socket.on('connect', () => {
      console.log('Terminal socket connected');
    });

    // Handle incoming data if needed globally
  },

  createSession: (name) => {
    const { socket, tabs } = get();
    if (!socket) return;

    const id = `term-${Math.random().toString(36).substr(2, 9)}`;
    const newTab: TerminalTab = {
      id,
      name: name || `bash - ${tabs.length + 1}`
    };

    set({
      tabs: [...tabs, newTab],
      activeTabId: id
    });

    // Notify backend to spawn native shell PTY
    socket.emit('terminal:create', { sessionId: id });
  },

  closeSession: (id) => {
    const { socket, tabs, activeTabId } = get();
    if (socket) {
      socket.emit('terminal:kill', { sessionId: id });
    }

    const updatedTabs = tabs.filter(t => t.id !== id);
    let nextActiveTabId = activeTabId;

    if (activeTabId === id) {
      nextActiveTabId = updatedTabs[updatedTabs.length - 1]?.id || null;
    }

    set({
      tabs: updatedTabs,
      activeTabId: nextActiveTabId
    });
  },

  setActiveTab: (id) => {
    set({ activeTabId: id });
  }
}));
