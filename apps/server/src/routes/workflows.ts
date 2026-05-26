import { Router, Response } from 'express';
import { db } from '@agentstack/db';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Retrieve all workflows for a project
router.get('/:projectId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { projectId } = req.params;
  try {
    const workflows = await db.workflow.findMany({
      where: { projectId }
    });
    res.json(workflows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create/Save workflow
router.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { id, name, projectId, nodes, edges } = req.body;
  if (!name || !projectId) {
    return res.status(400).json({ error: 'Missing name or projectId parameter' });
  }

  try {
    const dataPayload = {
      name,
      projectId,
      nodes: nodes || [],
      edges: edges || []
    };

    const workflow = await db.workflow.upsert({
      where: { id: id || '' },
      update: dataPayload,
      create: { id, ...dataPayload }
    });
    res.json(workflow);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
