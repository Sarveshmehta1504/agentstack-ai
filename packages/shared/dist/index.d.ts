export interface User {
    id: string;
    email: string;
    name?: string;
    createdAt: Date;
}
export interface Workspace {
    id: string;
    name: string;
    ownerId: string;
    createdAt: Date;
}
export interface Project {
    id: string;
    name: string;
    workspaceId: string;
    repoUrl?: string;
    createdAt: Date;
}
export type NodeType = 'AI_PROMPT' | 'TERMINAL_COMMAND' | 'GITHUB_ACTION' | 'HTTP_REQUEST' | 'DELAY' | 'CONDITION' | 'SCRIPT_RUNNER' | 'FILE_OPERATION';
export interface WorkflowNode {
    id: string;
    type: NodeType;
    label: string;
    config: Record<string, any>;
    position: {
        x: number;
        y: number;
    };
}
export interface WorkflowEdge {
    id: string;
    source: string;
    target: string;
}
export interface Workflow {
    id: string;
    name: string;
    projectId: string;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    createdAt: Date;
    updatedAt: Date;
}
export type ExecutionStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
export interface WorkflowExecution {
    id: string;
    workflowId: string;
    status: ExecutionStatus;
    startedAt: Date;
    completedAt?: Date;
    logs: string[];
}
export interface AIProvider {
    id: string;
    name: string;
    apiKey?: string;
    baseUrl?: string;
    isEnabled: boolean;
}
export interface TerminalDataPayload {
    sessionId: string;
    data: string;
}
export interface WorkflowStatusUpdatePayload {
    executionId: string;
    nodeId?: string;
    status: ExecutionStatus;
    message?: string;
    timestamp: number;
}
export interface AISteamChunkPayload {
    executionId: string;
    chunk: string;
    done: boolean;
}
