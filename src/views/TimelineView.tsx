import React, { useMemo } from 'react';
import { useFilteredTasks } from '../hooks/useFilteredTasks';
import { Task } from '../types';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isToday, parseISO, isBefore, getDaysInMonth, differenceInDays } from 'date-fns';

export default function TimelineView() {
  const filteredTasks = useFilteredTasks();

  const now = new Date();
  const startMonth = startOfMonth(now);
  const endMonth = endOfMonth(now);
  
  const days = eachDayOfInterval({ start: startMonth, end: endMonth });
  const totalDays = getDaysInMonth(now);

  const priorityColors = {
    'Critical': 'bg-red-500',
    'High': 'bg-orange-500',
    'Medium': 'bg-blue-500',
    'Low': 'bg-gray-400',
  };

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto relative">
        <div className="min-w-fit flex flex-col relative" style={{ minWidth: `${totalDays * 40 + 200}px` }}> {/* 40px per */}
           
           {/* Header Grid */}
           <div className="sticky top-0 z-20 flex bg-white border-b border-gray-200">
             <div className="w-[200px] sticky left-0 z-30 bg-white border-r border-gray-200 p-2 font-semibold text-sm text-gray-700 flex items-end">
               Task
             </div>
             <div className="flex">
               {days.map((day, i) => (
                 <div key={i} className={`w-[40px] flex-shrink-0 text-center text-xs py-2 border-r border-gray-100 ${isToday(day) ? 'bg-blue-50 font-bold text-blue-600' : 'text-gray-500'}`}>
                   <div>{format(day, 'EEE')}</div>
                   <div className="mt-1">{format(day, 'd')}</div>
                 </div>
               ))}
             </div>
           </div>

           {/* Timeline Body Grid */}
           <div className="relative border-b flex-1 border-gray-100" style={{minHeight: filteredTasks.length * 40}}>
             
             {/* Background Grid Lines & Today Line */}
             <div className="absolute inset-0 flex pl-[200px] pointer-events-none">
                {days.map((day, i) => (
                 <div key={i} className={`w-[40px] flex-shrink-0 border-r border-gray-100 ${isToday(day) ? 'bg-blue-50/30 border-blue-200 border-r-2 z-0 relative' : ''}`}>
                 </div>
               ))}
             </div>

             {/* Rows */}
             {filteredTasks.map((task, rowIndex) => {
               // Calculate bar positions
               let leftOffset = 0;
               let width = 0;

               const startDateStr = task.startDate;
               const dueDateStr = task.dueDate;
               
               let taskStart = startDateStr ? parseISO(startDateStr) : parseISO(dueDateStr);
               const taskEnd = parseISO(dueDateStr);

               // Handle constraints viewing only current month
               if (differenceInDays(taskEnd, startMonth) < 0) return null; // entirely before
               if (differenceInDays(taskStart, endMonth) > 0) return null; // entirely after

               // Clamp to current month visually
               const visualStart = isBefore(taskStart, startMonth) ? startMonth : taskStart;
               const visualEnd = differenceInDays(taskEnd, endMonth) > 0 ? endMonth : taskEnd;

               const startDayIndex = differenceInDays(visualStart, startMonth);
               const lengthDays = Math.max(1, differenceInDays(visualEnd, visualStart) + 1);

               return (
                 <div key={task.id} className="flex relative items-center border-b border-opacity-50 border-gray-100 group hover:bg-gray-50/50" style={{ height: 40}}>
                    {/* Sticky Label */}
                    <div className="w-[200px] sticky left-0 z-10 bg-white group-hover:bg-gray-50 flex items-center px-3 border-r border-gray-200 truncate">
                      <span className="text-xs truncate font-medium">{task.title}</span>
                    </div>

                    <div className="relative w-full h-full flex items-center">
                      <div 
                        className={`absolute rounded-sm shadow-sm h-6 group-hover:h-8 hover:!bg-opacity-100 transition-all cursor-pointer flex items-center px-2 text-white text-[10px] truncate ${priorityColors[task.priority] || 'bg-gray-400'}`}
                        style={{ 
                          left: `${startDayIndex * 40 + 4}px`, 
                          width: `${lengthDays * 40 - 8}px`,
                          zIndex: 5
                        }}
                        title={`${task.title} (${task.priority})`}
                      >
                         {lengthDays > 1 ? task.title : ''}
                      </div>
                    </div>
                 </div>
               );
             })}
           </div>

        </div>
      </div>
    </div>
  );
}