import type { Task, User, Category, Status } from '@/types';

export const users: User[] = [
  { id: 'user-1', name: 'Alisa M.', avatarUrl: 'https://placehold.co/32x32/E9D5FF/6750A4', },
  { id: 'user-2', name: 'Ben C.', avatarUrl: 'https://placehold.co/32x32/C6B5F0/6750A4' },
  { id: 'user-3', name: 'Carla S.', avatarUrl: 'https://placehold.co/32x32/AC92EC/FFFFFF' },
];

export let categories: Category[] = [
  { id: 'cat-1', name: 'Frontend', color: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200 border border-sky-200 dark:border-sky-700' },
  { id: 'cat-2', name: 'Backend', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-700' },
  { id: 'cat-3', name: 'Design', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-700' },
  { id: 'cat-4', name: 'Bug', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border border-red-200 dark:border-red-700' },
  { id: 'cat-5', name: 'Feature', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700' },
];

export const statuses: Status[] = ['Backlog', 'Todo', 'In Progress', 'Done'];

export let tasks: Task[] = [
  {
    id: 'task-1',
    title: 'Implement user authentication',
    description: 'Set up NextAuth.js with email/password and Google providers.',
    status: 'In Progress',
    assignee: users[0],
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    categories: [categories[1], categories[0]],
    subtasks: [
      { id: 'sub-1-1', text: 'Configure NextAuth.js', completed: true },
      { id: 'sub-1-2', text: 'Add Google provider', completed: false },
      { id: 'sub-1-3', text: 'Create sign-in page UI', completed: false },
    ],
  },
  {
    id: 'task-2',
    title: 'Design the new dashboard layout',
    description: 'Create Figma mockups for the new responsive dashboard.',
    status: 'Todo',
    assignee: users[2],
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    categories: [categories[2]],
    subtasks: [
      { id: 'sub-2-1', text: 'Mobile view mockup', completed: false },
      { id: 'sub-2-2', text: 'Tablet view mockup', completed: false },
      { id: 'sub-2-3', text: 'Desktop view mockup', completed: false },
    ],
  },
  {
    id: 'task-3',
    title: 'Fix API rate limiting issue',
    description: 'The /api/items endpoint is hitting rate limits from the external service.',
    status: 'In Progress',
    assignee: users[1],
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    categories: [categories[3], categories[1]],
    subtasks: [],
  },
  {
    id: 'task-4',
    title: 'Setup CI/CD pipeline',
    description: 'Configure GitHub Actions to automatically deploy to Vercel.',
    status: 'Done',
    assignee: users[0],
    dueDate: new Date(new Date().setDate(new Date().getDate() - 2)),
    categories: [categories[1]],
    subtasks: [
      { id: 'sub-4-1', text: 'Create deploy.yml', completed: true },
      { id: 'sub-4-2', text: 'Add Vercel secrets to GitHub', completed: true },
    ],
  },
  {
    id: 'task-5',
    title: 'Refactor database schema',
    description: 'Normalize the `products` table and add indices for performance.',
    status: 'Backlog',
    categories: [categories[1]],
    subtasks: [],
  },
  {
    id: 'task-6',
    title: 'Create onboarding tutorial',
    description: 'Develop a multi-step tutorial for new users.',
    status: 'Todo',
    assignee: users[2],
    categories: [categories[0], categories[2]],
    subtasks: [
      { id: 'sub-6-1', text: 'Write tutorial copy', completed: false },
      { id: 'sub-6-2', text: 'Implement tutorial component', completed: false },
    ],
  },
    {
    id: 'task-7',
    title: 'Optimize image loading performance',
    description: 'Use next/image for all user-facing images and implement lazy loading.',
    status: 'Todo',
    assignee: users[0],
    dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    categories: [categories[0]],
    subtasks: [
      { id: 'sub-7-1', text: 'Replace `<img>` with `<Image>`', completed: false },
      { id: 'sub-7-2', text: 'Audit LCP score', completed: false },
    ],
  },
  {
    id: 'task-8',
    title: 'User profile page redesign',
    description: 'Redesign the user profile page to be more modern and intuitive.',
    status: 'Done',
    assignee: users[2],
    dueDate: new Date(new Date().setDate(new Date().getDate() - 5)),
    categories: [categories[2]],
    subtasks: [
        { id: 'sub-8-1', text: 'Finalize color palette', completed: true },
        { id: 'sub-8-2', text: 'Implement new layout', completed: true },
    ],
  },
];
