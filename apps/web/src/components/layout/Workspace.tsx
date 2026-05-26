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

export const Workspace: React.FC = () => {
  const { activeTab } = useStore();

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
