'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { DashboardView } from '../views/DashboardView';
import { WorkflowsView } from '../views/WorkflowsView';
import { AgentsView } from '../views/AgentsView';
import { TerminalView } from '../views/TerminalView';
import { MemoryView } from '../views/MemoryView';
import { IntegrationsView } from '../views/IntegrationsView';
import { DocsView } from '../views/DocsView';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { AuthModal } from '../auth/AuthModal';

export const Workspace: React.FC = () => {
  const { activeTab } = useStore();
  const { user, loading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin" />
          <span className="text-zinc-500 text-xs font-semibold tracking-wider">INITIALIZING PLATFORM</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthModal />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'workflows':
        return <WorkflowsView />;
      case 'agents':
        return <AgentsView />;
      case 'terminal':
        return <TerminalView />;
      case 'memory':
        return <MemoryView />;
      case 'integrations':
        return <IntegrationsView />;
      case 'docs':
        return <DocsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main app space */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar options & actions */}
        <Topbar />

        {/* View space */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};
