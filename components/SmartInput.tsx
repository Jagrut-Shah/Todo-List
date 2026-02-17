
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Calendar, CornerDownLeft, Sparkles, X, Flame } from 'lucide-react';
import * as chrono from 'chrono-node';
import { useTaskStore } from '../store/useTaskStore';
import { motion, AnimatePresence } from 'framer-motion';

const SmartInput: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');
  const [parsedDate, setParsedDate] = useState<Date | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const addTask = useTaskStore((state) => state.addTask);

  useEffect(() => {
    const results = chrono.parse(value);
    if (results.length > 0) {
      setParsedDate(results[0].start.date());
    } else {
      setParsedDate(null);
    }
  }, [value]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (value.trim()) {
      addTask(value);
      setValue('');
      setParsedDate(null);
      inputRef.current?.focus();
    } else {
      setIsFocused(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') {
      setIsFocused(false);
      setValue('');
    }
  };

  const formattedDate = parsedDate ? new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: parsedDate.getHours() === 0 && parsedDate.getMinutes() === 0 ? undefined : 'numeric',
    minute: parsedDate.getHours() === 0 && parsedDate.getMinutes() === 0 ? undefined : '2-digit',
  }).format(parsedDate) : null;

  return (
    <div className="relative mb-8 group/input">
      <AnimatePresence mode="wait">
        {!isFocused ? (
          <motion.button
            key="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFocused(true)}
            className="flex items-center gap-3 w-full py-4 px-6 rounded-2xl text-slate-400 bg-white/5 border border-white/10 hover:border-red-500/40 hover:bg-white/10 transition-all duration-300 shadow-xl active:scale-[0.99]"
          >
            <div className="bg-white/5 p-1.5 rounded-lg text-slate-500 group-hover/input:bg-red-600 group-hover/input:text-white transition-colors">
              <Plus size={16} strokeWidth={3} />
            </div>
            <span className="text-sm font-bold tracking-tight">Capture objective...</span>
            <div className="ml-auto opacity-0 group-hover/input:opacity-100 transition-opacity flex items-center gap-2">
              <kbd className="px-2 py-1 text-[9px] font-black text-slate-500 bg-white/5 border border-white/10 rounded shadow-sm">RETURN</kbd>
            </div>
          </motion.button>
        ) : (
          <motion.div
            key="input"
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="flex flex-col w-full p-5 rounded-3xl bg-[#0f172a] border-2 border-red-500 shadow-[0_0_50px_rgba(220,38,38,0.15)] ring-8 ring-red-500/5"
          >
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-lg border-2 border-red-900/40 flex-shrink-0 mt-1 bg-red-500/10 flex items-center justify-center text-red-500">
                <Flame size={14} strokeWidth={3} />
              </div>
              <input
                ref={inputRef}
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What must be done? (e.g. 'Sync tomorrow at 4pm')"
                className="w-full bg-transparent border-none outline-none text-xl py-0 text-white placeholder:text-slate-700 font-bold tracking-tight"
              />
              <button 
                onClick={() => { setValue(''); setIsFocused(false); }}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/5">
              <div className="flex items-center gap-2">
                {formattedDate ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-full text-[10px] font-black shadow-lg shadow-red-900/40"
                  >
                    <Calendar size={12} strokeWidth={3} />
                    {formattedDate}
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                    <Sparkles size={12} className="text-red-500 animate-pulse" />
                    <span>Try: "Review deck tomorrow at 2pm"</span>
                  </div>
                )}
              </div>
              <button 
                type="button"
                onClick={() => handleSubmit()}
                disabled={!value.trim()}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 active:scale-95 ${
                  value.trim() 
                    ? 'bg-red-600 text-white shadow-red-900/40 hover:bg-red-700' 
                    : 'bg-white/5 text-slate-700 shadow-none cursor-not-allowed'
                }`}
              >
                Engage
                <CornerDownLeft size={14} strokeWidth={3} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartInput;
