
export type TaskStatus = 'todo' | 'progress' | 'hold' | 'done';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  status: TaskStatus;
  dueDate: Date | null;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
  project?: string;
  tag?: string;
}

export type TaskGroupType = 'Overdue' | 'Today' | 'Upcoming' | 'Someday' | 'All';

export interface TaskStore {
  tasks: Task[];
  activeView: string;
  activeWorkspace: 'Personal' | 'Brief';
  setActiveView: (view: string) => void;
  toggleWorkspace: () => void;
  addTask: (input: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  updateStatus: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;
  clearCompleted: () => void;
}
