# Project Tracker

A React + TypeScript task management app with three synchronized views:
- Kanban board view
- List view with virtual scrolling
- Timeline/Gantt-style view

The app uses a shared Zustand store, URL-driven filters, and seeded mock data (500+ tasks) to test scale and edge cases.

## Setup Instructions

### 1) Prerequisites
- Node.js 18+
- npm 9+

### 2) Install dependencies
```bash
npm install
```

### 3) Start development server
```bash
npm run dev
```
Open: `http://localhost:5173`

### 4) Build for production
```bash
npm run build
```

### 5) Preview production build
```bash
npm run preview
```

## State Management Decision (Why Zustand)

This project uses Zustand (`src/store/useStore.ts`) as the single source of truth for task and collaboration state.

### Why Zustand was chosen
- Minimal boilerplate compared to Redux-like setups
- Simple hook-based API for component-level subscriptions
- Easy immutable updates for task status changes
- Works well for medium-sized client-side apps without complex middleware requirements

### What is stored centrally
- `tasks`: all task entities (seeded from generator)
- `collabUsers`: simulated viewer/collaboration presence
- `updateTaskStatus(taskId, status)`: updates task status across all views
- `updateCollabUsers(users)`: updates collaboration activity in header

### Architectural benefit
All views (Kanban, List, Timeline) read from the same task array, so any update in one view appears immediately in the others with no manual sync logic.

## Virtual Scrolling Implementation

Virtual scrolling is implemented in `src/components/VirtualScroll.tsx` and used by `src/views/ListView.tsx`.

### How it works
1. The component receives `items`, `itemHeight`, and `containerHeight`.
2. It listens to container `scrollTop`.
3. It computes a visible index window:
   - `startIndex` from current scroll position
   - `endIndex` from visible rows + overscan buffer
4. It renders only sliced items (`items.slice(startIndex, endIndex + 1)`).
5. It uses absolute positioning (`top = index * itemHeight`) inside a full-height spacer container.

### Why this matters
With 500+ seeded tasks, rendering only visible rows significantly reduces DOM nodes and improves scroll smoothness/perceived performance.

## Drag-and-Drop Approach

Drag-and-drop is implemented in `src/views/BoardView.tsx` using native HTML5 drag events (no external DnD library).

### Event flow
1. `onDragStart`
   - Stores dragged task ID in local state
   - Writes task ID to `dataTransfer`
2. `onDragOver`
   - Calls `preventDefault()` to allow drop
   - Marks active drop column for visual feedback
3. `onDrop`
   - Reads dragged task ID from `dataTransfer` (with state fallback)
   - Calls `updateTaskStatus(id, targetColumn)` in Zustand store
4. `onDragEnd`
   - Clears temporary drag state/styles

### Design choice
Native DnD keeps dependencies low and is enough for status-column movement in a Kanban board.

## Lighthouse Screenshot

Place your Lighthouse screenshot in `docs/lighthouse-screenshot.png` and keep this embed:

![Lighthouse Report Screenshot](docs/lighthouse-screenshot.png)

### How to generate Lighthouse report
1. Run app in preview mode:
```bash
npm run build
npm run preview
```
2. Run Lighthouse against local URL (requires Lighthouse CLI):
```bash
npx lighthouse http://localhost:4173 --view
```
3. Capture the screenshot from the Lighthouse report page and save it as:
- `docs/lighthouse-screenshot.png`
