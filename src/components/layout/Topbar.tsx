import React from 'react';
import { useStore } from '@/store/useStore';
import { Play, Square, RefreshCw, Cpu, Database, Network } from 'lucide-react';

export const Topbar: React.FC = () => {
  const { activeTab, updateAgentStatus, addTerminalLog } = useStore();

  const handleTriggerRun = () => {
    addTerminalLog({ type: 'info', text: 'Triggering orchestrator run...' });
    updateAgentStatus('1', 'thinking', 'Analyzing task layout...');
    setTimeout(() => {
      updateAgentStatus('1', 'executing', 'Drafting implementation details...');
      addTerminalLog({ type: 'success', text: 'Architect complete. Directing UI compilation...' });
      updateAgentStatus('2', 'thinking', 'Compiling visual layouts...');
    }, 2000);
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard System';
      case 'workflows': return 'Workflow Editor';
      case 'agents': return 'Multi-Agent Mesh';
      case 'terminal': return 'Orchestrator Logs';
      case 'memory': return 'Vector Memory Graph';
      case 'integrations': return 'Integrations Hub';
      case 'docs': return 'Developer Guide';
      default: return 'Workspace';
    }
  };

  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-6 flex items-center justify-between">
      {/* View Title */}
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-100">{getTitle()}</h2>
        <div className="h-4 w-px bg-zinc-800"></div>
        {/* Mock Metrics */}
        <div className="flex items-center gap-4 text-[11px] text-zinc-500 font-mono">
          <div className="flex items-center gap-1.5">
            <Cpu className="h-3 w-3 text-indigo-400" />
            <span>CPU: 24%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Database className="h-3 w-3 text-indigo-400" />
            <span>RAM: 4.8 / 16GB</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Network className="h-3 w-3 text-indigo-400" />
            <span>Latency: 12ms</span>
          </div>
        </div>
      </div>

      {/* Global Orchestration Actions */}
      <div className="flex items-center gap-2">
        <button 
          onClick={handleTriggerRun}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-medium shadow-[0_0_10px_rgba(79,70,229,0.3)] transition-all duration-150 active:scale-95"
        >
          <Play className="h-3 w-3 fill-current" />
          Trigger Run
        </button>
        <button 
          onClick={() => addTerminalLog({ type: 'warning', text: 'Orchestrator force-stopped by user.' })}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-md text-xs font-medium transition-all duration-150"
        >
          <Square className="h-3 w-3 fill-current" />
          Stop Run
        </button>
      </div>
    </header>
  );
};
