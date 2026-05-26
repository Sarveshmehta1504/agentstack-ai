import React, { useState } from 'react';
import { useStore, Agent } from '@/store/useStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, ArrowRight, MessageSquare, AlertCircle } from 'lucide-react';

export const AgentsView: React.FC = () => {
  const { agents } = useStore();
  const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[0]);

  // Mock messages stream
  const messages = [
    { sender: "Architect", recipient: "Frontend Dev", text: "Create responsive workspace grid using Tailwind CSS v4." },
    { sender: "Frontend Dev", recipient: "Code Reviewer", text: "Dashboard views submitted for quality & accessibility audit." },
    { sender: "Code Reviewer", recipient: "Debugger", text: "Detected warning on line 14: check React Flow unmounted refs." },
    { sender: "Debugger", recipient: "Code Reviewer", text: "Corrected ref cleanup. Component is now stable." },
  ];

  return (
    <div className="flex-1 flex overflow-hidden bg-zinc-950/20 p-6 gap-6">
      {/* Left panel: list of Agents */}
      <div className="w-80 flex flex-col gap-4 overflow-y-auto">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Agent Configuration</h3>
        {agents.map((agent) => (
          <div
            key={agent.id}
            onClick={() => setSelectedAgent(agent)}
            className={`p-4 rounded-lg border text-left cursor-pointer transition-all ${
              selectedAgent.id === agent.id 
                ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.15)]' 
                : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-200">{agent.name}</span>
              <span className={`h-1.5 w-1.5 rounded-full ${
                agent.status === 'thinking' ? 'bg-amber-400 animate-pulse' :
                agent.status === 'executing' ? 'bg-emerald-400 animate-bounce' :
                'bg-zinc-500'
              }`}></span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono mt-1">{agent.role}</p>
            <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-400 border-t border-zinc-900 pt-3">
              <span>{agent.memoryCount} Memories</span>
              <span className="text-indigo-400 font-mono">{agent.efficiency}% efficiency</span>
            </div>
          </div>
        ))}
      </div>

      {/* Right panel: Agent workspace detail */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        {/* Top workspace card */}
        <Card className="bg-zinc-900/40 border-zinc-800/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <Brain className="h-4.5 w-4.5 text-indigo-400" />
                  {selectedAgent.name}
                </CardTitle>
                <CardDescription className="text-[11px] text-zinc-500">{selectedAgent.role}</CardDescription>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono capitalize ${
                selectedAgent.status === 'thinking' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                selectedAgent.status === 'executing' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                'bg-zinc-800 text-zinc-400 border border-transparent'
              }`}>
                {selectedAgent.status}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-[9px] text-zinc-500 block uppercase font-mono tracking-wider">Current Pipeline Task</span>
              <p className="text-xs text-zinc-300 font-mono mt-1 bg-zinc-950/80 p-3 rounded border border-zinc-800/80">
                {selectedAgent.task}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Live streams: Thinking logs + Collaboration */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
          {/* Thinking logs */}
          <Card className="bg-zinc-900/40 border-zinc-800/80 backdrop-blur-sm flex flex-col overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Reasoning Stream</CardTitle>
              <CardDescription className="text-[10px] text-zinc-500">Autonomous step-by-step thinking traces.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto font-mono text-[10px] space-y-3 px-4 pb-4">
              <div className="text-indigo-400">&gt; Loading memory checkpoints... OK</div>
              <div className="text-zinc-500">&gt; Querying: "What is the best layout architecture for a developer platform workspace?"</div>
              <div className="text-zinc-400">&gt; Semantic retrieve results: DashboardView, WorkspaceGrid, VisualOS.</div>
              <div className="text-zinc-300">&gt; Deciding layout rules: enforce 64px topbar, 256px sidebar, glassmorphic layout wrappers.</div>
              <div className="text-emerald-400">&gt; Verification successful: Layout contains correct DOM components. Outputting node payload.</div>
            </CardContent>
          </Card>

          {/* Collaboration stream */}
          <Card className="bg-zinc-900/40 border-zinc-800/80 backdrop-blur-sm flex flex-col overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Mesh Messages</CardTitle>
              <CardDescription className="text-[10px] text-zinc-500">Inter-agent messaging events.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-4 px-4 pb-4">
              {messages.map((msg, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 text-xs">
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono mb-2">
                    <span className="text-indigo-400">{msg.sender}</span>
                    <ArrowRight className="h-3 w-3 text-zinc-600" />
                    <span className="text-indigo-400">{msg.recipient}</span>
                  </div>
                  <p className="text-zinc-300 text-[11px] font-mono leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
