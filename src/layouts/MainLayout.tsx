import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import Header from '../components/Header';
//for main layout
export default function MainLayout() {
  return (
    <div className="h-screen flex flex-col bg-white text-gray-900">
      <Header />
      
      <div className="border-b bg-white px-4 py-2 flex items-center gap-2 text-sm">
        <NavLink to="/" end className={({ isActive }) => `px-3 py-1.5 rounded-md ${isActive ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
         Kanban Board View
        </NavLink>
        <NavLink to="/list" className={({ isActive }) => `px-3 py-1.5 rounded-md ${isActive ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
          List
        </NavLink>
        <NavLink to="/timeline" className={({ isActive }) => `px-3 py-1.5 rounded-md ${isActive ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
          Timeline/Gantt View
        </NavLink>
      </div>

      <FilterBar />

      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}