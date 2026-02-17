
import React from 'react';
import { Task, TaskGroupType } from '../types';
import TaskBlock from './TaskBlock';
import SmartInput from './SmartInput';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskGroupProps {
  title: TaskGroupType;
  tasks: Task[];
  count: number;
}

const TaskGroup: React.FC<TaskGroupProps> = ({ title, tasks, count }) => {
  const isToday = title === 'Today';

  if (tasks.length === 0 && !isToday) return null;

  return (
    <div className="mb-10 last:mb-0">
      <div className="flex items-center gap-3 px-1 mb-3 group">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-red-500/80">
          {title}
        </h3>
        <div className="h-[1px] flex-grow bg-zinc-800/50" />
        <span className="px-2 py-0.5 bg-zinc-900 text-zinc-400 rounded-full text-[10px] font-black border border-zinc-800">
          {count}
        </span>
      </div>
      
      <div className="space-y-1">
        {isToday && <SmartInput />}
        
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <TaskBlock key={task.id} task={task} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskGroup;
