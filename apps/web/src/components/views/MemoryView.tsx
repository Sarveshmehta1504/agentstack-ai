import React, { useState } from 'react';
import { useStore, MemoryNode } from '@/store/useStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Brain, Share2, Tag, Calendar, Plus } from 'lucide-react';

export const MemoryView: React.FC = () => {
  const { memories, addMemory } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'semantic' | 'episodic' | 'procedural'>('all');
  const [newMemoryText, setNewMemoryText] = useState('');

  const handleCreateMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryText.trim()) return;

    addMemory({
      content: newMemoryText.trim(),
      category: 'semantic',
      connections: [],
    });
    setNewMemoryText('');
  };

  const filteredMemories = memories.filter((m) => {
    const matchesSearch = m.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex-1 flex overflow-hidden bg-zinc-950/20 p-6 gap-6">
      {/* Left panel: query & filters */}
      <div className="w-80 flex flex-col gap-4 overflow-y-auto shrink-0">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Memory Explorer</h3>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vectors..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-900/60 border border-zinc-800 rounded-md text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category Filters */}
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 font-mono block uppercase mb-2">Filters</label>
          {[
            { id: 'all', label: 'All Vectors' },
            { id: 'semantic', label: 'Semantic (Concepts)' },
            { id: 'episodic', label: 'Episodic (Experiences)' },
            { id: 'procedural', label: 'Procedural (Skills)' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`w-full text-left px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                selectedCategory === cat.id 
                  ? 'bg-zinc-800 text-white' 
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Add Memory Input */}
        <form onSubmit={handleCreateMemory} className="mt-4 border-t border-zinc-900 pt-4 space-y-3">
          <label className="text-[10px] text-zinc-500 font-mono block uppercase">Inject Memory Node</label>
          <textarea
            value={newMemoryText}
            onChange={(e) => setNewMemoryText(e.target.value)}
            placeholder="Type semantic memory facts..."
            className="w-full p-3 bg-zinc-900/60 border border-zinc-800 rounded-md text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 resize-none h-24"
          />
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-medium transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Inject Fact
          </button>
        </form>
      </div>

      {/* Right panel: Memory nodes list & connections */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        {/* Memory Grid/List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {filteredMemories.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500">
              <Brain className="h-10 w-10 text-zinc-700 mb-2" />
              <p className="text-xs">No vector matches found</p>
            </div>
          ) : (
            filteredMemories.map((mem) => (
              <Card key={mem.id} className="bg-zinc-900/40 border-zinc-800/80 backdrop-blur-sm hover:border-indigo-500/20 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-xs text-zinc-200 font-mono leading-relaxed">{mem.content}</p>
                    <span className="shrink-0 flex items-center gap-1 text-[9px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded uppercase border border-indigo-500/20">
                      <Tag className="h-2.5 w-2.5" />
                      {mem.category}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-zinc-900/50 pt-3 text-[10px] text-zinc-500 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {mem.timestamp}
                    </span>
                    {mem.connections.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Share2 className="h-3 w-3 text-indigo-400" />
                        Linked to: {mem.connections.join(', ')}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
