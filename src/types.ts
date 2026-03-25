export type TaskStatus = 'To Do' | 'In Progress' | 'In Review' | 'Done';

export type TaskPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  startDate: string;
  dueDate: string;
};

export type CollabUser = {
  id: string;
  name: string;
  initials: string;
  color: string;
  activeTaskId: string | null;
};
