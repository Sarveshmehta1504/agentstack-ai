import React, { useState } from 'react';
import { useStore, WorkflowNode } from '@/store/useStore';
import { 
  Plus, 
  Settings, 
  Play, 
  Layers, 
  Terminal, 
  GitBranch, 
  Database, 
  Eye, 
  MousePointer, 
  FolderSync 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const WorkflowsView: React.FC = () => {
  const { nodes, edges, updateNodeStatus, addTerminalLog } = useStore();
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(nodes[1]);

  const runSingleNode = (id: string, label: string) => {
    addTerminalLog({ type: 'info', text: `Triggering execution for node [${label}]...` });
    updateNodeStatus(id, 'running');
    setTimeout(() => {
      updateNodeStatus(id, 'success');
      addTerminalLog({ type: 'success', text: `Node [${label}] execution completed successfully.` });
    }, 2500);
  };

  const getNodeIcon = (type: WorkflowNode['type']) => {
    switch (type) {
      case 'terminal': return Terminal;
      case 'agent': return Layers;
      case 'db': return Database;
      case 'github': return FolderSync;
      default: return GitBranch;
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-zinc-950/40 relative">
      {/* Visual Canvas */}
      <div className="flex-1 overflow-auto relative p-12 select-none border-r border-zinc-800/60" style={{
        backgroundImage: 'radial-gradient(circle, rgba(63, 63, 70, 0.15) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}>
        {/* Toolbar */}
        <div className="absolute top-4 left-4 bg-zinc-900/90 border border-zinc-800 backdrop-blur px-3 py-1.5 rounded-lg flex items-center gap-3 z-10">
          <button className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-200 transition-colors">
            <MousePointer className="h-4 w-4 text-indigo-400" />
          </button>
          <div className="h-4 w-px bg-zinc-800"></div>
          <button className="flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-zinc-200 px-2 py-0.5 hover:bg-zinc-800 rounded transition-all">
            <Plus className="h-3.5 w-3.5" />
            Add Node
          </button>
          <div className="h-4 w-px bg-zinc-800"></div>
          <span className="text-[10px] text-zinc-500 font-mono">Zoom: 100%</span>
        </div>

        {/* Nodes Container */}
        <div className="relative w-[800px] h-[550px] mx-auto mt-8">
          {/* Custom SVG lines for connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            {/* Draw connectors based on positions */}
            <path d="M 90,80 L 260,80" stroke="#4f46e5" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_2s_linear_infinite]" />
            <path d="M 330,80 L 460,180" stroke="#4f46e5" strokeWidth="1.5" />
            <path d="M 330,80 L 460,300" stroke="#3f3f46" strokeWidth="1.5" />
            <path d="M 530,180 L 660,180" stroke="#3f3f46" strokeWidth="1.5" />
            <path d="M 530,300 L 660,180" stroke="#3f3f46" strokeWidth="1.5" />
            <path d="M 730,180 L 860,180" stroke="#3f3f46" strokeWidth="1.5" />
          </svg>

          {/* Node 1: Start Trigger */}
          <div 
            onClick={() => setSelectedNode(nodes[0])}
            style={{ left: '10px', top: '50px' }}
            className={`absolute p-3 rounded-lg bg-zinc-900 border ${
              selectedNode?.id === 'start' ? 'border-indigo-500' : 'border-zinc-800'
            } w-44 hover:scale-[1.02] cursor-pointer transition-all z-10 shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 font-mono">Trigger</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            </div>
            <h4 className="text-xs font-semibold text-zinc-100 mt-1">Git Push event</h4>
            <p className="text-[9px] text-zinc-500 font-mono mt-1">branch: main</p>
          </div>

          {/* Node 2: Architect */}
          <div 
            onClick={() => setSelectedNode(nodes[1])}
            style={{ left: '230px', top: '50px' }}
            className={`absolute p-3 rounded-lg bg-zinc-900 border ${
              selectedNode?.id === 'arch' ? 'border-indigo-500' : 'border-zinc-800'
            } w-44 hover:scale-[1.02] cursor-pointer transition-all z-10 shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-indigo-400 font-mono font-semibold">Architect Agent</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            </div>
            <h4 className="text-xs font-semibold text-zinc-100 mt-1">Design Spec Builder</h4>
            <p className="text-[9px] text-zinc-500 font-mono mt-1">state: idle</p>
          </div>

          {/* Node 3: Codegen Agent */}
          <div 
            onClick={() => setSelectedNode(nodes[2])}
            style={{ left: '430px', top: '150px' }}
            className={`absolute p-3 rounded-lg bg-zinc-900 border ${
              selectedNode?.id === 'codegen' ? 'border-indigo-500' : 'border-zinc-800'
            } w-44 hover:scale-[1.02] cursor-pointer transition-all z-10 shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-indigo-400 font-mono font-semibold">Frontend Agent</span>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            </div>
            <h4 className="text-xs font-semibold text-zinc-100 mt-1">UI Code Writer</h4>
            <p className="text-[9px] text-zinc-500 font-mono mt-1">state: compiling...</p>
          </div>

          {/* Node 4: Backend Agent */}
          <div 
            onClick={() => setSelectedNode(nodes[3])}
            style={{ left: '430px', top: '270px' }}
            className={`absolute p-3 rounded-lg bg-zinc-900 border ${
              selectedNode?.id === 'backend' ? 'border-indigo-500' : 'border-zinc-800'
            } w-44 hover:scale-[1.02] cursor-pointer transition-all z-10 shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-indigo-400 font-mono font-semibold">Backend Agent</span>
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-600"></span>
            </div>
            <h4 className="text-xs font-semibold text-zinc-100 mt-1">API Integrator</h4>
            <p className="text-[9px] text-zinc-500 font-mono mt-1">state: pending</p>
          </div>

          {/* Node 5: Schema Sync */}
          <div 
            onClick={() => setSelectedNode(nodes[4])}
            style={{ left: '630px', top: '270px' }}
            className={`absolute p-3 rounded-lg bg-zinc-900 border ${
              selectedNode?.id === 'db' ? 'border-indigo-500' : 'border-zinc-800'
            } w-44 hover:scale-[1.02] cursor-pointer transition-all z-10 shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-400 font-mono">DB Sync</span>
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-600"></span>
            </div>
            <h4 className="text-xs font-semibold text-zinc-100 mt-1">Supabase Migrator</h4>
            <p className="text-[9px] text-zinc-500 font-mono mt-1">state: pending</p>
          </div>

          {/* Node 6: Review Agent */}
          <div 
            onClick={() => setSelectedNode(nodes[5])}
            style={{ left: '630px', top: '150px' }}
            className={`absolute p-3 rounded-lg bg-zinc-900 border ${
              selectedNode?.id === 'audit' ? 'border-indigo-500' : 'border-zinc-800'
            } w-44 hover:scale-[1.02] cursor-pointer transition-all z-10 shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-indigo-400 font-mono font-semibold">Review Agent</span>
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-600"></span>
            </div>
            <h4 className="text-xs font-semibold text-zinc-100 mt-1">Security QA Auditor</h4>
            <p className="text-[9px] text-zinc-500 font-mono mt-1">state: pending</p>
          </div>
        </div>
      </div>

      {/* Node Inspector Side Panel */}
      {selectedNode && (
        <aside className="w-80 bg-zinc-950/80 backdrop-blur p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 border-b border-zinc-900 pb-3 mb-4">Node Inspector</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-zinc-500 font-mono block uppercase">Node ID</label>
                <div className="text-xs text-zinc-300 font-mono mt-1">{selectedNode.id}</div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 font-mono block uppercase">Node Type</label>
                <div className="text-xs text-zinc-300 font-mono mt-1 capitalize">{selectedNode.type}</div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 font-mono block uppercase">Label</label>
                <div className="text-xs text-zinc-100 mt-1">{selectedNode.label}</div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 font-mono block uppercase">Execution State</label>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono capitalize ${
                    selectedNode.status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    selectedNode.status === 'running' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-zinc-800 text-zinc-400 border border-transparent'
                  }`}>
                    {selectedNode.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-900 space-y-2">
            <button 
              onClick={() => runSingleNode(selectedNode.id, selectedNode.label)}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-medium transition-colors"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Run Selected Node
            </button>
            <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-md text-xs font-medium transition-colors">
              <Settings className="h-3.5 w-3.5" />
              Configure Inputs
            </button>
          </div>
        </aside>
      )}
    </div>
  );
};
