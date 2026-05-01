import { addDays, formatISO } from 'date-fns';
import { CollabUser, Task, TaskPriority, TaskStatus } from '../types';

export const USERS: Omit<CollabUser, 'activeTaskId'>[] = [
  { id: 'u-1', name: 'Alex Johnson', initials: 'AJ', color: '#2563eb' },
  { id: 'u-2', name: 'Priya Patel', initials: 'PP', color: '#059669' },
  { id: 'u-3', name: 'Marco Lee', initials: 'ML', color: '#db2777' },
  { id: 'u-4', name: 'Noah Kim', initials: 'NK', color: '#d97706' },
  { id: 'u-5', name: 'Sara Gomez', initials: 'SG', color: '#7c3aed' },
  { id: 'u-6', name: 'Liam Chen', initials: 'LC', color: '#0f766e' },
];

const STATUSES: TaskStatus[] = ['To Do', 'In Progress', 'In Review', 'Done'];
const PRIORITIES: TaskPriority[] = ['Critical', 'High', 'Medium', 'Low'];

function dateOnly(date: Date): string {
  return formatISO(date, { representation: 'date' });
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(values: T[]): T {
  return values[randomInt(0, values.length - 1)];
}

const TITLE_PREFIXES = [
  'Design',
  'Refactor',
  'Implement',
  'Validate',
  'Investigate',
  'Document',
  'Optimize',
  'Migrate',
];

const TITLE_SUBJECTS = [
  'auth flow',
  'notification pipeline',
  'dashboard filters',
  'report export',
  'search indexing',
  'timeline rendering',
  'task assignment rules',
  'API retries',
  'mobile layout',
  'cache invalidation',
  'audit logging',
  'release checklist',
];

export function generateMockTasks(count = 500): Task[] {
  const now = new Date();

  return Array.from({ length: count }, (_, i) => {
    const status = pickRandom(STATUSES);
    const priority = pickRandom(PRIORITIES);
    const assignee = pickRandom(USERS);

    // Ensure useful edge-case coverage in deterministic proportions.
    const isOverdue = i % 6 === 0;
    const hasMissingStartDate = i % 10 === 0;

    let dueDate: Date;
    let startDateValue = '';

    if (isOverdue) {
      dueDate = addDays(now, -randomInt(1, 35));
      if (!hasMissingStartDate) {
        startDateValue = dateOnly(addDays(dueDate, -randomInt(1, 14)));
      }
    } else {
      dueDate = addDays(now, randomInt(1, 45));
      if (!hasMissingStartDate) {
        startDateValue = dateOnly(addDays(dueDate, -randomInt(1, 21)));
      }
    }

    return {
      id: `task-${i + 1}`,
      title: `${pickRandom(TITLE_PREFIXES)} ${pickRandom(TITLE_SUBJECTS)} #${i + 1}`,
      status,
      priority,
      assigneeId: assignee.id,
      startDate: startDateValue,
      dueDate: dateOnly(dueDate),
    };
  });
}
//active user 
export function generateInitialCollabUsers(): CollabUser[] {
  const starterTasks = generateMockTasks(10);
  return USERS.map((user, i) => ({
    ...user,
    activeTaskId: i < 3 ? starterTasks[i].id : null,
  }));
}
