'use client';

import React, { useEffect, useState } from 'react';
import { useGithubStore } from '../../store/useGithubStore';
import { GitFork, GitCommit, AlertCircle, GitPullRequest, Search, RefreshCw, FolderGit } from 'lucide-react';

export const GithubExplorer: React.FC = () => {
  const {
    token,
    repos,
    selectedRepo,
    branches,
    selectedBranch,
    issues,
    commits,
    pulls,
    loading,
    error,
    setToken,
    fetchRepos,
    selectRepo,
    selectBranch
  } = useGithubStore();

  const [inputToken, setInputToken] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (token) {
      fetchRepos();
    }
  }, [token, fetchRepos]);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputToken) return;
    setToken(inputToken);
  };

  const filteredRepos = repos.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!token) {
    return (
      <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-xl max-w-xl mx-auto mt-10">
        <h3 className="text-md font-semibold text-white flex items-center gap-2 mb-3">
          <FolderGit className="w-5 h-5 text-purple-400" />
          Connect GitHub Account
        </h3>
        <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
          Provide your GitHub Personal Access Token to pull your repositories, inspect branch streams, track issue queues, and trigger repository action tasks. Use a mock token (e.g. <code>mock-token</code>) to run simulated tests.
        </p>
        <form onSubmit={handleConnect} className="flex gap-3">
          <input
            type="password"
            placeholder="ghp_xxxxxxxxxxxx"
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
          >
            Connect
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full p-4 overflow-hidden">
      {/* Repositories column */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-zinc-200">Repositories</h4>
          <button 
            onClick={fetchRepos} 
            className="p-1.5 hover:bg-zinc-900 rounded-md transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-zinc-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-zinc-600" />
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {filteredRepos.map(repo => {
            const isSelected = selectedRepo?.id === repo.id;
            return (
              <button
                key={repo.id}
                onClick={() => selectRepo(repo)}
                className={`w-full text-left p-3 rounded-lg border transition-all text-xs cursor-pointer ${
                  isSelected 
                    ? 'bg-purple-600/10 border-purple-500/50 text-white shadow-inner' 
                    : 'bg-zinc-900/30 border-transparent hover:bg-zinc-900/50 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="font-semibold truncate">{repo.name}</div>
                <div className="text-[10px] text-zinc-500 truncate mt-1">{repo.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Repository Detail Explorer */}
      <div className="md:col-span-2 bg-zinc-950 border border-zinc-800 rounded-xl p-6 flex flex-col h-full overflow-hidden">
        {selectedRepo ? (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Repo Header */}
            <div className="flex justify-between items-start border-b border-zinc-800 pb-4 mb-4">
              <div>
                <h3 className="text-md font-bold text-white flex items-center gap-2">
                  <GitFork className="w-5 h-5 text-purple-400" />
                  {selectedRepo.full_name}
                </h3>
                <p className="text-xs text-zinc-400 mt-1">{selectedRepo.description}</p>
              </div>

              {/* Branch Selector */}
              <select
                value={selectedBranch || ''}
                onChange={(e) => selectBranch(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-300 focus:outline-none"
              >
                {branches.map(b => (
                  <option key={b.name} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Grid for commits & issues */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
              {/* Commits */}
              <div className="flex flex-col h-full overflow-hidden">
                <h5 className="text-xs font-semibold text-zinc-300 flex items-center gap-2 mb-3">
                  <GitCommit className="w-4 h-4 text-emerald-400" />
                  Recent Commits
                </h5>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {commits.map(c => (
                    <div key={c.sha} className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-lg text-[11px] text-zinc-300">
                      <div className="font-medium line-clamp-1">{c.commit.message}</div>
                      <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-2">
                        <span>by {c.commit.author.name}</span>
                        <span>{new Date(c.commit.author.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                  {commits.length === 0 && (
                    <div className="text-center text-zinc-600 text-xs py-8">No commits found.</div>
                  )}
                </div>
              </div>

              {/* Issues & PRs */}
              <div className="flex flex-col h-full overflow-hidden">
                <h5 className="text-xs font-semibold text-zinc-300 flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  Active Issues & PRs
                </h5>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {issues.map(i => (
                    <div key={i.id} className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-lg text-[11px] flex justify-between items-start gap-4">
                      <div className="text-zinc-300">
                        <span className="text-zinc-500 mr-1.5">#{i.number}</span>
                        <span>{i.title}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-semibold shrink-0 uppercase ${
                        i.state === 'open' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {i.state}
                      </span>
                    </div>
                  ))}

                  {pulls.map(p => (
                    <div key={p.id} className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-lg text-[11px] flex justify-between items-start gap-4">
                      <div className="text-zinc-300">
                        <span className="text-zinc-500 mr-1.5">#{p.number}</span>
                        <span className="flex items-center gap-1.5">
                          <GitPullRequest className="w-3 h-3 text-purple-400 shrink-0" />
                          {p.title}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-semibold shrink-0 uppercase ${
                        p.state === 'open' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {p.state}
                      </span>
                    </div>
                  ))}

                  {issues.length === 0 && pulls.length === 0 && (
                    <div className="text-center text-zinc-600 text-xs py-8">No open issues or pull requests.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-zinc-500">
            <GitFork className="w-12 h-12 text-zinc-700 mb-4 animate-bounce" />
            <h4 className="text-sm font-semibold text-zinc-300">No Repository Selected</h4>
            <p className="text-xs text-zinc-500 mt-2 max-w-sm">
              Choose a repository from the left explorer column to retrieve branches, commit feeds, issue queues, and build workflows.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
