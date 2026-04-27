import React, { useState, DragEvent } from 'react';
import { useStore } from '../store/useStore';
import { useFilteredTasks } from '../hooks/useFilteredTasks';
import { Task, TaskStatus } from '../types';
import { USERS } from '../utils/generateData';
import { isBefore, isToday, differenceInDays, parseISO } from 'date-fns';

export default function BoardView() {
  const filteredTasks = useFilteredTasks();
  const updateTaskStatus = useStore(state => state.updateTaskStatus);
  const collabUsers = useStore(state => state.collabUsers);

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<TaskStatus | null>(null);

  const columns: TaskStatus[] = ['To Do', 'In Progress', 'In Review', 'Done'];

  const handleDragStart = (e: DragEvent<HTMLDivElement>, task: Task) => {
    setDraggedTaskId(task.id);
    
    // Fallback for native HTML5 drag img option
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
    
    // Delay adding visual state to the dragged element itselfhe native ghost image looks normal
    requestAnimationFrame(() => {
      const el = document.getElementById(`task-${task.id}`);
      if (el) {
        el.classList.add('opacity-30', 'shadow-2xl', 'scale-105', 'z-50');
      }
    });
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, col: TaskStatus) => {
    e.preventDefault(); // allow drop
    if (activeDropZone !== col) {
      setActiveDropZone(col);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, col: TaskStatus) => {
    e.preventDefault();
    setActiveDropZone(null);
    const id = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (id) {
      updateTaskStatus(id, col);
    }
    cleanupDragState(id);
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActiveDropZone(null);
    cleanupDragState(draggedTaskId);
  };

  const cleanupDragState = (id: string | null) => {
    if (id) {
      const el = document.getElementById(`task-${id}`);
      if (el) {
        el.classList.remove('opacity-30', 'shadow-2xl', 'scale-105', 'z-50');
      }
    }
    setDraggedTaskId(null);
  };

  return (
    <div className="flex gap-3 p-4 h-full overflow-x-auto select-none bg-white">
      {columns.map(col => {
        const colTasks = filteredTasks.filter(t => t.status === col);
        const isActiveZone = activeDropZone === col;
        
        return (
          <div 
            key={col} 
            className={`w-80 min-w-[300px] bg-gray-50 flex flex-col rounded-md transition-colors border ${
              isActiveZone ? 'border-gray-500' : 'border-gray-200'
            }`}
            onDragOver={(e) => handleDragOver(e, col)}
            onDrop={(e) => handleDrop(e, col)}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
              <h2 className="font-medium text-gray-700 text-sm">{col}</h2>
              <span className="text-xs text-gray-500">
                {colTasks.length}
              </span>
            </div>

            {/* List area */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {colTasks.length === 0 ? (
                <div className="h-20 border border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400 text-xs">
                  Drop tasks here
                </div>
              ) : (
                colTasks.map((task) => {
                  const isBeingDragged = draggedTaskId === task.id;
                  
                  return (
                    <div
                      key={task.id}
                      id={`task-${task.id}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      onDragEnd={handleDragEnd}
                      className={`bg-white p-3 rounded-md border border-gray-200 cursor-grab transition-colors hover:border-gray-300 ${
                        isBeingDragged ? 'opacity-30' : ''
                      }`}
                    >
                       <TaskCard task={task} />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const assignee = USERS.find(u => u.id === task.assigneeId);
  const bgColors: Record<string, string> = {
    'Critical': 'bg-red-100 text-red-700',
    'High': 'bg-orange-100 text-orange-700',
    'Medium': 'bg-blue-100 text-blue-700',
    'Low': 'bg-gray-100 text-gray-700',
  };

  const dueDate = parseISO(task.dueDate);
  const now = new Date();
  const isPast = isBefore(dueDate, now) && !isToday(dueDate);
  const isDueToday = isToday(dueDate);
  const daysDiff = differenceInDays(now, dueDate);

  let dateText = task.dueDate;
  if (isDueToday) dateText = 'Due Today';
  else if (isPast && daysDiff > 7) dateText = `${daysDiff} days overdue`;

  return (
    <>
      <div className="mb-2">
        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${bgColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      <h3 className="text-sm text-gray-900 mb-2 leading-5">{task.title}</h3>
      
      <div className="flex items-center justify-between mt-auto">
        <div className={`text-xs px-2 py-1 rounded bg-gray-50 ${isPast ? 'text-red-600 bg-red-50' : 'text-gray-500'}`}>
           {dateText}
        </div>
        
        {assignee && (
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-medium"
            style={{ backgroundColor: assignee.color }}
            title={assignee.name}
          >
            {assignee.initials}
          </div>
        )}
      </div>
    </>
  );
}