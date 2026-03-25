import { create } from 'zustand';
import { CollabUser, Task, TaskStatus } from '../types';
import { generateInitialCollabUsers, generateMockTasks } from '../utils/generateData';

type StoreState = {
  tasks: Task[];
  collabUsers: CollabUser[];
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  updateCollabUsers: (users: CollabUser[]) => void;
};

export const useStore = create<StoreState>((set) => ({
  tasks: generateMockTasks(),
  collabUsers: generateInitialCollabUsers(),
  updateTaskStatus: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
            }
          : task,
      ),
    })),
  updateCollabUsers: (users) => set({ collabUsers: users }),
}));
