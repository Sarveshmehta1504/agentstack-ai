import React from 'react';
import { useStore } from '@/store/useStore';
import { 
  Play, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Database, 
  TrendingUp, 
  Settings, 
  Terminal as TerminalIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const DashboardView: React.FC = () => {
  const { agents, terminalLogs } = useStore();

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-950/20">
      {/* Upper metrics widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Total Agents", value: agents.length, desc: "5 active configurations", icon: Activity, color: "text-indigo-400" },
          { title: "Tokens Processed", value: "248.6k", desc: "+12.4% vs last hour", icon: TrendingUp, color: "text-emerald-400" },
          { title: "Active Pipelines", value: "2", desc: "Running smoothly", icon: CheckCircle2, color: "text-sky-400" },
          { title: "Memory Records", value: "462", desc: "Vector store connected", icon: Database, color: "text-amber-400" },
        ].map((metric, idx) => (
          <Card key={idx} className="bg-zinc-900/40 border-zinc-800/80 backdrop-blur-sm relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">{metric.title}</span>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-100">{metric.value}</div>
              <p className="text-[10px] text-zinc-500 mt-1">{metric.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main dashboard body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Middle Column: Active Agents & Metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Agents Grid */}
          <Card className="bg-zinc-900/40 border-zinc-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Active Agent Mesh</CardTitle>
              <CardDescription className="text-[11px] text-zinc-500">Autonomous developers cooperating in local workspaces.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map((agent) => (
                <div 
                  key={agent.id} 
                  className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800/80 hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-[40px] rounded-full group-hover:bg-indigo-500/10 transition-all duration-300"></div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-xs text-zinc-200">{agent.name}</h4>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{agent.role}</p>
                    </div>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono ${
                      agent.status === 'thinking' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      agent.status === 'executing' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      'bg-zinc-800 text-zinc-400'
                    }`}>
                      <span className={`h-1 w-1 rounded-full mr-1 ${
                        agent.status === 'thinking' ? 'bg-amber-400 animate-pulse' :
                        agent.status === 'executing' ? 'bg-emerald-400 animate-bounce' :
                        'bg-zinc-500'
                      }`}></span>
                      {agent.status}
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="text-[9px] text-zinc-600 block uppercase font-mono tracking-wider">Current Task</span>
                    <p className="text-xs text-zinc-400 truncate mt-0.5">{agent.task}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-zinc-900 pt-3 text-[10px] text-zinc-500 font-mono">
                    <span>Memory: {agent.memoryCount} links</span>
                    <span>Efficiency: {agent.efficiency}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Execution Pipeline Analytics (Custom Chart) */}
          <Card className="bg-zinc-900/40 border-zinc-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Execution Velocity</CardTitle>
              <CardDescription className="text-[11px] text-zinc-500">Pipeline runs completed per hour over past 24 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Graphic custom graph bars */}
              <div className="h-48 flex items-end justify-between gap-2 pt-4 px-2">
                {[45, 60, 55, 70, 85, 95, 80, 75, 90, 110, 130, 125, 140, 155, 145, 160, 180, 195, 210, 190, 220, 240, 235, 255].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center group cursor-pointer">
                    {/* Hover Tooltip */}
                    <span className="absolute bottom-52 bg-zinc-900 border border-zinc-800 text-[9px] text-zinc-200 px-1.5 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 font-mono pointer-events-none z-10">
                      {val} runs
                    </span>
                    <div 
                      style={{ height: `${(val / 260) * 100}%` }} 
                      className={`w-full rounded-t transition-all duration-300 ${
                        idx === 23 
                          ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]' 
                          : 'bg-zinc-800 group-hover:bg-zinc-700'
                      }`}
                    ></div>
                    <span className="text-[8px] text-zinc-600 font-mono mt-2 group-hover:text-zinc-400 transition-colors duration-150">
                      {idx}h
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Terminal logs Feed */}
        <div className="space-y-6">
          <Card className="bg-zinc-900/40 border-zinc-800/80 backdrop-blur-sm flex flex-col h-[525px]">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Stream Activity</CardTitle>
                <CardDescription className="text-[11px] text-zinc-500">Live orchestrator telemetry.</CardDescription>
              </div>
              <TerminalIcon className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto px-4 pb-4">
              <div className="space-y-3 font-mono text-[10px]">
                {terminalLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 border-b border-zinc-900/30 pb-2 last:border-0">
                    <span className="text-zinc-600 shrink-0">[{log.timestamp}]</span>
                    <span className={`shrink-0 inline-block px-1 rounded text-[8px] uppercase ${
                      log.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      log.type === 'warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      log.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      'bg-zinc-800 text-zinc-400'
                    }`}>
                      {log.type}
                    </span>
                    <span className="text-zinc-300 break-all">{log.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
