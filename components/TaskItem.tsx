
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Calendar, GripVertical } from 'lucide-react';
import { Task } from '../types';
import { useTaskStore } from '../store/useTaskStore';
import { isOverdue, isToday } from '../utils/dateUtils';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const toggleTask = useTaskStore((state) => state.toggleTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const formattedDate = task.dueDate ? new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: task.dueDate.getHours() === 0 && task.dueDate.getMinutes() === 0 ? undefined : 'numeric',
    minute: task.dueDate.getHours() === 0 && task.dueDate.getMinutes() === 0 ? undefined : '2-digit',
  }).format(task.dueDate) : null;

  const isLate = task.dueDate && isOverdue(task.dueDate) && !task.completed;
  const isNow = task.dueDate && isToday(task.dueDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="group flex items-start gap-2 p-2 rounded-md transition-all duration-150 hover:bg-zinc-900"
    >
      <div className="flex-shrink-0 mt-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical size={16} className="text-zinc-700" />
      </div>

      <button
        onClick={() => toggleTask(task.id)}
        className={`flex-shrink-0 mt-1 w-4.5 h-4.5 rounded border flex items-center justify-center transition-all duration-200 ${
          task.completed
            ? 'bg-red-600 border-red-600 text-white shadow-sm'
            : 'border-zinc-700 hover:border-red-500 bg-zinc-950'
        }`}
      >
        {task.completed && <Check size={12} strokeWidth={4} />}
      </button>

      <div className="flex-grow flex flex-col min-w-0 pt-0.5">
        <span className={`text-[15px] font-medium transition-all duration-200 leading-tight ${
          task.completed ? 'text-zinc-600 line-through' : 'text-zinc-200'
        }`}>
          {task.title}
        </span>
        
        {task.dueDate && !task.completed && (
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[12px] flex items-center gap-1.5 font-medium ${
              isLate ? 'text-red-500' : isNow ? 'text-red-400' : 'text-zinc-500'
            }`}>
              <Calendar size={12} />
              {formattedDate}
            </span>
          </div>
        )}
      </div>

      <button
        onClick={() => deleteTask(task.id)}
        className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all rounded"
      >
        <Trash2 size={14} />
      </button>
    </motion.div>
  );
};

export default TaskItem;
