import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';

export default function Header() {
  const collabUsers = useStore((state) => state.collabUsers);
  
  // Real-time collaboration simulation logic (moves users around randomly)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random movement of users between tasks
      const state = useStore.getState();
      const allTaskIds = state.tasks.slice(0, 50).map(t => t.id); // Just pick from first 50
      
      if (allTaskIds.length === 0) return;
      
      const newCollabUsers = state.collabUsers.map(user => {
        if (Math.random() > 0.7) { // 30% chance to move
          return {
            ...user,
            activeTaskId: Math.random() > 0.2 ? allTaskIds[Math.floor(Math.random() * allTaskIds.length)] : null
          };
        }
        return user;
      });
      
      state.updateCollabUsers(newCollabUsers);
    }, 3000); // Check every 3seconds
    
    return () => clearInterval(interval);
  }, []);

  const activeUsersCount = collabUsers.filter(u => u.activeTaskId !== null).length;
  const visibleUsers = collabUsers.slice(0, 4);
  const hiddenUsers = Math.max(0, collabUsers.length - visibleUsers.length);

  return (
    <header className="h-12 bg-white border-b px-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span>{activeUsersCount} viewing</span>
        <div className="flex -space-x-1.5">
          {visibleUsers.map(user => (
            <div 
              key={user.id} 
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-medium border border-white"
              style={{ backgroundColor: user.color }}
              title={user.name}
            >
              {user.initials}
            </div>
          ))}
          {hiddenUsers > 0 && (
            <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-[10px] flex items-center justify-center border border-white">
              +{hiddenUsers}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <h1 className="font-semibold text-base">Project Tracker</h1>
      </div>
    </header>
  );
}