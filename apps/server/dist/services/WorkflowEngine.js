"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workflowEngine = void 0;
const AIService_1 = require("./AIService");
class WorkflowEngine {
    async executeWorkflow(state) {
        const { nodes, edges, onStatusUpdate } = state;
        // Simple topological sorting of nodes based on edges
        const sortedNodes = this.topologicalSort(nodes, edges);
        console.log(`Starting workflow execution ${state.executionId} with ${sortedNodes.length} nodes`);
        for (const node of sortedNodes) {
            onStatusUpdate(node.id, 'RUNNING', `Executing block ${node.label}...`);
            try {
                await this.executeNode(node, onStatusUpdate);
                onStatusUpdate(node.id, 'COMPLETED', `Successfully executed block ${node.label}`);
            }
            catch (err) {
                onStatusUpdate(node.id, 'FAILED', `Block ${node.label} failed: ${err.message}`);
                throw err;
            }
        }
    }
    async executeNode(node, onStatusUpdate) {
        const config = node.config || {};
        switch (node.type) {
            case 'DELAY': {
                const ms = parseInt(config.duration, 10) || 1000;
                await new Promise(resolve => setTimeout(resolve, ms));
                break;
            }
            case 'TERMINAL_COMMAND': {
                const cmd = config.command || 'echo "Running workflow command"';
                // Simulate execution or trigger terminal command runner
                await new Promise((resolve, reject) => {
                    // We can execute natively on local process or simulate
                    const { exec } = require('child_process');
                    exec(cmd, (error, stdout, stderr) => {
                        if (error) {
                            reject(new Error(stderr || error.message));
                        }
                        else {
                            resolve();
                        }
                    });
                });
                break;
            }
            case 'AI_PROMPT': {
                const prompt = config.prompt || 'Hello';
                const provider = config.provider || 'openai';
                const model = config.model || 'gpt-4o';
                const apiKey = config.apiKey || 'mock-key';
                await new Promise((resolve, reject) => {
                    let aiOutput = '';
                    AIService_1.aiService.streamCompletion(provider, model, prompt, apiKey, (chunk) => {
                        aiOutput += chunk;
                    }, () => {
                        console.log(`AI Node Output: ${aiOutput}`);
                        resolve();
                    }).catch(reject);
                });
                break;
            }
            case 'HTTP_REQUEST': {
                const url = config.url || 'https://httpbin.org/get';
                const method = config.method || 'GET';
                const res = await fetch(url, { method });
                if (!res.ok)
                    throw new Error(`HTTP error status: ${res.status}`);
                break;
            }
            default:
                // Fallback for other node types
                await new Promise(resolve => setTimeout(resolve, 500));
                break;
        }
    }
    topologicalSort(nodes, edges) {
        const visited = new Set();
        const temp = new Set();
        const order = [];
        const visit = (nodeId) => {
            if (temp.has(nodeId))
                throw new Error('Workflow contains execution loop dependency');
            if (!visited.has(nodeId)) {
                temp.add(nodeId);
                // Find children (nodes targeted by edges where source is current node)
                const childEdges = edges.filter(e => e.source === nodeId);
                for (const edge of childEdges) {
                    visit(edge.target);
                }
                temp.delete(nodeId);
                visited.add(nodeId);
                const nodeObj = nodes.find(n => n.id === nodeId);
                if (nodeObj)
                    order.unshift(nodeObj);
            }
        };
        for (const node of nodes) {
            if (!visited.has(node.id)) {
                visit(node.id);
            }
        }
        return order;
    }
}
exports.workflowEngine = new WorkflowEngine();
