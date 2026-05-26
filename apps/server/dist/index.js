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
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    // Handle Terminal input streaming
    socket.on('terminal:input', (payload) => {
        console.log(`Terminal Input [${payload.sessionId}]:`, payload.data);
        // Broadcast output response simulated back (real node-pty to be added in Terminal phase)
        socket.emit('terminal:output', {
            sessionId: payload.sessionId,
            data: payload.data === '\r' ? '\r\n$ ' : payload.data
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
