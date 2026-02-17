
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskStore, TaskStatus } from '../types';
import { parseTaskInput } from '../utils/dateUtils';

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      activeView: 'Today',
      activeWorkspace: 'Brief',
      setActiveView: (view) => set({ activeView: view }),
      toggleWorkspace: () => set((state) => ({ 
        activeWorkspace: state.activeWorkspace === 'Personal' ? 'Brief' : 'Personal' 
      })),
      addTask: (input) => {
        const { title, dueDate } = parseTaskInput(input);
        const newTask: Task = {
          id: crypto.randomUUID(),
          title: title || 'Untitled Task',
          dueDate,
          completed: false,
          status: 'todo',
          createdAt: new Date(),
          priority: 'medium',
        };
        set((state) => ({
          tasks: [newTask, ...state.tasks],
        }));
      },
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },
      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id === id) {
              const nextCompleted = !t.completed;
              return { 
                ...t, 
                completed: nextCompleted, 
                status: nextCompleted ? 'done' : 'todo' 
              };
            }
            return t;
          }),
        }));
      },
      updateStatus: (id, status) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status, completed: status === 'done' } : t
          ),
        }));
      },
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },
      clearCompleted: () => {
        set((state) => ({
          tasks: state.tasks.filter((t) => !t.completed),
        }));
      },
    }),
    {
      name: 'brief-light-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.tasks = state.tasks.map((t: any) => ({
            ...t,
            dueDate: t.dueDate ? new Date(t.dueDate) : null,
            createdAt: new Date(t.createdAt),
          }));
        }
      },
    }
  )
);
