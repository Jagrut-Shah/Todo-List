
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Calendar, GripVertical, Trash2, Clock, PlayCircle, PauseCircle, ChevronDown, Flame, AlertCircle, Circle } from 'lucide-react';
import { Task, TaskStatus } from '../types';
import { useTaskStore } from '../store/useTaskStore';
import { isOverdue } from '../utils/dateUtils';

interface TaskBlockProps {
  task: Task;
}

const TaskBlock: React.FC<TaskBlockProps> = ({ task }) => {
  const toggleTask = useTaskStore((state) => state.toggleTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const updateStatus = useTaskStore((state) => state.updateStatus);
  
  const [title, setTitle] = useState(task.title);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(task.title);
  }, [task.title]);

  const handleBlur = () => {
    if (title.trim() !== task.title) {
      updateTask(task.id, { title: title.trim() || 'Untitled' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
  };

  const getStatusConfig = (status: TaskStatus) => {
    switch (status) {
      case 'todo': return { label: 'Not Started', icon: <Clock size={12} />, color: 'bg-white/5 text-slate-400 border-white/10' };
      case 'progress': return { label: 'In Progress', icon: <PlayCircle size={12} />, color: 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse' };
      case 'hold': return { label: 'On Hold', icon: <PauseCircle size={12} />, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'done': return { label: 'Completed', icon: <Check size={12} />, color: 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-900/20' };
    }
  };

  const getPriorityConfig = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return { label: 'High', icon: <Flame size={12} />, color: 'text-red-400 bg-red-400/10 border-red-400/20' };
      case 'medium': return { label: 'Med', icon: <AlertCircle size={12} />, color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' };
      case 'low': return { label: 'Low', icon: <Circle size={12} />, color: 'text-slate-500 bg-white/5 border-white/10' };
    }
  };

  const statusConfig = getStatusConfig(task.status);
  const priorityConfig = getPriorityConfig(task.priority || 'medium');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="group flex items-center gap-3 py-2 px-3 rounded-xl transition-all duration-150 hover:bg-white/5 border border-transparent hover:border-white/5"
    >
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-40 transition-opacity cursor-grab text-slate-500">
        <GripVertical size={16} />
      </div>

      <button
        onClick={() => toggleTask(task.id)}
        className={`flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${
          task.completed
            ? 'bg-red-600 border-red-600 text-white shadow-sm'
            : 'border-white/20 bg-black/20 hover:border-red-500'
        }`}
      >
        {task.completed && <Check size={14} strokeWidth={4} />}
      </button>

      {/* Priority Indicator */}
      <div className="relative">
        <button
          onClick={() => setIsPriorityOpen(!isPriorityOpen)}
          className={`flex items-center justify-center p-1 rounded-md border transition-all active:scale-95 ${priorityConfig.color} ${task.completed ? 'opacity-20' : ''}`}
          title={`Priority: ${priorityConfig.label}`}
        >
          {priorityConfig.icon}
        </button>

        <AnimatePresence>
          {isPriorityOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsPriorityOpen(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute left-0 mt-2 w-32 p-1.5 bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl z-50 backdrop-blur-xl"
              >
                {(['high', 'medium', 'low'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      updateTask(task.id, { priority: p });
                      setIsPriorityOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-[11px] font-bold text-slate-400 hover:bg-white/5 hover:text-red-400 rounded-lg transition-colors text-left"
                  >
                    <div className={getPriorityConfig(p).color}>
                      {getPriorityConfig(p).icon}
                    </div>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-grow min-w-0">
        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`w-full bg-transparent border-none outline-none text-[14px] font-semibold tracking-tight transition-all duration-200 ${
            task.completed ? 'text-slate-600 line-through' : 'text-slate-100'
          }`}
          placeholder="Task title..."
        />
      </div>

      {/* Status Picker Pill */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setIsStatusOpen(!isStatusOpen)}
          className={`flex items-center gap-2 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 ${statusConfig.color}`}
        >
          {statusConfig.icon}
          <span className="hidden sm:inline">{statusConfig.label}</span>
          <ChevronDown size={10} className="opacity-40" />
        </button>

        <AnimatePresence>
          {isStatusOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsStatusOpen(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 mt-2 w-40 p-1.5 bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl z-50 backdrop-blur-xl"
              >
                {(['todo', 'progress', 'hold', 'done'] as TaskStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      updateStatus(task.id, s);
                      setIsStatusOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-[11px] font-bold text-slate-400 hover:bg-white/5 hover:text-red-400 rounded-lg transition-colors text-left"
                  >
                    <div className={getStatusConfig(s).color.split(' ')[1]}>
                      {getStatusConfig(s).icon}
                    </div>
                    {getStatusConfig(s).label}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={() => deleteTask(task.id)}
        className="opacity-0 group-hover:opacity-40 p-1.5 text-slate-500 hover:text-red-500 transition-all rounded-lg"
      >
        <Trash2 size={16} />
      </button>
    </motion.div>
  );
};

export default TaskBlock;
