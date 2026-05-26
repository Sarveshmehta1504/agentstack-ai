import { Router, Response } from 'express';
import { Octokit } from '@octokit/rest';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Helper to get Octokit client or return null if token is mock/missing
const getOctokit = (req: AuthenticatedRequest): Octokit | null => {
  const token = req.headers['x-github-token'] as string;
  if (!token || token === 'mock-token' || token.startsWith('mock-')) {
    return null;
  }
  return new Octokit({ auth: token });
};

// Retrieve repositories
router.get('/repos', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const octokit = getOctokit(req);
    if (!octokit) {
      // Return mock repositories list
      return res.json([
        { id: 101, name: 'agentstack-ai', full_name: 'Sarveshmehta1504/agentstack-ai', description: 'Open-source developer workflow orchestration platform.' },
        { id: 102, name: 'hyper-agent', full_name: 'Sarveshmehta1504/hyper-agent', description: 'Next-gen cognitive multi-agent meshes.' },
        { id: 103, name: 'react-flow-nodes', full_name: 'Sarveshmehta1504/react-flow-nodes', description: 'Custom reactive graph node extensions.' }
      ]);
    }

    const { data } = await octokit.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 50
    });
    res.json(data.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description
    })));
  } catch (error: any) {
    console.error('GitHub API error:', error);
    res.status(500).json({ error: error.message || 'GitHub communication failed' });
  }
});

// Retrieve repository branches
router.get('/repos/:owner/:repo/branches', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { owner, repo } = req.params;
  try {
    const octokit = getOctokit(req);
    if (!octokit) {
      return res.json([
        { name: 'main' },
        { name: 'develop' },
        { name: 'feature/auth-supabase' }
      ]);
    }
    const { data } = await octokit.repos.listBranches({ owner, repo });
    res.json(data.map(b => ({ name: b.name })));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve repository commits
router.get('/repos/:owner/:repo/commits', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { owner, repo } = req.params;
  try {
    const octokit = getOctokit(req);
    if (!octokit) {
      return res.json([
        { sha: 'sha1', commit: { message: 'feat: setup turborepo structure', author: { name: 'sarveshmehta', date: new Date().toISOString() } } },
        { sha: 'sha2', commit: { message: 'fix: compile error on Topbar views', author: { name: 'sarveshmehta', date: new Date().toISOString() } } }
      ]);
    }
    const { data } = await octokit.repos.listCommits({ owner, repo, per_page: 20 });
    res.json(data.map(c => ({
      sha: c.sha,
      commit: {
        message: c.commit.message,
        author: {
          name: c.commit.author?.name || 'anonymous',
          date: c.commit.author?.date
        }
      }
    })));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve repository issues
router.get('/repos/:owner/:repo/issues', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { owner, repo } = req.params;
  try {
    const octokit = getOctokit(req);
    if (!octokit) {
      return res.json([
        { id: 1, number: 12, title: 'Hook up PostgreSQL DB connection pooling', state: 'open', created_at: new Date().toISOString() },
        { id: 2, number: 45, title: 'Fix xterm terminal viewport wrapping bugs', state: 'closed', created_at: new Date().toISOString() }
      ]);
    }
    const { data } = await octokit.issues.listForRepo({ owner, repo, state: 'all', per_page: 30 });
    res.json(data.map(i => ({
      id: i.id,
      number: i.number,
      title: i.title,
      state: i.state,
      created_at: i.created_at
    })));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve repository pull requests
router.get('/repos/:owner/:repo/pulls', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { owner, repo } = req.params;
  try {
    const octokit = getOctokit(req);
    if (!octokit) {
      return res.json([
        { id: 10, number: 4, title: 'Draft: Support AI stream provider routing', state: 'open', created_at: new Date().toISOString() }
      ]);
    }
    const { data } = await octokit.pulls.list({ owner, repo, state: 'all', per_page: 20 });
    res.json(data.map(p => ({
      id: p.id,
      number: p.number,
      title: p.title,
      state: p.state,
      created_at: p.created_at
    })));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
