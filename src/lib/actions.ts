
'use server'

import type { Task, Project, Category } from '@/types';
import { users } from './data';
import fs from 'fs/promises';
import path from 'path';

// The path to the db.json file
const dbPath = path.resolve(process.cwd(), 'src/lib/db.json');

// Helper function to read the database file
async function readDb(): Promise<{ projects: Project[], tasks: Task[], categories: Category[] }> {
    try {
        const fileContent = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        // If the file doesn't exist or is empty, return a default structure
        return { projects: [], tasks: [], categories: [] };
    }
}

// Helper function to write to the database file
async function writeDb(data: { projects: Project[], tasks: Task[], categories: Category[] }): Promise<void> {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}


// --- Project Actions ---

export async function getProjects(): Promise<Project[]> {
  const db = await readDb();
  return db.projects;
}

export async function createProject(name: string): Promise<Project> {
  const db = await readDb();
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const randomId = Math.random().toString(36).substring(2, 8);

  const newProject: Project = {
    id: `${slug}-${randomId}`,
    name: name,
    taskCount: 0,
    imageUrl: `https://placehold.co/600x400?text=${encodeURIComponent(name)}`
  };
  
  db.projects.push(newProject);
  await writeDb(db);
  return newProject;
};

// --- Task Actions ---

export async function getProjectTasks(projectId: string): Promise<Task[]> {
    const db = await readDb();
    return db.tasks.filter(t => t.projectId === projectId);
}

export async function getProjectById(projectId: string): Promise<Project | undefined> {
    const db = await readDb();
    return db.projects.find(p => p.id === projectId);
}

export async function updateTask(updatedTask: Task): Promise<Task> {
    const db = await readDb();
    const taskIndex = db.tasks.findIndex(t => t.id === updatedTask.id);
    if (taskIndex === -1) throw new Error("Task not found");
    
    // Make sure dueDate is stored as a string if it's a Date object
    if (updatedTask.dueDate && updatedTask.dueDate instanceof Date) {
        updatedTask.dueDate = updatedTask.dueDate.toISOString() as any;
    }

    db.tasks[taskIndex] = updatedTask;
    await writeDb(db);
    return updatedTask;
}

export async function updateTasks(updatedTasks: Task[]): Promise<Task[]> {
    const db = await readDb();
    updatedTasks.forEach(updatedTask => {
        const index = db.tasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          // Make sure dueDate is stored as a string if it's a Date object
          if (updatedTask.dueDate && updatedTask.dueDate instanceof Date) {
            updatedTask.dueDate = updatedTask.dueDate.toISOString() as any;
          }
          db.tasks[index] = updatedTask;
        }
    });
    await writeDb(db);
    // Return the tasks for the specific project, not all tasks
    return updatedTasks;
}


export async function createTask(taskData: Omit<Task, 'id'>): Promise<Task> {
    const db = await readDb();
    const newId = `task-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    
    // Make sure dueDate is stored as a string if it's a Date object
    if (taskData.dueDate && taskData.dueDate instanceof Date) {
        taskData.dueDate = taskData.dueDate.toISOString() as any;
    }
    
    const newTask: Task = { ...taskData, id: newId };
    
    db.tasks.push(newTask);

    const projectIndex = db.projects.findIndex(p => p.id === taskData.projectId);
    if (projectIndex !== -1) {
        db.projects[projectIndex].taskCount++;
    }

    await writeDb(db);
    return newTask;
}


// --- Category Actions ---
export async function getCategories(): Promise<Category[]> {
    const db = await readDb();
    return db.categories;
}

export async function createCategory(name: string, color: string): Promise<Category> {
    const db = await readDb();
    const newCategory: Category = {
        id: `cat-${Date.now()}`,
        name,
        color,
    };
    db.categories.push(newCategory);
    await writeDb(db);
    return newCategory;
}

export async function deleteCategory(categoryId: string): Promise<void> {
    const db = await readDb();
    const categoryIndex = db.categories.findIndex(c => c.id === categoryId);
    if (categoryIndex > -1) {
        db.categories.splice(categoryIndex, 1);
    }
    
    // Also remove this category from any tasks that have it
    db.tasks.forEach(task => {
      task.categories = task.categories.filter(cat => cat.id !== categoryId)
    });
    
    await writeDb(db);
}
