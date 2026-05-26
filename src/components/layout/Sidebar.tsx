import React from 'react';
import { useStore, ActiveTab } from '@/store/useStore';
import { 
  LayoutDashboard, 
  GitFork, 
  Users, 
  Terminal, 
  Brain, 
  Blocks, 
  FileText,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<any>;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'workflows', label: 'Workflows', icon: GitFork },
  { id: 'agents', label: 'Agents', icon: Users },
  { id: 'terminal', label: 'Terminal', icon: Terminal },
  { id: 'memory', label: 'Memory', icon: Brain },
  { id: 'integrations', label: 'Integrations', icon: Blocks },
  { id: 'docs', label: 'Documentation', icon: FileText },
];

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useStore();

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col h-full justify-between">
      <div>
        {/* Brand Logo */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-800 gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-sm tracking-wide text-zinc-100 uppercase">AgentStack</h1>
            <span className="text-[10px] text-zinc-500 font-mono">v1.0.0-beta</span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center px-3 py-2 text-xs font-medium rounded-md transition-all duration-150 gap-3",
                  isActive
                    ? "bg-zinc-800/80 text-white shadow-sm border border-zinc-700/50"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent"
                )}
              >
                <Icon className={cn("h-4.5 w-4.5", isActive ? "text-indigo-400" : "text-zinc-500")} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / System Status */}
      <div className="p-4 border-t border-zinc-900 bg-zinc-950/50">
        <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Stack Active</span>
          </div>
          <span>UTC -04:00</span>
        </div>
      </div>
    </aside>
  );
};
