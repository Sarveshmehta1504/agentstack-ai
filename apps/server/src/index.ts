import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from '@agentstack/db';
import { TerminalDataPayload, WorkflowStatusUpdatePayload, WorkflowNode, WorkflowEdge } from '@agentstack/shared';

import projectsRouter from './routes/projects';
import githubRouter from './routes/github';
import workflowsRouter from './routes/workflows';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/projects', projectsRouter);
app.use('/api/github', githubRouter);
app.use('/api/workflows', workflowsRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'agentstack-backend' });
});


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

import { terminalService } from './services/TerminalService';
import { aiService } from './services/AIService';
import { workflowEngine } from './services/WorkflowEngine';

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Handle Terminal creation
  socket.on('terminal:create', (payload: { sessionId: string; cols?: number; rows?: number }) => {
    console.log(`Spawning shell process for session: ${payload.sessionId}`);
    terminalService.createSession(
      payload.sessionId, 
      payload.cols || 80, 
      payload.rows || 24, 
      (data) => {
        socket.emit('terminal:data', { sessionId: payload.sessionId, data });
      }
    );
  });

  // Handle Terminal input typing
  socket.on('terminal:write', (payload: { sessionId: string; data: string }) => {
    terminalService.write(payload.sessionId, payload.data);
  });

  // Handle Terminal resizing
  socket.on('terminal:resize', (payload: { sessionId: string; cols: number; rows: number }) => {
    terminalService.resize(payload.sessionId, payload.cols, payload.rows);
  });

  // Handle Terminal process termination
  socket.on('terminal:kill', (payload: { sessionId: string }) => {
    terminalService.killSession(payload.sessionId);
  });

  // Handle AI Provider Orchestration completion prompts
  socket.on('ai:prompt', async (payload: {
    executionId: string;
    provider: string;
    model: string;
    prompt: string;
    apiKey?: string;
  }) => {
    console.log(`AI completion requested via ${payload.provider} for: ${payload.executionId}`);
    await aiService.streamCompletion(
      payload.provider,
      payload.model,
      payload.prompt,
      payload.apiKey,
      (chunk) => {
        socket.emit('ai:stream', { executionId: payload.executionId, chunk, done: false });
      },
      () => {
        socket.emit('ai:stream', { executionId: payload.executionId, chunk: '', done: true });
      }
    );
  });

  // Handle Workflow run triggers
  socket.on('workflow:run', async (payload: {
    executionId: string;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
  }) => {
    console.log(`Executing Workflow Engine pipeline: ${payload.executionId}`);
    try {
      await workflowEngine.executeWorkflow({
        executionId: payload.executionId,
        nodes: payload.nodes,
        edges: payload.edges,
        onStatusUpdate: (nodeId, status, message) => {
          socket.emit('workflow:status', {
            executionId: payload.executionId,
            nodeId,
            status,
            message,
            timestamp: Date.now()
          });
        }
      });
    } catch (err: any) {
      console.error('Workflow engine execution error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`AgentStack server running on port ${port}`);
});
