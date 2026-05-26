'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Key, Sparkles, Mail, User, ShieldAlert } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const { login, signup, error, loading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (isLogin) {
      await login(email, password);
    } else {
      if (!name) return;
      await signup(email, name, password);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10"
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              AgentStack Platform
            </h2>
            <p className="text-sm text-zinc-400 mt-2">
              Log in or sign up to orchestrate your AI workflows.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-4 rounded-lg bg-red-950/30 border border-red-800/40 flex items-center gap-3 text-red-200 text-xs"
              >
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>

            <div className="relative">
              <Key className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  {isLogin ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </form>

          {/* Switch Tab Link */}
          <div className="mt-6 text-center text-xs">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-400 hover:underline hover:text-purple-300 font-medium cursor-pointer bg-transparent border-0"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
