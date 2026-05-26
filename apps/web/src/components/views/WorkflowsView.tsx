'use client';

import React, { useEffect, useState } from 'react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { Play, Plus, Sliders, Activity, Terminal, Brain, Clock, Globe, Trash2 } from 'lucide-react';
import { WorkflowNode, NodeType } from '@agentstack/shared';

export const WorkflowsView: React.FC = () => {
  const {
    nodes,
    edges,
    running,
    nodeStatuses,
    connectSocket,
    addNode,
    setNodes,
    setEdges,
    updateNodeConfig,
    executeWorkflow
  } = useWorkflowStore();

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    connectSocket();
  }, [connectSocket]);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const handleAddNode = (type: NodeType) => {
    const id = `node-${Date.now()}`;
    let label = '';
    let config = {};

    switch (type) {
      case 'DELAY':
        label = 'Delay';
        config = { duration: '2000' };
        break;
      case 'TERMINAL_COMMAND':
        label = 'Terminal Command';
        config = { command: 'echo "AgentStack"' };
        break;
      case 'AI_PROMPT':
        label = 'AI Prompt';
        config = { prompt: 'Why is modular design essential?', provider: 'openai', model: 'gpt-4o' };
        break;
      case 'HTTP_REQUEST':
        label = 'HTTP Fetch';
        config = { url: 'https://httpbin.org/get', method: 'GET' };
        break;
      default:
        label = 'Custom Block';
    }

    const newNode: WorkflowNode = {
      id,
      type,
      label,
      config,
      position: { x: 100, y: 150 }
    };
    addNode(newNode);
    setSelectedNodeId(id);

    // Auto-create edge link if there is a previous node
    if (nodes.length > 0) {
      const prevNode = nodes[nodes.length - 1];
      const newEdge = {
        id: `edge-${prevNode.id}-${id}`,
        source: prevNode.id,
        target: id
      };
      setEdges([...edges, newEdge]);
    }
  };

  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case 'DELAY': return <Clock className="w-4 h-4 text-amber-400" />;
      case 'TERMINAL_COMMAND': return <Terminal className="w-4 h-4 text-emerald-400" />;
      case 'AI_PROMPT': return <Brain className="w-4 h-4 text-purple-400" />;
      case 'HTTP_REQUEST': return <Globe className="w-4 h-4 text-sky-400" />;
      default: return <Sliders className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-zinc-950/20 p-6 gap-6">
      {/* Node Catalog Sidebar */}
      <div className="w-64 flex flex-col gap-4 shrink-0 overflow-y-auto">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Node Catalog</h3>
          <p className="text-[10px] text-zinc-500 mt-1">Insert execution steps into your active pipeline.</p>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => handleAddNode('DELAY')}
            className="w-full flex items-center gap-3 p-3 bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 rounded-lg text-left text-xs text-zinc-300 cursor-pointer transition-colors"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <div>
              <div className="font-semibold text-xs">Delay Sleep</div>
              <div className="text-[9px] text-zinc-500 mt-0.5">Pause for milliseconds</div>
            </div>
          </button>

          <button
            onClick={() => handleAddNode('TERMINAL_COMMAND')}
            className="w-full flex items-center gap-3 p-3 bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 rounded-lg text-left text-xs text-zinc-300 cursor-pointer transition-colors"
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="font-semibold text-xs">Terminal Script</div>
              <div className="text-[9px] text-zinc-500 mt-0.5">Execute shell process</div>
            </div>
          </button>

          <button
            onClick={() => handleAddNode('AI_PROMPT')}
            className="w-full flex items-center gap-3 p-3 bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 rounded-lg text-left text-xs text-zinc-300 cursor-pointer transition-colors"
          >
            <Brain className="w-4 h-4 text-purple-400" />
            <div>
              <div className="font-semibold text-xs">AI Completion</div>
              <div className="text-[9px] text-zinc-500 mt-0.5">Query LLM provider</div>
            </div>
          </button>

          <button
            onClick={() => handleAddNode('HTTP_REQUEST')}
            className="w-full flex items-center gap-3 p-3 bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 rounded-lg text-left text-xs text-zinc-300 cursor-pointer transition-colors"
          >
            <Globe className="w-4 h-4 text-sky-400" />
            <div>
              <div className="font-semibold text-xs">HTTP Fetch</div>
              <div className="text-[9px] text-zinc-500 mt-0.5">Request URL endpoint</div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Canvas View */}
      <div className="flex-1 flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl relative">
        {/* Graph control header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 bg-zinc-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-bold text-white">Pipeline Canvas</h4>
          </div>
          <button
            onClick={executeWorkflow}
            disabled={running}
            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer border-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {running ? 'Running...' : 'Execute'}
          </button>
        </div>

        {/* Display nodes as custom blocks in connection path list */}
        <div className="flex-1 p-8 overflow-y-auto space-y-6">
          {nodes.map((node, index) => {
            const isSelected = node.id === selectedNodeId;
            const statusInfo = nodeStatuses[node.id];
            
            return (
              <div key={node.id} className="relative flex flex-col items-center">
                {/* Connection line helper */}
                {index > 0 && (
                  <div className="absolute -top-6 w-0.5 h-6 bg-zinc-800 border-dashed" />
                )}

                <div
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`w-full max-w-lg p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-purple-600/10 border-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.1)]'
                      : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                      {getNodeIcon(node.type)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{node.label}</div>
                      <div className="text-[9px] text-zinc-500 font-mono mt-0.5">{node.type}</div>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  {statusInfo ? (
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-semibold uppercase ${
                        statusInfo.status === 'RUNNING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse' :
                        statusInfo.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        statusInfo.status === 'FAILED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-zinc-850 text-zinc-500 border border-transparent'
                      }`}>
                        {statusInfo.status}
                      </span>
                      {statusInfo.message && (
                        <span className="text-[9px] text-zinc-550 truncate max-w-[150px]">{statusInfo.message}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[9px] text-zinc-600 font-mono">Ready</span>
                  )}
                </div>
              </div>
            );
          })}

          {nodes.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-20 text-zinc-650">
              <Sliders className="w-10 h-10 text-zinc-800 mb-3" />
              <h5 className="font-semibold text-zinc-400 text-xs">Empty Graph Canvas</h5>
              <p className="text-[10px] text-zinc-600 mt-1 max-w-xs">
                Select a block from the catalog column on the left to scaffold your workflow script.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Inspector Panel */}
      {selectedNode && (
        <div className="w-80 bg-zinc-950 border border-zinc-800 rounded-xl p-4 shrink-0 flex flex-col h-full overflow-hidden">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3 mb-4">
            <h4 className="text-xs font-bold text-zinc-300">Block Inspector</h4>
            <span className="text-[9px] text-zinc-500 uppercase font-mono">{selectedNode.type}</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            <div>
              <label className="text-[9px] text-zinc-500 uppercase font-mono tracking-wider block mb-1">Display Label</label>
              <input
                type="text"
                value={selectedNode.label}
                onChange={(e) => {
                  const updated = nodes.map(n => n.id === selectedNode.id ? { ...n, label: e.target.value } : n);
                  setNodes(updated);
                }}
                className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none"
              />
            </div>

            {selectedNode.type === 'DELAY' && (
              <div>
                <label className="text-[9px] text-zinc-500 uppercase font-mono tracking-wider block mb-1">Duration (ms)</label>
                <input
                  type="number"
                  value={selectedNode.config.duration || '1000'}
                  onChange={(e) => updateNodeConfig(selectedNode.id, { duration: e.target.value })}
                  className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none"
                />
              </div>
            )}

            {selectedNode.type === 'TERMINAL_COMMAND' && (
              <div>
                <label className="text-[9px] text-zinc-500 uppercase font-mono tracking-wider block mb-1">Shell Command</label>
                <textarea
                  value={selectedNode.config.command || ''}
                  onChange={(e) => updateNodeConfig(selectedNode.id, { command: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white font-mono focus:outline-none resize-none"
                  placeholder="e.g. echo 'AgentStack'"
                />
              </div>
            )}

            {selectedNode.type === 'AI_PROMPT' && (
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] text-zinc-500 uppercase font-mono tracking-wider block mb-1">Prompt Query</label>
                  <textarea
                    value={selectedNode.config.prompt || ''}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { prompt: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none resize-none"
                    placeholder="Describe prompt query tasks..."
                  />
                </div>

                <div>
                  <label className="text-[9px] text-zinc-500 uppercase font-mono tracking-wider block mb-1">AI Provider</label>
                  <select
                    value={selectedNode.config.provider || 'openai'}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { provider: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-300 focus:outline-none"
                  >
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic</option>
                    <option value="gemini">Gemini</option>
                    <option value="ollama">Ollama (Local)</option>
                  </select>
                </div>
              </div>
            )}

            {selectedNode.type === 'HTTP_REQUEST' && (
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] text-zinc-500 uppercase font-mono tracking-wider block mb-1">URL Endpoint</label>
                  <input
                    type="text"
                    value={selectedNode.config.url || ''}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { url: e.target.value })}
                    className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none"
                    placeholder="https://api.com"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-zinc-500 uppercase font-mono tracking-wider block mb-1">HTTP Method</label>
                  <select
                    value={selectedNode.config.method || 'GET'}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { method: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-300 focus:outline-none"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              const filtered = nodes.filter(n => n.id !== selectedNode.id);
              const filteredEdges = edges.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id);
              setNodes(filtered);
              setEdges(filteredEdges);
              setSelectedNodeId(null);
            }}
            className="w-full mt-4 py-2 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-lg text-xs font-semibold transition-all border border-red-500/20 cursor-pointer"
          >
            Delete Node Block
          </button>
        </div>
      )}
    </div>
  );
};
