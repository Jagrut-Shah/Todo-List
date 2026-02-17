
import React from 'react';
import { 
  Search, 
  Clock, 
  ChevronRight,
  Flame,
  Zap,
  Inbox
} from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 w-[calc(100%-16px)] px-3 py-2.5 mx-2 rounded-lg group transition-all duration-200 text-left outline-none ${
      active 
        ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
        : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
    }`}
  >
    <div className={`flex items-center justify-center transition-colors ${
      active ? 'text-red-500' : 'text-slate-500 group-hover:text-red-400'
    }`}>
      {icon}
    </div>
    <span className={`text-[13px] font-semibold tracking-tight ${
      active ? 'text-slate-100' : 'group-hover:text-slate-100'
    }`}>{label}</span>
  </button>
);

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const activeView = useTaskStore((state) => state.activeView);
  const setActiveView = useTaskStore((state) => state.setActiveView);
  const activeWorkspace = useTaskStore((state) => state.activeWorkspace);
  const toggleWorkspace = useTaskStore((state) => state.toggleWorkspace);

  const triggerSearch = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden text-slate-100 relative bg-[#020617]">
      <aside className="w-[240px] flex-shrink-0 bg-[#010409]/80 backdrop-blur-xl flex flex-col z-20 border-r border-white/5">
        <div className="p-5">
          <button 
            onClick={toggleWorkspace}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-all duration-300 group outline-none active:scale-95"
          >
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]">
              {activeWorkspace === 'Personal' ? <Zap size={18} strokeWidth={3} /> : <Flame size={18} strokeWidth={3} />}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[13px] font-bold text-slate-100 tracking-tight">{activeWorkspace}</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Workspace</span>
            </div>
          </button>
        </div>

        <div className="px-1 space-y-1 flex-grow">
          <SidebarItem icon={<Search size={16} />} label="Find" onClick={triggerSearch} />
          <SidebarItem icon={<Clock size={16} />} label="Tasks" active={activeView === 'All'} onClick={() => setActiveView('All')} />
          <SidebarItem icon={<Inbox size={16} />} label="Today" active={activeView === 'Today'} onClick={() => setActiveView('Today')} />
        </div>

        <div className="p-6 border-t border-white/5 flex flex-col gap-4">
           <div className="flex items-center gap-2 px-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Ready</span>
           </div>
        </div>
      </aside>

      <main className="flex-grow h-screen overflow-y-auto relative bg-transparent scrollbar-none">
        <div className="max-w-[1200px] mx-auto min-h-full pb-20 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
