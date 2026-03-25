import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import BoardView from './views/BoardView';
import ListView from './views/ListView';
import TimelineView from './views/TimelineView';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<BoardView />} />
        <Route path="list" element={<ListView />} />
        <Route path="timeline" element={<TimelineView />} />
      </Route>
    </Routes>
  );
}

export default App;