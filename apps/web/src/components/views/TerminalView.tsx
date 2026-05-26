import React, { useEffect } from 'react';
import { useTerminalStore } from '@/store/useTerminalStore';
import { XTermConsole } from '../terminal/XTermConsole';
import { Plus, X, Terminal as TerminalIcon } from 'lucide-react';

export const TerminalView: React.FC = () => {
  const {
    tabs,
    activeTabId,
    connectSocket,
    createSession,
    closeSession,
    setActiveTab
  } = useTerminalStore();

  useEffect(() => {
    connectSocket();
  }, [connectSocket]);

  // Create initial shell session if none exists
  useEffect(() => {
    if (tabs.length === 0) {
      createSession();
    }
  }, [tabs, createSession]);

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden font-mono">
      {/* Console Tab bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-4 h-12 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto select-none no-scrollbar">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg border-t-2 text-[11px] cursor-pointer transition-all ${
                  isActive
                    ? 'bg-zinc-900 border-purple-500 text-white'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'
                }`}
              >
                <TerminalIcon className="w-3 h-3 text-purple-400 shrink-0" />
                <span className="truncate max-w-[80px]">{tab.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeSession(tab.id);
                  }}
                  className="p-0.5 hover:bg-zinc-800 rounded transition-colors text-zinc-600 hover:text-zinc-300 bg-transparent border-0 cursor-pointer"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            );
          })}
          <button
            onClick={() => createSession()}
            className="p-1 hover:bg-zinc-900 rounded-md transition-colors text-zinc-400 hover:text-zinc-200 cursor-pointer ml-1 bg-transparent border-0"
            title="Open New Terminal Tab"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Terminal Engine Active</span>
        </div>
      </div>

      {/* Terminal Viewports Container */}
      <div className="flex-1 relative overflow-hidden bg-zinc-950">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              className={`absolute inset-0 w-full h-full ${isActive ? 'block' : 'hidden'}`}
            >
              <XTermConsole sessionId={tab.id} />
            </div>
          );
        })}

        {tabs.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 text-zinc-600">
            <TerminalIcon className="w-10 h-10 text-zinc-800 mb-3 animate-pulse" />
            <h4 className="text-xs font-semibold text-zinc-400">No Terminal Sessions Active</h4>
            <p className="text-[10px] text-zinc-600 mt-1 max-w-xs">
              Click the "+" button in the tab header to initialize a native shell terminal instance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
