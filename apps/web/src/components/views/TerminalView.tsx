import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Play, Trash2, HelpCircle } from 'lucide-react';

export const TerminalView: React.FC = () => {
  const { terminalLogs, addTerminalLog, clearTerminalLogs } = useStore();
  const [inputVal, setInputVal] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const cmd = inputVal.trim();
    setInputVal('');

    // Append command to console logs
    addTerminalLog({ type: 'input', text: `$ ${cmd}` });

    // Mock terminal execution parser
    setTimeout(() => {
      if (cmd.startsWith('/help')) {
        addTerminalLog({ type: 'info', text: 'Available commands:\n  /trigger - Run full pipeline\n  /clear - Clear terminal logs\n  /agent [name] - Query specific agent status' });
      } else if (cmd.startsWith('/trigger')) {
        addTerminalLog({ type: 'info', text: 'Triggering orchestrator run...' });
        addTerminalLog({ type: 'success', text: 'Pipeline initialized. Watch dashboard for progress.' });
      } else if (cmd.startsWith('/clear')) {
        clearTerminalLogs();
      } else if (cmd.startsWith('/agent')) {
        const parts = cmd.split(' ');
        const name = parts[1] || 'Agent';
        addTerminalLog({ type: 'info', text: `Querying status for ${name}...` });
        addTerminalLog({ type: 'success', text: `${name} is currently IDLE. Efficiency 95%.` });
      } else {
        addTerminalLog({ type: 'error', text: `Command not found: "${cmd}". Type /help for details.` });
      }
    }, 500);
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 p-6 font-mono text-xs overflow-hidden">
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/40"></span>
          <span className="h-3 w-3 rounded-full bg-yellow-500/20 border border-yellow-500/40"></span>
          <span className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500/40"></span>
          <span className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider ml-2">Console Shell</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={clearTerminalLogs}
            className="flex items-center gap-1.5 px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded transition-colors text-[10px]"
          >
            <Trash2 className="h-3 w-3" />
            Clear
          </button>
        </div>
      </div>

      {/* Output Console area */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2 mb-4 scrollbar-thin">
        {terminalLogs.map((log) => (
          <div key={log.id} className="leading-relaxed whitespace-pre-wrap">
            <span className="text-zinc-600">[{log.timestamp}] </span>
            {log.type !== 'input' && (
              <span className={`inline-block px-1 rounded text-[8px] uppercase font-semibold mr-2 ${
                log.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                log.type === 'warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                log.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                'bg-zinc-800 text-zinc-400'
              }`}>
                {log.type}
              </span>
            )}
            <span className={
              log.type === 'input' ? 'text-indigo-400 font-bold' :
              log.type === 'error' ? 'text-red-400' :
              log.type === 'warning' ? 'text-amber-400' :
              log.type === 'success' ? 'text-emerald-400' :
              'text-zinc-300'
            }>
              {log.text}
            </span>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      {/* Command prompt form */}
      <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 border-t border-zinc-900 pt-4">
        <span className="text-indigo-500 font-bold">$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Type command (e.g. /trigger, /agent Architect, /help)..."
          className="flex-1 bg-transparent border-0 outline-none text-zinc-200 placeholder-zinc-700"
          autoFocus
        />
        <button type="submit" className="hidden">Submit</button>
      </form>
    </div>
  );
};
