"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.terminalService = void 0;
const pty = __importStar(require("node-pty"));
const os_1 = __importDefault(require("os"));
class TerminalService {
    sessions = new Map();
    createSession(id, cols = 80, rows = 24, onData) {
        // If session already exists, terminate it first
        this.killSession(id);
        const shell = os_1.default.platform() === 'win32' ? 'powershell.exe' : 'bash';
        const ptyProcess = pty.spawn(shell, [], {
            name: 'xterm-color',
            cols,
            rows,
            cwd: process.env.HOME || process.cwd(),
            env: process.env
        });
        ptyProcess.onData((data) => {
            onData(data);
        });
        const instance = { id, ptyProcess };
        this.sessions.set(id, instance);
        return instance;
    }
    write(id, data) {
        const session = this.sessions.get(id);
        if (session) {
            session.ptyProcess.write(data);
        }
    }
    resize(id, cols, rows) {
        const session = this.sessions.get(id);
        if (session) {
            session.ptyProcess.resize(cols, rows);
        }
    }
    killSession(id) {
        const session = this.sessions.get(id);
        if (session) {
            try {
                session.ptyProcess.kill();
            }
            catch (e) {
                // Already dead
            }
            this.sessions.delete(id);
        }
    }
}
exports.terminalService = new TerminalService();
