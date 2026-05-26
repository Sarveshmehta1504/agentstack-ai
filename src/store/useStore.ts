import { create } from 'zustand';

export type ActiveTab = 'dashboard' | 'workflows' | 'agents' | 'terminal' | 'memory' | 'integrations' | 'docs';

export interface TerminalLine {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'input';
  text: string;
  timestamp: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'thinking' | 'executing' | 'error';
  task: string;
  memoryCount: number;
  efficiency: number;
}

export interface WorkflowNode {
  id: string;
  type: 'agent' | 'api' | 'terminal' | 'github' | 'memory' | 'db' | 'validation';
  label: string;
  status: 'idle' | 'running' | 'success' | 'failed';
  config: Record<string, any>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

export interface MemoryNode {
  id: string;
  content: string;
  category: 'semantic' | 'episodic' | 'procedural';
  connections: string[]; // Connected memory IDs
  timestamp: string;
}

interface AppState {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  
  // Terminal state
  terminalLogs: TerminalLine[];
  addTerminalLog: (log: Omit<TerminalLine, 'id' | 'timestamp'>) => void;
  clearTerminalLogs: () => void;
  
  // Agent state
  agents: Agent[];
  updateAgentStatus: (id: string, status: Agent['status'], task?: string) => void;
  
  // Workflow system mock
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  updateNodeStatus: (id: string, status: WorkflowNode['status']) => void;
  
  // Memory system mock
  memories: MemoryNode[];
  addMemory: (memory: Omit<MemoryNode, 'id' | 'timestamp'>) => void;
  
  // Integrations state
  integrations: Record<string, boolean>;
  toggleIntegration: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
  activeTab: 'dashboard',
  setActiveTab: (activeTab) => set({ activeTab }),

  terminalLogs: [
    { id: '1', type: 'info', text: 'Initializing AgentStack Orchestrator v1.0.0...', timestamp: '18:32:01' },
    { id: '2', type: 'success', text: 'Orchestrator ready. Standing by for instructions.', timestamp: '18:32:02' },
  ],
  addTerminalLog: (log) => set((state) => ({
    terminalLogs: [
      ...state.terminalLogs,
      {
        ...log,
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      }
    ].slice(-100) // Keep last 100 lines
  })),
  clearTerminalLogs: () => set({ terminalLogs: [] }),

  agents: [
    { id: '1', name: 'Architect', role: 'System Planner', status: 'idle', task: 'Design software structure', memoryCount: 42, efficiency: 98 },
    { id: '2', name: 'Frontend Dev', role: 'UI Engineer', status: 'idle', task: 'Create modern dashboard components', memoryCount: 124, efficiency: 95 },
    { id: '3', name: 'Backend Dev', role: 'API Developer', status: 'idle', task: 'Expose endpoints for integration', memoryCount: 88, efficiency: 92 },
    { id: '4', name: 'Code Reviewer', role: 'QA Auditor', status: 'idle', task: 'Audit code structure & security patterns', memoryCount: 210, efficiency: 99 },
    { id: '5', name: 'Debugger', role: 'Error Solver', status: 'idle', task: 'Fix runtime exceptions', memoryCount: 56, efficiency: 94 },
  ],
  updateAgentStatus: (id, status, task) => set((state) => ({
    agents: state.agents.map((agent) => 
      agent.id === id ? { ...agent, status, ...(task ? { task } : {}) } : agent
    )
  })),

  nodes: [
    { id: 'start', type: 'terminal', label: 'Trigger: git push', status: 'success', config: {} },
    { id: 'arch', type: 'agent', label: 'Architect Agent', status: 'success', config: {} },
    { id: 'codegen', type: 'agent', label: 'Frontend Agent', status: 'running', config: {} },
    { id: 'backend', type: 'agent', label: 'Backend Agent', status: 'idle', config: {} },
    { id: 'db', type: 'db', label: 'Supabase Schema Sync', status: 'idle', config: {} },
    { id: 'audit', type: 'agent', label: 'Review Agent', status: 'idle', config: {} },
    { id: 'deploy', type: 'github', label: 'Deploy to Vercel', status: 'idle', config: {} },
  ],
  edges: [
    { id: 'e1', source: 'start', target: 'arch', animated: true },
    { id: 'e2', source: 'arch', target: 'codegen', animated: true },
    { id: 'e3', source: 'arch', target: 'backend', animated: true },
    { id: 'e4', source: 'backend', target: 'db', animated: false },
    { id: 'e5', source: 'codegen', target: 'audit', animated: false },
    { id: 'e6', source: 'db', target: 'audit', animated: false },
    { id: 'e7', source: 'audit', target: 'deploy', animated: false },
  ],
  updateNodeStatus: (id, status) => set((state) => ({
    nodes: state.nodes.map((node) => 
      node.id === id ? { ...node, status } : node
    )
  })),

  memories: [
    { id: 'm1', content: 'Database migration script schema loaded successfully.', category: 'semantic', connections: ['m2'], timestamp: '10 mins ago' },
    { id: 'm2', content: 'Tailwind config v4 update completed.', category: 'semantic', connections: ['m1', 'm3'], timestamp: '1 hr ago' },
    { id: 'm3', content: 'Github OAuth flow authenticated token successfully.', category: 'procedural', connections: ['m2'], timestamp: '2 hrs ago' },
    { id: 'm4', content: 'Execution of build script resolved code output.', category: 'episodic', connections: [], timestamp: '5 hrs ago' },
  ],
  addMemory: (memory) => set((state) => ({
    memories: [
      {
        ...memory,
        id: Math.random().toString(),
        timestamp: 'Just now'
      },
      ...state.memories
    ]
  })),

  integrations: {
    github: true,
    firebase: false,
    supabase: true,
    docker: false,
    vercel: true,
    slack: true
  },
  toggleIntegration: (id) => set((state) => ({
    integrations: {
      ...state.integrations,
      [id]: !state.integrations[id]
    }
  }))
}));
