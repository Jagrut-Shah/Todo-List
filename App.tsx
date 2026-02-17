
import React, { useMemo } from 'react';
import MainLayout from './components/MainLayout';
import CommandMenu from './components/CommandMenu';
import TaskGroup from './components/TaskGroup';
import { useTaskStore } from './store/useTaskStore';
import { isToday, isOverdue, isUpcoming } from './utils/dateUtils';
import { Inbox, Share2, MoreHorizontal, Flame, Layout, Terminal, Zap, Clock, Tag, PlayCircle, PauseCircle, CheckCircle2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import TaskBlock from './components/TaskBlock';

const ViewPoster: React.FC<{ view: string }> = ({ view }) => {
  const getPosterMeta = () => {
    switch (view) {
      case 'Today': return { icon: <Zap size={14}/>, subtitle: "URGENT FOCUS", code: "T-01" };
      case 'All': return { icon: <Clock size={14}/>, subtitle: "GLOBAL VIEW", code: "A-XX" };
      case 'Hot': return { icon: <Flame size={14}/>, subtitle: "HIGH PRIORITY", code: "H-PR" };
      case 'Queue': return { icon: <Tag size={14}/>, subtitle: "BACKLOG", code: "Q-99" };
      default: return { icon: <Flame size={14}/>, subtitle: "MISSION", code: "M-01" };
    }
  };

  const meta = getPosterMeta();

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full h-[280px] rounded-b-[48px] overflow-hidden bg-[#010409] border-x border-b border-white/5 mb-8 shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] to-[#010409]" />
      <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
        <span className="text-[160px] font-black leading-none select-none tracking-tighter text-red-600 font-mono">{meta.code}</span>
      </div>
      
      <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
      
      <div className="absolute bottom-0 left-0 p-12 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-red-600 text-white rounded-full font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg shadow-red-900/40">
            {meta.icon}
            {meta.subtitle}
          </div>
          <div className="h-px w-8 bg-white/10" />
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">System Online</span>
        </div>
        <h1 className="text-6xl font-black text-slate-100 tracking-tighter uppercase leading-tight">
          {view === 'All' ? 'Tasks' : view}
        </h1>
        <p className="text-slate-400 font-bold max-w-sm mt-1 text-sm leading-relaxed tracking-wide uppercase opacity-80">
          Jagrut's Todo List
        </p>
      </div>

      <div className="absolute top-8 right-8 flex gap-1">
        {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-red-500/20" />)}
      </div>
    </motion.div>
  );
};

const SummaryDashboard: React.FC<{ tasks: any[] }> = ({ tasks }) => {
  const stats = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      progress: tasks.filter(t => t.status === 'progress').length,
      hold: tasks.filter(t => t.status === 'hold').length,
      done: tasks.filter(t => t.status === 'done').length,
    };
  }, [tasks]);

  return (
    <div className="grid grid-cols-4 gap-4 mb-12">
      {[
        { label: 'Not Started', count: stats.todo, icon: <Clock size={16} />, color: 'bg-white/5 border-white/5 text-slate-400' },
        { label: 'In Progress', count: stats.progress, icon: <PlayCircle size={16} />, color: 'bg-red-500/5 border-red-500/10 text-red-400' },
        { label: 'On Hold', count: stats.hold, icon: <PauseCircle size={16} />, color: 'bg-amber-500/5 border-amber-500/10 text-amber-400' },
        { label: 'Completed', count: stats.done, icon: <CheckCircle2 size={16} />, color: 'bg-green-500/5 border-green-500/10 text-green-400' },
      ].map((stat, idx) => (
        <motion.div 
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`p-4 rounded-2xl border ${stat.color} flex flex-col gap-1 shadow-sm transition-all hover:scale-105 cursor-default hover:bg-white/10`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{stat.label}</span>
            <div className="opacity-30">{stat.icon}</div>
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-100">{stat.count}</span>
        </motion.div>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const clearCompleted = useTaskStore((state) => state.clearCompleted);
  const activeView = useTaskStore((state) => state.activeView);

  const filteredTasks = useMemo(() => {
    if (activeView === 'Today') {
      return tasks.filter(t => (t.dueDate && isToday(t.dueDate) || (!t.dueDate)) && !t.completed);
    }
    return tasks; 
  }, [tasks, activeView]);

  const groups = useMemo(() => {
    const overdue = filteredTasks.filter(t => t.dueDate && isOverdue(t.dueDate) && !t.completed);
    const today = filteredTasks.filter(t => (t.dueDate && isToday(t.dueDate) || (!t.dueDate && activeView === 'Today')) && !t.completed);
    const upcoming = filteredTasks.filter(t => t.dueDate && isUpcoming(t.dueDate) && !t.completed);
    const completed = filteredTasks.filter(t => t.completed);

    return { overdue, today, upcoming, completed };
  }, [filteredTasks, activeView]);

  return (
    <MainLayout>
      <CommandMenu />
      
      <ViewPoster view={activeView} />

      <motion.main 
        key={activeView}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-12 max-w-[900px] mx-auto"
      >
        {activeView === 'All' && <SummaryDashboard tasks={tasks} />}

        {filteredTasks.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-[28px] bg-white/5 shadow-sm flex items-center justify-center mb-8 border border-white/10">
              <Inbox size={32} className="text-slate-600" />
            </div>
            <h2 className="text-xl font-black text-slate-200 mb-2 tracking-tight uppercase">No Objectives</h2>
            <p className="text-slate-500 max-w-[280px] font-medium text-sm">Workspace is optimized. No pending tasks for this section.</p>
            <button 
              onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
              className="mt-8 px-8 py-3 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 shadow-lg shadow-red-900/40"
            >
              Add Task
            </button>
          </div>
        ) : (
          <div className="space-y-12 pb-20">
            <TaskGroup title="Overdue" tasks={groups.overdue} count={groups.overdue.length} />
            <TaskGroup title="Today" tasks={groups.today} count={groups.today.length} />
            <TaskGroup title="Upcoming" tasks={groups.upcoming} count={groups.upcoming.length} />
            
            {groups.completed.length > 0 && (
              <div className="mt-20 pt-12 border-t border-white/10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
                    History
                  </h3>
                  <button 
                    onClick={() => { if (confirm("Permanently delete archive?")) clearCompleted(); }}
                    className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-red-500 transition-colors"
                  >
                    Purge
                  </button>
                </div>
                <div className="opacity-40 grayscale-[50%] hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                  <AnimatePresence mode="popLayout">
                    {groups.completed.map((task) => (
                      <TaskBlock key={task.id} task={task} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.main>
    </MainLayout>
  );
};

export default App;
