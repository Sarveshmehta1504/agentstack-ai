import React from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GitPullRequest, Flame, Database, Terminal, Send, Cpu } from 'lucide-react';

export const IntegrationsView: React.FC = () => {
  const { integrations, toggleIntegration, addTerminalLog } = useStore();

  const handleToggle = (id: string, name: string) => {
    toggleIntegration(id);
    const active = !integrations[id];
    addTerminalLog({
      type: active ? 'success' : 'warning',
      text: `${name} integration has been ${active ? 'ENABLED' : 'DISABLED'}.`
    });
  };

  const services = [
    { id: 'github', name: 'GitHub', desc: 'Automate pull requests, issue audits, and git actions.', icon: GitPullRequest, color: 'text-indigo-400' },

    { id: 'firebase', name: 'Firebase', desc: 'Deploy database rules, cloud hosting, and authentication states.', icon: Flame, color: 'text-amber-500' },
    { id: 'supabase', name: 'Supabase', desc: 'Sync schema definitions, listen to realtime database triggers.', icon: Database, color: 'text-emerald-400' },
    { id: 'docker', name: 'Docker', desc: 'Manage localized container execution sandboxes for agents.', icon: Terminal, color: 'text-sky-400' },
    { id: 'vercel', name: 'Vercel', desc: 'Trigger deployments, monitor edge-routing performance metrics.', icon: Cpu, color: 'text-zinc-200' },
    { id: 'slack', name: 'Slack', desc: 'Publish telemetry summaries and task alerts directly to workspaces.', icon: Send, color: 'text-fuchsia-400' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-950/20">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Integrations Hub</h3>
          <p className="text-[11px] text-zinc-500 mt-1">Connect AgentStack to your engineering ecosystem to enable automation pipelines.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            const isConnected = integrations[service.id];
            return (
              <Card key={service.id} className="bg-zinc-900/40 border-zinc-800/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-zinc-950/60 border border-zinc-800 flex items-center justify-center">
                      <Icon className={`h-5 w-5 ${service.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-xs font-bold text-zinc-200">{service.name}</CardTitle>
                      <CardDescription className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        {isConnected ? 'Connected' : 'Disconnected'}
                      </CardDescription>
                    </div>
                  </div>
                  {/* Toggle button */}
                  <button
                    onClick={() => handleToggle(service.id, service.name)}
                    className={`px-3 py-1 rounded text-[10px] font-semibold border transition-all ${
                      isConnected 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                        : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    {isConnected ? 'Disconnect' : 'Connect'}
                  </button>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{service.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
