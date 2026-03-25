import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useFilteredTasks } from '../hooks/useFilteredTasks';
import { Task, TaskPriority, TaskStatus } from '../types';
import { USERS } from '../utils/generateData';
import { parseISO, isBefore, isToday, differenceInDays } from 'date-fns';
import { useStore } from '../store/useStore';
import { VirtualScroll } from '../components/VirtualScroll';
import { ChevronDown, ChevronUp } from 'lucide-react';

type SortConfig = { key: keyof Task | null, direction: 'asc' | 'desc' };

export default function ListView() {
  const filteredTasks = useFilteredTasks();
  const updateTaskStatus = useStore(state => state.updateTaskStatus);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [containerHeight, setContainerHeight] = useState(500);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measure = () => {
      if(containerRef.current) {
        // subtract heights of header/filters roughly
        setContainerHeight(window.innerHeight - 200); 
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
    'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1
  };

  const sortedTasks = useMemo(() => {
    let sortableItems = [...filteredTasks];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue: any = a[sortConfig.key!];
        let bValue: any = b[sortConfig.key!];

        if (sortConfig.key === 'priority') {
          aValue = PRIORITY_WEIGHT[a.priority as TaskPriority];
          bValue = PRIORITY_WEIGHT[b.priority as TaskPriority];
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredTasks, sortConfig]);

  const requestSort = (key: keyof Task) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key: keyof Task) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-500 h-full">
        <div className="text-lg bg-gray-100 p-6 rounded-lg border border-dashed border-gray-300">
           No tasks match your filters.
        </div>
      </div>
    );
  }

  const renderRow = (task: Task, index: number) => {
    const assignee = USERS.find(u => u.id === task.assigneeId);
    
    return (
      <div className="flex border-b border-gray-100 hover:bg-gray-50 items-center px-4" style={{height: 48}}>
        <div className="w-1/3 flex-shrink-0 font-medium text-sm text-gray-900 truncate pr-4">
          {task.title}
        </div>
        <div className="w-48 flex-shrink-0">
          <select 
            className="text-xs bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500"
            value={task.status}
            onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
          >
             {['To Do', 'In Progress', 'In Review', 'Done'].map(s => (
               <option key={s} value={s}>{s}</option>
             ))}
          </select>
        </div>
        <div className="w-32 flex-shrink-0">
          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded bg-gray-100`}>
             {task.priority}
          </span>
        </div>
        <div className="w-32 flex-shrink-0 flex items-center gap-2">
           {assignee && (
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-medium"
                style={{ backgroundColor: assignee.color }}
                title={assignee.name}
              >
                {assignee.initials}
              </div>
            )}
            <span className="text-xs text-gray-500">{assignee?.name}</span>
        </div>
        <div className="w-32 flex-shrink-0 text-xs text-gray-500">
          {task.dueDate}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-white flex flex-col" ref={containerRef}>
      {/* Header */}
      <div className="flex border-b border-gray-200 bg-gray-50 uppercase text-xs font-semibold text-gray-500 px-4 py-3 shrink-0">
        <div className="w-1/3 flex items-center gap-2 cursor-pointer hover:text-gray-900" onClick={() => requestSort('title')}>
          Title {renderSortIcon('title')}
        </div>
        <div className="w-48">Status</div>
        <div className="w-32 flex items-center gap-2 cursor-pointer hover:text-gray-900" onClick={() => requestSort('priority')}>
          Priority {renderSortIcon('priority')}
        </div>
        <div className="w-32">Assignee</div>
        <div className="w-32 flex items-center gap-2 cursor-pointer hover:text-gray-900" onClick={() => requestSort('dueDate')}>
          Due Date {renderSortIcon('dueDate')}
        </div>
      </div>
      
      {/* Virtualized Body */}
      <div className="flex-1 overflow-hidden">
         <VirtualScroll 
            items={sortedTasks}
            itemHeight={48}
            containerHeight={containerHeight}
            renderItem={renderRow}
         />
      </div>
    </div>
  );
}