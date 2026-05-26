"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("@agentstack/db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Retrieve all projects in the active user's workspace
router.get('/', auth_1.requireAuth, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ error: 'User context missing' });
        // Retrieve projects under user's workspaces
        const workspaces = await db_1.db.workspace.findMany({
            where: { ownerId: userId },
            include: { projects: true }
        });
        const projects = workspaces.flatMap(ws => ws.projects);
        res.json(projects);
    }
    catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});
// Create new project
router.post('/', auth_1.requireAuth, async (req, res) => {
    const { name, workspaceId, repoUrl } = req.body;
    if (!name || !workspaceId) {
        return res.status(400).json({ error: 'Missing project name or workspace ID' });
    }
    try {
        const newProject = await db_1.db.project.create({
            data: {
                name,
                workspaceId,
                repoUrl
            }
        });
        res.status(201).json(newProject);
    }
    catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});
exports.default = router;
