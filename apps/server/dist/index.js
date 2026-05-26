"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const projects_1 = __importDefault(require("./routes/projects"));
const github_1 = __importDefault(require("./routes/github"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/projects', projects_1.default);
app.use('/api/github', github_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'agentstack-backend' });
});
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const TerminalService_1 = require("./services/TerminalService");
const AIService_1 = require("./services/AIService");
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    // Handle Terminal creation
    socket.on('terminal:create', (payload) => {
        console.log(`Spawning shell process for session: ${payload.sessionId}`);
        TerminalService_1.terminalService.createSession(payload.sessionId, payload.cols || 80, payload.rows || 24, (data) => {
            socket.emit('terminal:data', { sessionId: payload.sessionId, data });
        });
    });
    // Handle Terminal input typing
    socket.on('terminal:write', (payload) => {
        TerminalService_1.terminalService.write(payload.sessionId, payload.data);
    });
    // Handle Terminal resizing
    socket.on('terminal:resize', (payload) => {
        TerminalService_1.terminalService.resize(payload.sessionId, payload.cols, payload.rows);
    });
    // Handle Terminal process termination
    socket.on('terminal:kill', (payload) => {
        TerminalService_1.terminalService.killSession(payload.sessionId);
    });
    // Handle AI Provider Orchestration completion prompts
    socket.on('ai:prompt', async (payload) => {
        console.log(`AI completion requested via ${payload.provider} for: ${payload.executionId}`);
        await AIService_1.aiService.streamCompletion(payload.provider, payload.model, payload.prompt, payload.apiKey, (chunk) => {
            socket.emit('ai:stream', { executionId: payload.executionId, chunk, done: false });
        }, () => {
            socket.emit('ai:stream', { executionId: payload.executionId, chunk: '', done: true });
        });
    });
    // Handle Workflow run triggers
    socket.on('workflow:trigger', (workflowId) => {
        console.log(`Workflow Triggered: ${workflowId}`);
        // Simulate steps execution
        let step = 0;
        const intervals = setInterval(() => {
            if (step >= 4) {
                clearInterval(intervals);
                const donePayload = {
                    executionId: `exec-${workflowId}`,
                    status: 'COMPLETED',
                    message: 'Workflow completed execution successfully.',
                    timestamp: Date.now()
                };
                socket.emit('workflow:status', donePayload);
                return;
            }
            const updatePayload = {
                executionId: `exec-${workflowId}`,
                status: 'RUNNING',
                message: `Step ${step + 1} execution in progress...`,
                timestamp: Date.now()
            };
            socket.emit('workflow:status', updatePayload);
            step++;
        }, 1500);
    });
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});
server.listen(port, () => {
    console.log(`AgentStack server running on port ${port}`);
});
