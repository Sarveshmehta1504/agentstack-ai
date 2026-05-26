"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = void 0;
const openai_1 = __importDefault(require("openai"));
const sdk_1 = require("@anthropic-ai/sdk");
const generative_ai_1 = require("@google/generative-ai");
class AIService {
    async streamCompletion(provider, model, prompt, apiKey, onChunk, onDone) {
        const isMock = !apiKey || apiKey === 'mock-key' || apiKey.startsWith('mock-');
        if (isMock) {
            // Simulate real streaming chunks for testing
            const words = `[Mock ${provider.toUpperCase()} Completion]: Restructuring software into modular blocks ensures high-performance orchestration. Here is your summary of: "${prompt}". Completed successfully.`.split(' ');
            let i = 0;
            const interval = setInterval(() => {
                if (i >= words.length) {
                    clearInterval(interval);
                    onDone();
                    return;
                }
                onChunk(words[i] + ' ');
                i++;
            }, 80);
            return;
        }
        try {
            if (provider === 'openai') {
                const openai = new openai_1.default({ apiKey });
                const stream = await openai.chat.completions.create({
                    model: model || 'gpt-4o',
                    messages: [{ role: 'user', content: prompt }],
                    stream: true
                });
                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content || '';
                    if (content)
                        onChunk(content);
                }
            }
            else if (provider === 'anthropic') {
                const anthropic = new sdk_1.Anthropic({ apiKey });
                const stream = await anthropic.messages.create({
                    max_tokens: 1024,
                    messages: [{ role: 'user', content: prompt }],
                    model: model || 'claude-3-5-sonnet-latest',
                    stream: true
                });
                for await (const event of stream) {
                    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
                        onChunk(event.delta.text);
                    }
                }
            }
            else if (provider === 'gemini') {
                const ai = new generative_ai_1.GoogleGenerativeAI(apiKey);
                // Correct Gemini SDK initialization using standard generative model instance
                const geminiModel = ai.getGenerativeModel({ model: model || 'gemini-1.5-flash' });
                const result = await geminiModel.generateContentStream({
                    contents: [{ role: 'user', parts: [{ text: prompt }] }]
                });
                for await (const chunk of result.stream) {
                    onChunk(chunk.text());
                }
            }
            else if (provider === 'ollama') {
                // Fetch from local Ollama service running on the user's host
                const response = await fetch('http://localhost:11434/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ model: model || 'llama3', prompt, stream: true })
                });
                if (!response.body)
                    throw new Error('Ollama connection returned empty stream');
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                while (true) {
                    const { done, value } = await reader.read();
                    if (done)
                        break;
                    const chunkStr = decoder.decode(value, { stream: true });
                    const lines = chunkStr.split('\n');
                    for (const line of lines) {
                        if (line.trim()) {
                            try {
                                const json = JSON.parse(line);
                                if (json.response)
                                    onChunk(json.response);
                            }
                            catch (e) { }
                        }
                    }
                }
            }
            onDone();
        }
        catch (error) {
            onChunk(`\r\n[AI Provider Error]: ${error.message || error}`);
            onDone();
        }
    }
}
exports.aiService = new AIService();
