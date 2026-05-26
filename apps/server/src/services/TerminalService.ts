import * as pty from 'node-pty';
import os from 'os';

export interface TerminalSessionInstance {
  id: string;
  ptyProcess: pty.IPty;
}

class TerminalService {
  private sessions = new Map<string, TerminalSessionInstance>();

  createSession(id: string, cols: number = 80, rows: number = 24, onData: (data: string) => void): TerminalSessionInstance {
    // If session already exists, terminate it first
    this.killSession(id);

    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
    const ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols,
      rows,
      cwd: process.env.HOME || process.cwd(),
      env: process.env as any
    });

    ptyProcess.onData((data) => {
      onData(data);
    });

    const instance: TerminalSessionInstance = { id, ptyProcess };
    this.sessions.set(id, instance);
    return instance;
  }

  write(id: string, data: string): void {
    const session = this.sessions.get(id);
    if (session) {
      session.ptyProcess.write(data);
    }
  }

  resize(id: string, cols: number, rows: number): void {
    const session = this.sessions.get(id);
    if (session) {
      session.ptyProcess.resize(cols, rows);
    }
  }

  killSession(id: string): void {
    const session = this.sessions.get(id);
    if (session) {
      try {
        session.ptyProcess.kill();
      } catch (e) {
        // Already dead
      }
      this.sessions.delete(id);
    }
  }
}

export const terminalService = new TerminalService();
