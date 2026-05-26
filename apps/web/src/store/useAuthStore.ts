import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, Workspace } from '@agentstack/shared';

interface AuthState {
  user: User | null;
  token: string | null;
  workspace: Workspace | null;
  workspaces: Workspace[];
  loading: boolean;
  error: string | null;
  login: (email: string, passwordHashOrMock: string) => Promise<boolean>;
  signup: (email: string, name: string, passwordHashOrMock: string) => Promise<boolean>;
  logout: () => Promise<void>;
  switchWorkspace: (workspaceId: string) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  workspace: null,
  workspaces: [],
  loading: true,
  error: null,

  initialize: async () => {
    set({ loading: true });
    if (isSupabaseConfigured) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const localUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 'Developer',
          createdAt: new Date(session.user.created_at)
        };
        const mockWorkspace: Workspace = {
          id: 'default-ws',
          name: 'Main Workspace',
          ownerId: session.user.id,
          createdAt: new Date()
        };
        set({
          user: localUser,
          token: session.access_token,
          workspace: mockWorkspace,
          workspaces: [mockWorkspace],
          loading: false
        });
        return;
      }
    } else {
      // Simulate local persisted mock session
      const stored = localStorage.getItem('agentstack_session');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          set({
            user: parsed.user,
            token: parsed.token,
            workspace: parsed.workspace,
            workspaces: parsed.workspaces,
            loading: false
          });
          return;
        } catch (e) {
          localStorage.removeItem('agentstack_session');
        }
      }
    }
    set({ user: null, token: null, workspace: null, workspaces: [], loading: false });
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.session) {
          const localUser: User = {
            id: data.session.user.id,
            email: data.session.user.email || '',
            name: data.session.user.user_metadata?.name || 'Developer',
            createdAt: new Date(data.session.user.created_at)
          };
          const mockWorkspace: Workspace = {
            id: 'default-ws',
            name: 'Main Workspace',
            ownerId: data.session.user.id,
            createdAt: new Date()
          };
          set({
            user: localUser,
            token: data.session.access_token,
            workspace: mockWorkspace,
            workspaces: [mockWorkspace],
            loading: false
          });
          return true;
        }
      } else {
        // Mock successful login
        const mockUserId = `mock-usr-${Math.random().toString(36).substr(2, 9)}`;
        const localUser: User = {
          id: mockUserId,
          email,
          name: email.split('@')[0],
          createdAt: new Date()
        };
        const mockWorkspace: Workspace = {
          id: 'mock-ws',
          name: `${localUser.name}'s Workspace`,
          ownerId: mockUserId,
          createdAt: new Date()
        };
        const sessionPayload = {
          user: localUser,
          token: 'mock-jwt-token-xyz',
          workspace: mockWorkspace,
          workspaces: [mockWorkspace]
        };
        localStorage.setItem('agentstack_session', JSON.stringify(sessionPayload));
        set({ ...sessionPayload, loading: false });
        return true;
      }
    } catch (err: any) {
      set({ error: err.message || 'Login failed', loading: false });
      return false;
    }
    set({ loading: false });
    return false;
  },

  signup: async (email, name, password) => {
    set({ loading: true, error: null });
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name }
          }
        });
        if (error) throw error;
        if (data.session) {
          const localUser: User = {
            id: data.session.user.id,
            email: data.session.user.email || '',
            name: name,
            createdAt: new Date(data.session.user.created_at)
          };
          const mockWorkspace: Workspace = {
            id: 'default-ws',
            name: `${name}'s Workspace`,
            ownerId: data.session.user.id,
            createdAt: new Date()
          };
          set({
            user: localUser,
            token: data.session.access_token,
            workspace: mockWorkspace,
            workspaces: [mockWorkspace],
            loading: false
          });
          return true;
        }
      } else {
        // Mock signup
        const mockUserId = `mock-usr-${Math.random().toString(36).substr(2, 9)}`;
        const localUser: User = {
          id: mockUserId,
          email,
          name,
          createdAt: new Date()
        };
        const mockWorkspace: Workspace = {
          id: 'mock-ws',
          name: `${name}'s Workspace`,
          ownerId: mockUserId,
          createdAt: new Date()
        };
        const sessionPayload = {
          user: localUser,
          token: 'mock-jwt-token-xyz',
          workspace: mockWorkspace,
          workspaces: [mockWorkspace]
        };
        localStorage.setItem('agentstack_session', JSON.stringify(sessionPayload));
        set({ ...sessionPayload, loading: false });
        return true;
      }
    } catch (err: any) {
      set({ error: err.message || 'Signup failed', loading: false });
      return false;
    }
    set({ loading: false });
    return false;
  },

  logout: async () => {
    set({ loading: true });
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('agentstack_session');
    }
    set({ user: null, token: null, workspace: null, workspaces: [], loading: false });
  },

  switchWorkspace: (workspaceId) => {
    const ws = get().workspaces.find(w => w.id === workspaceId);
    if (ws) {
      set({ workspace: ws });
    }
  }
}));
