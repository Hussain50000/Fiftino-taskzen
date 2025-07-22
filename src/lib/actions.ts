
'use server'

import type { Task, Project, Category } from '@/types';
import { projects, tasks, categories } from './data';

// --- Project Actions ---

export async function getProjects(): Promise<Project[]> {
  // In a real app, you'd fetch this from a database.
  // For this prototype, we're reading from an in-memory array.
  return Promise.resolve(projects);
}

export async function createProject(name: string): Promise<Project> {
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const randomId = Math.random().toString(36).substring(2, 8);

  const newProject: Project = {
    id: `${slug}-${randomId}`,
    name: name,
    taskCount: 0,
    imageUrl: `https://placehold.co/600x400?text=${encodeURIComponent(name)}`
  };
  
  projects.push(newProject);
  return Promise.resolve(newProject);
};

// --- Task Actions ---

export async function getProjectTasks(projectId: string): Promise<Task[]> {
    return Promise.resolve(tasks.filter(t => t.projectId === projectId));
}

export async function getProjectById(projectId: string): Promise<Project | undefined> {
    return Promise.resolve(projects.find(p => p.id === projectId));
}

export async function updateTask(updatedTask: Task): Promise<Task> {
    const taskIndex = tasks.findIndex(t => t.id === updatedTask.id);
    if (taskIndex === -1) throw new Error("Task not found");
    tasks[taskIndex] = updatedTask;
    return Promise.resolve(updatedTask);
}

export async function updateTasks(updatedTasks: Task[]): Promise<Task[]> {
  updatedTasks.forEach(updatedTask => {
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = updatedTask;
    }
  });
  return Promise.resolve(tasks);
}


export async function createTask(taskData: Omit<Task, 'id'>): Promise<Task> {
    const newId = `task-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const newTask: Task = { ...taskData, id: newId };
    
    tasks.push(newTask);

    const projectIndex = projects.findIndex(p => p.id === taskData.projectId);
    if (projectIndex !== -1) {
        projects[projectIndex].taskCount++;
    }

    return Promise.resolve(newTask);
}


// --- Category Actions ---
export async function getCategories(): Promise<Category[]> {
    return Promise.resolve(categories);
}

export async function createCategory(name: string, color: string): Promise<Category> {
    const newCategory: Category = {
        id: `cat-${Date.now()}`,
        name,
        color,
    };
    categories.push(newCategory);
    return Promise.resolve(newCategory);
}

export async function deleteCategory(categoryId: string): Promise<void> {
    const index = categories.findIndex(c => c.id === categoryId);
    if (index > -1) {
        categories.splice(index, 1);
    }
    // Also remove this category from any tasks that have it
    tasks.forEach(task => {
      task.categories = task.categories.filter(cat => cat.id !== categoryId)
    });
    return Promise.resolve();
}
