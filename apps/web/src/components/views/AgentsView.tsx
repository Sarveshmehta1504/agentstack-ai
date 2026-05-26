import React, { useEffect, useState } from 'react';
import { useAIStore } from '@/store/useAIStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Send, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

export const AgentsView: React.FC = () => {
  const {
    provider,
    model,
    apiKey,
    messages,
    streamingText,
    loading,
    connectSocket,
    setProvider,
    setModel,
    setApiKey,
    sendMessage
  } = useAIStore();

  const [promptText, setPromptText] = useState('');

  useEffect(() => {
    connectSocket();
  }, [connectSocket]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim() || loading) return;
    sendMessage(promptText);
    setPromptText('');
  };

  const getAvailableModels = () => {
    switch (provider) {
      case 'openai':
        return ['gpt-4o', 'gpt-4o-mini', 'o1-mini'];
      case 'anthropic':
        return ['claude-3-5-sonnet-latest', 'claude-3-5-haiku-latest'];
      case 'gemini':
        return ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp'];
      case 'ollama':
        return ['llama3', 'mistral', 'codellama', 'phi3'];
      default:
        return [];
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-zinc-950/20 p-6 gap-6">
      {/* Left panel: Model Configuration */}
      <div className="w-full md:w-80 flex flex-col gap-4 shrink-0 overflow-y-auto">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">AI Orchestration</h3>
          <p className="text-[10px] text-zinc-500 mt-1">Configure models and sync developer workspace keys.</p>
        </div>

        <Card className="bg-zinc-900/40 border-zinc-800/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-bold text-zinc-200">Active Provider</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-[9px] text-zinc-500 uppercase font-mono tracking-wider block mb-1">Select System</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none"
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic Claude</option>
                <option value="gemini">Google Gemini</option>
                <option value="ollama">Ollama (Local)</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] text-zinc-500 uppercase font-mono tracking-wider block mb-1">Select Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none"
              >
                {getAvailableModels().map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {provider !== 'ollama' && (
              <div>
                <label className="text-[9px] text-zinc-500 uppercase font-mono tracking-wider block mb-1">API Key</label>
                <input
                  type="password"
                  placeholder="Paste Key (e.g. sk-xxxx)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-white focus:outline-none placeholder-zinc-700"
                />
              </div>
            )}

            <div className="text-[9px] text-zinc-500 leading-relaxed pt-2 border-t border-zinc-850">
              {provider === 'ollama' ? (
                <span>Local Ollama server will connect to <code>http://localhost:11434</code>. Verify your local service is running.</span>
              ) : (
                <span>Keys are saved locally in localStorage. Use <code>mock-key</code> to test the streaming pipe without keys.</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right panel: Live completions console */}
      <div className="flex-1 flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Chat header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 bg-zinc-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Brain className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                Model Sandbox
                <Sparkles className="w-3 h-3 text-purple-400" />
              </h4>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{provider} / {model}</p>
            </div>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono capitalize bg-zinc-900 border border-zinc-800 text-zinc-400">
            {loading ? 'completions streaming' : 'sandbox idle'}
          </span>
        </div>

        {/* Message timeline viewport */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-xs">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`max-w-[85%] rounded-lg p-4 border ${
                  isUser
                    ? 'bg-purple-600/10 border-purple-500/20 text-purple-100 ml-auto'
                    : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-300'
                }`}
              >
                <div className="text-[9px] text-zinc-500 mb-1">
                  {isUser ? 'YOU' : 'AI ORCHESTRATOR'}
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              </div>
            );
          })}

          {/* Streaming chunk preview */}
          {streamingText && (
            <div className="max-w-[85%] rounded-lg p-4 bg-zinc-900/40 border border-zinc-800/80 text-zinc-300">
              <div className="text-[9px] text-zinc-500 mb-1">AI ORCHESTRATOR (STREAMING)</div>
              <div className="whitespace-pre-wrap leading-relaxed flex items-center gap-1">
                {streamingText}
                <span className="w-1.5 h-4 bg-purple-500 animate-pulse inline-block" />
              </div>
            </div>
          )}

          {messages.length === 0 && !streamingText && (
            <div className="flex flex-col items-center justify-center text-center py-20 text-zinc-600">
              <Cpu className="w-10 h-10 text-zinc-800 mb-3" />
              <h5 className="font-semibold text-zinc-400">Model Console Sandbox</h5>
              <p className="text-[10px] text-zinc-600 mt-1 max-w-xs">
                Submit prompt completions tests to verify connection routing profiles.
              </p>
            </div>
          )}
        </div>

        {/* Send message prompt form */}
        <form onSubmit={handleSend} className="border-t border-zinc-800 p-4 bg-zinc-950/80 flex gap-3 shrink-0">
          <input
            type="text"
            placeholder="Ask anything..."
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
