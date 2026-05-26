import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface AIStore {
  socket: Socket | null;
  provider: string; // 'openai' | 'anthropic' | 'gemini' | 'ollama'
  model: string;
  apiKey: string;
  messages: ChatMessage[];
  streamingText: string;
  loading: boolean;
  connectSocket: () => void;
  setProvider: (provider: string) => void;
  setModel: (model: string) => void;
  setApiKey: (key: string) => void;
  sendMessage: (text: string) => Promise<void>;
}

export const useAIStore = create<AIStore>((set, get) => ({
  socket: null,
  provider: 'openai',
  model: 'gpt-4o',
  apiKey: typeof window !== 'undefined' ? localStorage.getItem('agentstack_ai_key') || '' : '',
  messages: [],
  streamingText: '',
  loading: false,

  connectSocket: () => {
    if (get().socket) return;
    const socket = io('http://localhost:4000');
    set({ socket });

    socket.on('connect', () => {
      console.log('AI socket connected');
    });

    // Handle stream response chunks
    socket.on('ai:stream', (payload: { executionId: string; chunk: string; done: boolean }) => {
      if (payload.done) {
        const { messages, streamingText } = get();
        const newMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: streamingText,
          timestamp: Date.now()
        };
        set({
          messages: [...messages, newMessage],
          streamingText: '',
          loading: false
        });
      } else {
        set({ streamingText: get().streamingText + payload.chunk });
      }
    });
  },

  setProvider: (provider) => {
    // Pick default model
    let model = 'gpt-4o';
    if (provider === 'anthropic') model = 'claude-3-5-sonnet-latest';
    else if (provider === 'gemini') model = 'gemini-1.5-flash';
    else if (provider === 'ollama') model = 'llama3';
    
    set({ provider, model });
  },

  setModel: (model) => set({ model }),

  setApiKey: (key) => {
    localStorage.setItem('agentstack_ai_key', key);
    set({ apiKey: key });
  },

  sendMessage: async (text) => {
    const { socket, provider, model, apiKey, messages } = get();
    if (!socket || !text.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    set({
      messages: [...messages, userMessage],
      loading: true,
      streamingText: ''
    });

    // Emit prompt request over websocket
    socket.emit('ai:prompt', {
      executionId: `exec-${Date.now()}`,
      provider,
      model,
      prompt: text,
      apiKey
    });
  }
}));
