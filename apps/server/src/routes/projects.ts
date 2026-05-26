import { Router, Response } from 'express';
import { db } from '@agentstack/db';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Retrieve all projects in the active user's workspace
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'User context missing' });

    // Retrieve projects under user's workspaces
    const workspaces = await db.workspace.findMany({
      where: { ownerId: userId },
      include: { projects: true }
    });

    const projects = workspaces.flatMap(ws => ws.projects);
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create new project
router.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { name, workspaceId, repoUrl } = req.body;
  if (!name || !workspaceId) {
    return res.status(400).json({ error: 'Missing project name or workspace ID' });
  }

  try {
    const newProject = await db.project.create({
      data: {
        name,
        workspaceId,
        repoUrl
      }
    });
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

export default router;
