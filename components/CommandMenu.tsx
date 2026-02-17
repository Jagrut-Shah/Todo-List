
import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Command, CornerDownLeft, X, Flame } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';
import { motion, AnimatePresence } from 'framer-motion';

const CommandMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const addTask = useTaskStore((state) => state.addTask);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim()) {
      addTask(inputValue);
      setInputValue('');
      setIsOpen(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div 
            className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-[#020617]/40 backdrop-blur-xl"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              className="w-full max-w-2xl bg-[#0f172a] rounded-3xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit}>
                <div className="p-6 flex items-center border-b border-white/5">
                  <Search size={22} className="text-red-500 mr-4" strokeWidth={3} />
                  <input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Capture an objective..."
                    className="w-full bg-transparent border-none outline-none text-white placeholder:text-slate-700 text-xl font-bold tracking-tight"
                  />
                  <button 
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-white/5 rounded-lg text-slate-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="px-6 py-4 bg-black/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-600 text-white rounded font-black text-[9px] uppercase tracking-widest shadow-lg shadow-red-900/40">
                      <Flame size={10} strokeWidth={3} />
                      <span>Ignition</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">Natural language enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Execute</span>
                    <kbd className="px-2 py-1 text-[9px] font-black text-slate-500 bg-white/5 border border-white/10 rounded shadow-sm">ENTER</kbd>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-10 right-10 z-50">
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-red-600 text-white rounded-[24px] shadow-2xl shadow-red-900/40 flex items-center justify-center hover:scale-110 active:scale-90 transition-all duration-300 group"
        >
          <Plus size={32} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>
    </>
  );
};

export default CommandMenu;
