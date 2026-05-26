import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { WorkflowNode, WorkflowEdge, ExecutionStatus } from '@agentstack/shared';

interface WorkflowState {
  socket: Socket | null;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  running: boolean;
  activeExecutionId: string | null;
  nodeStatuses: Record<string, { status: ExecutionStatus; message?: string }>;
  connectSocket: () => void;
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  addNode: (node: WorkflowNode) => void;
  updateNodeConfig: (nodeId: string, config: Record<string, any>) => void;
  executeWorkflow: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  socket: null,
  nodes: [
    { id: '1', type: 'DELAY', label: 'Delay (2s)', config: { duration: '2000' }, position: { x: 100, y: 150 } },
    { id: '2', type: 'TERMINAL_COMMAND', label: 'Trigger Echo', config: { command: 'echo "AgentStack Workflow Engine Active"' }, position: { x: 350, y: 150 } }
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2' }
  ],
  running: false,
  activeExecutionId: null,
  nodeStatuses: {},

  connectSocket: () => {
    if (get().socket) return;
    const socket = io('http://localhost:4000');
    set({ socket });

    socket.on('connect', () => {
      console.log('Workflows socket connected');
    });

    // Handle status streams
    socket.on('workflow:status', (payload: {
      executionId: string;
      nodeId: string;
      status: ExecutionStatus;
      message?: string;
    }) => {
      const { activeExecutionId, nodeStatuses } = get();
      if (payload.executionId !== activeExecutionId) return;

      const updatedStatuses = {
        ...nodeStatuses,
        [payload.nodeId]: { status: payload.status, message: payload.message }
      };

      // Check if all nodes are completed/failed to reset running state
      const isAllDone = Object.values(updatedStatuses).every(
        n => n.status === 'COMPLETED' || n.status === 'FAILED'
      );

      set({
        nodeStatuses: updatedStatuses,
        running: !isAllDone
      });
    });
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addNode: (node) => set({ nodes: [...get().nodes, node] }),

  updateNodeConfig: (nodeId, config) => {
    const updatedNodes = get().nodes.map(node => {
      if (node.id === nodeId) {
        return { ...node, config: { ...node.config, ...config } };
      }
      return node;
    });
    set({ nodes: updatedNodes });
  },

  executeWorkflow: () => {
    const { socket, nodes, edges, running } = get();
    if (!socket || running) return;

    const executionId = `exec-${Date.now()}`;
    const initialStatuses: Record<string, { status: ExecutionStatus; message?: string }> = {};
    
    nodes.forEach(n => {
      initialStatuses[n.id] = { status: 'PENDING', message: 'Waiting in queue...' };
    });

    set({
      running: true,
      activeExecutionId: executionId,
      nodeStatuses: initialStatuses
    });

    socket.emit('workflow:run', {
      executionId,
      nodes,
      edges
    });
  }
}));
