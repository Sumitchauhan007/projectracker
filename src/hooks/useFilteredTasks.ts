import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Task } from '../types';

export function useFilteredTasks() {
  const tasks = useStore(state => state.tasks);
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    return tasks.filter(task => {
      // Status filter
      const statusFilters = searchParams.getAll('status');
      if (statusFilters.length > 0 && !statusFilters.includes(task.status)) {
        return false;
      }
      
      // Priority filter
      const priorityFilters = searchParams.getAll('priority');
      if (priorityFilters.length > 0 && !priorityFilters.includes(task.priority)) {
        return false;
      }
      
      // Could add Assignee and Date Range filters here too
      
      return true;
    });
  }, [tasks, searchParams]);
}