import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from '@agentstack/db';
import { TerminalDataPayload, WorkflowStatusUpdatePayload } from '@agentstack/shared';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'agentstack-backend' });
});

// Basic Projects endpoint
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await db.project.findMany();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve projects' });
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Handle Terminal input streaming
  socket.on('terminal:input', (payload: TerminalDataPayload) => {
    console.log(`Terminal Input [${payload.sessionId}]:`, payload.data);
    // Broadcast output response simulated back (real node-pty to be added in Terminal phase)
    socket.emit('terminal:output', {
      sessionId: payload.sessionId,
      data: payload.data === '\r' ? '\r\n$ ' : payload.data
    });
  });

  // Handle Workflow run triggers
  socket.on('workflow:trigger', (workflowId: string) => {
    console.log(`Workflow Triggered: ${workflowId}`);
    
    // Simulate steps execution
    let step = 0;
    const intervals = setInterval(() => {
      if (step >= 4) {
        clearInterval(intervals);
        const donePayload: WorkflowStatusUpdatePayload = {
          executionId: `exec-${workflowId}`,
          status: 'COMPLETED',
          message: 'Workflow completed execution successfully.',
          timestamp: Date.now()
        };
        socket.emit('workflow:status', donePayload);
        return;
      }
      
      const updatePayload: WorkflowStatusUpdatePayload = {
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
