import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, Copy, BookOpen } from 'lucide-react';

export const DocsView: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-950/20">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Developer Documentation</h3>
          <p className="text-[11px] text-zinc-500 mt-1">Learn how to orchestrate multi-agent meshes using AgentStack.</p>
        </div>

        {/* Quickstart Section */}
        <Card className="bg-zinc-900/40 border-zinc-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xs font-bold text-zinc-200 flex items-center gap-2">
              <Terminal className="h-4.5 w-4.5 text-indigo-400" />
              1. Setup CLI Quickstart
            </CardTitle>
            <CardDescription className="text-[10px] text-zinc-500 font-mono">
              Initialize AgentStack in your project repository directory.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-zinc-300">Run the initialization command via npm or npx:</p>
            <div className="p-3 bg-zinc-950/80 rounded border border-zinc-800/80 font-mono text-xs text-indigo-400 flex items-center justify-between">
              <span>npx agentstack-core init</span>
              <Copy className="h-3.5 w-3.5 text-zinc-600 hover:text-zinc-300 cursor-pointer" />
            </div>
            <p className="text-xs text-zinc-300">This scaffolds the configuration folders, schema validations, and registers local agent capabilities.</p>
          </CardContent>
        </Card>

        {/* Orchestrator Configuration */}
        <Card className="bg-zinc-900/40 border-zinc-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xs font-bold text-zinc-200 flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5 text-indigo-400" />
              2. Declaring Agent Meshes
            </CardTitle>
            <CardDescription className="text-[10px] text-zinc-500 font-mono">
              Configure code-level agents inside your `agentstack.json` file.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-zinc-300">Define agent responsibilities, memory stores, and workspace permissions:</p>
            <pre className="p-3 bg-zinc-950/80 rounded border border-zinc-800/80 font-mono text-[10px] text-zinc-400 overflow-x-auto leading-relaxed">
{`{
  "agents": [
    {
      "name": "Architect",
      "role": "System Planner",
      "memory": "vector-semantic",
      "tools": ["fs_read", "github_issues"]
    },
    {
      "name": "Frontend Dev",
      "role": "UI Engineer",
      "memory": "vector-semantic",
      "tools": ["fs_write", "npm_cli"]
    }
  ]
}`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
