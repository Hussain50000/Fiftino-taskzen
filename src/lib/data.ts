import type { Task, User, Category, Status, Project } from '@/types';

export const users: User[] = [
  { id: 'user-1', name: 'Alisa M.', avatarUrl: 'https://placehold.co/32x32/E9D5FF/6750A4', },
  { id: 'user-2', name: 'Ben C.', avatarUrl: 'https://placehold.co/32x32/C6B5F0/6750A4' },
  { id: 'user-3', name: 'Carla S.', avatarUrl: 'https://placehold.co/32x32/AC92EC/FFFFFF' },
];

export let categories: Category[] = [
  { id: 'cat-1', name: 'Frontend', color: '#86efac' },
  { id: 'cat-2', name: 'Backend', color: '#6ee7b7' },
  { id: 'cat-3', name: 'Design', color: '#fcd34d' },
  { id: 'cat-4', name: 'Bug', color: '#fca5a5' },
  { id: 'cat-5', name: 'Feature', color: '#a5b4fc' },
];

export const statuses: Status[] = ['Pending', 'In Progress', 'Complete'];

export let projects: Project[] = [
    { id: 'taskzen-app-development-a1b2c3', name: 'TaskZen App Development', taskCount: 8, imageUrl: 'https://placehold.co/600x400' },
    { id: 'website-redesign-d4e5f6', name: 'Website Redesign', taskCount: 0, imageUrl: 'https://placehold.co/600x400' },
];

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
    projectId: 'taskzen-app-development-a1b2c3',
  },
  {
    id: 'task-2',
    title: 'Design the new dashboard layout',
    description: 'Create Figma mockups for the new responsive dashboard.',
    status: 'Pending',
    assignee: users[2],
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    categories: [categories[2]],
    subtasks: [
      { id: 'sub-2-1', text: 'Mobile view mockup', completed: false },
      { id: 'sub-2-2', text: 'Tablet view mockup', completed: false },
      { id: 'sub-2-3', text: 'Desktop view mockup', completed: false },
    ],
    projectId: 'taskzen-app-development-a1b2c3',
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
    projectId: 'taskzen-app-development-a1b2c3',
  },
  {
    id: 'task-4',
    title: 'Setup CI/CD pipeline',
    description: 'Configure GitHub Actions to automatically deploy to Vercel.',
    status: 'Complete',
    assignee: users[0],
    dueDate: new Date(new Date().setDate(new Date().getDate() - 2)),
    categories: [categories[1]],
    subtasks: [
      { id: 'sub-4-1', text: 'Create deploy.yml', completed: true },
      { id: 'sub-4-2', text: 'Add Vercel secrets to GitHub', completed: true },
    ],
    projectId: 'taskzen-app-development-a1b2c3',
  },
  {
    id: 'task-5',
    title: 'Refactor database schema',
    description: 'Normalize the `products` table and add indices for performance.',
    status: 'Pending',
    categories: [categories[1]],
    subtasks: [],
    projectId: 'taskzen-app-development-a1b2c3',
  },
  {
    id: 'task-6',
    title: 'Create onboarding tutorial',
    description: 'Develop a multi-step tutorial for new users.',
    status: 'Pending',
    assignee: users[2],
    categories: [categories[0], categories[2]],
    subtasks: [
      { id: 'sub-6-1', text: 'Write tutorial copy', completed: false },
      { id: 'sub-6-2', text: 'Implement tutorial component', completed: false },
    ],
    projectId: 'taskzen-app-development-a1b2c3',
  },
    {
    id: 'task-7',
    title: 'Optimize image loading performance',
    description: 'Use next/image for all user-facing images and implement lazy loading.',
    status: 'Pending',
    assignee: users[0],
    dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    categories: [categories[0]],
    subtasks: [
      { id: 'sub-7-1', text: 'Replace `<img>` with `<Image>`', completed: false },
      { id: 'sub-7-2', text: 'Audit LCP score', completed: false },
    ],
    projectId: 'taskzen-app-development-a1b2c3',
  },
  {
    id: 'task-8',
    title: 'User profile page redesign',
    description: 'Redesign the user profile page to be more modern and intuitive.',
    status: 'Complete',
    assignee: users[2],
    dueDate: new Date(new Date().setDate(new Date().getDate() - 5)),
    categories: [categories[2]],
    subtasks: [
        { id: 'sub-8-1', text: 'Finalize color palette', completed: true },
        { id: 'sub-8-2', text: 'Implement new layout', completed: true },
    ],
    projectId: 'taskzen-app-development-a1b2c3',
  },
];
