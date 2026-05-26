'use client';

import React, { useEffect, useRef } from 'react';
import { useTerminalStore } from '../../store/useTerminalStore';
import 'xterm/css/xterm.css';

interface XTermConsoleProps {
  sessionId: string;
}

export const XTermConsole: React.FC<XTermConsoleProps> = ({ sessionId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<any>(null);
  const { socket } = useTerminalStore();

  useEffect(() => {
    if (!containerRef.current || !socket) return;

    let termInstance: any = null;
    let onDataDisposable: any = null;

    // Load xterm dynamically only on the client side to avoid SSR build errors
    const initTerminal = async () => {
      const { Terminal } = await import('xterm');
      
      const term = new Terminal({
        cursorBlink: true,
        theme: {
          background: '#09090b', // zinc-950
          foreground: '#e4e4e7', // zinc-200
          cursor: '#a855f7', // purple-500
          black: '#09090b',
          red: '#ef4444',
          green: '#10b981',
          yellow: '#f59e0b',
          blue: '#3b82f6',
          magenta: '#8b5cf6',
          cyan: '#06b6d4',
          white: '#f4f4f5'
        },
        fontSize: 12,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace'
      });

      if (!containerRef.current) return;
      term.open(containerRef.current);
      termRef.current = term;
      termInstance = term;

      // Notify backend to spawn/link the session shell PTY
      socket.emit('terminal:create', { sessionId, cols: term.cols, rows: term.rows });

      // Handle user keystrokes
      onDataDisposable = term.onData((data) => {
        socket.emit('terminal:write', { sessionId, data });
      });

      term.focus();
    };

    initTerminal();

    // Handle incoming stream from backend
    const onDataHandler = (payload: { sessionId: string; data: string }) => {
      if (payload.sessionId === sessionId && termRef.current) {
        termRef.current.write(payload.data);
      }
    };
    socket.on('terminal:data', onDataHandler);

    // Cleanup on unmount or tab switch
    return () => {
      if (onDataDisposable) {
        onDataDisposable.dispose();
      }
      socket.off('terminal:data', onDataHandler);
      if (termInstance) {
        termInstance.dispose();
      }
    };
  }, [sessionId, socket]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full bg-zinc-950 p-4 font-mono text-zinc-300 overflow-hidden" 
    />
  );
};
