import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';

interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
}

interface GithubIssue {
  id: number;
  number: number;
  title: string;
  state: string;
  created_at: string;
}

interface GithubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
}

interface GithubStore {
  token: string | null;
  repos: GithubRepo[];
  selectedRepo: GithubRepo | null;
  branches: { name: string }[];
  selectedBranch: string | null;
  issues: GithubIssue[];
  commits: GithubCommit[];
  pulls: any[];
  loading: boolean;
  error: string | null;
  setToken: (token: string) => void;
  fetchRepos: () => Promise<void>;
  selectRepo: (repo: GithubRepo) => Promise<void>;
  selectBranch: (branchName: string) => void;
}

export const useGithubStore = create<GithubStore>((set, get) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('agentstack_gh_token') : null,
  repos: [],
  selectedRepo: null,
  branches: [],
  selectedBranch: null,
  issues: [],
  commits: [],
  pulls: [],
  loading: false,
  error: null,

  setToken: (token) => {
    localStorage.setItem('agentstack_gh_token', token);
    set({ token });
    get().fetchRepos();
  },

  fetchRepos: async () => {
    const { token } = get();
    if (!token) return;
    set({ loading: true, error: null });
    try {
      const authHeader = `Bearer ${useAuthStore.getState().token || 'mock-jwt-token-xyz'}`;
      const res = await fetch('http://localhost:4000/api/github/repos', {
        headers: {
          'Authorization': authHeader,
          'x-github-token': token
        }
      });
      if (!res.ok) throw new Error('Failed to fetch repositories');
      const data = await res.json();
      set({ repos: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  selectRepo: async (repo) => {
    const { token } = get();
    if (!token) return;
    set({ selectedRepo: repo, loading: true, error: null });
    try {
      const authHeader = `Bearer ${useAuthStore.getState().token || 'mock-jwt-token-xyz'}`;
      const [owner, repoName] = repo.full_name.split('/');
      
      const [branchesRes, commitsRes, issuesRes, pullsRes] = await Promise.all([
        fetch(`http://localhost:4000/api/github/repos/${owner}/${repoName}/branches`, { headers: { 'Authorization': authHeader, 'x-github-token': token } }).then(r => r.json()).catch(() => []),
        fetch(`http://localhost:4000/api/github/repos/${owner}/${repoName}/commits`, { headers: { 'Authorization': authHeader, 'x-github-token': token } }).then(r => r.json()).catch(() => []),
        fetch(`http://localhost:4000/api/github/repos/${owner}/${repoName}/issues`, { headers: { 'Authorization': authHeader, 'x-github-token': token } }).then(r => r.json()).catch(() => []),
        fetch(`http://localhost:4000/api/github/repos/${owner}/${repoName}/pulls`, { headers: { 'Authorization': authHeader, 'x-github-token': token } }).then(r => r.json()).catch(() => [])
      ]);

      // Simple fixes for branch endpoint fallback inside localhost urls
      const branchesData = Array.isArray(branchesRes) ? branchesRes : [{ name: 'main' }];
      const commitsData = Array.isArray(commitsRes) ? commitsRes : [];
      const issuesData = Array.isArray(issuesRes) ? issuesRes : [];
      const pullsData = Array.isArray(pullsRes) ? pullsRes : [];

      set({
        branches: branchesData,
        selectedBranch: branchesData[0]?.name || 'main',
        commits: commitsData,
        issues: issuesData,
        pulls: pullsData,
        loading: false
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  selectBranch: (branchName) => {
    set({ selectedBranch: branchName });
  }
}));
