"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("@agentstack/db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Retrieve all workflows for a project
router.get('/:projectId', auth_1.requireAuth, async (req, res) => {
    const { projectId } = req.params;
    try {
        const workflows = await db_1.db.workflow.findMany({
            where: { projectId }
        });
        res.json(workflows);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Create/Save workflow
router.post('/', auth_1.requireAuth, async (req, res) => {
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
        const workflow = await db_1.db.workflow.upsert({
            where: { id: id || '' },
            update: dataPayload,
            create: { id, ...dataPayload }
        });
        res.json(workflow);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
