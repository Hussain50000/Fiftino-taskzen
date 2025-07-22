
'use server'

import fs from 'fs/promises';
import path from 'path';
import type { Task, Project, Category } from '@/types';

// Path to the JSON database file
const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

// Type for the database structure
type DbData = {
  projects: Project[];
  tasks: Task[];
  categories: Category[];
};

// Function to read the database file
async function readDb(): Promise<DbData> {
  try {
    const fileContent = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    // If the file doesn't exist, return a default structure
    return { projects: [], tasks: [], categories: [] };
  }
}

// Function to write to the database file
async function writeDb(data: DbData): Promise<void> {
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
    db.tasks[taskIndex] = updatedTask;
    await writeDb(db);
    return updatedTask;
}

export async function updateTasks(tasks: Task[]): Promise<Task[]> {
  const db = await readDb();
  
  tasks.forEach(updatedTask => {
    const index = db.tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      db.tasks[index] = updatedTask;
    } else {
      // This could be an issue if a task doesn't exist,
      // for this implementation we assume tasks exist.
      // Or you might want to add it if it's a new task from drag-n-drop.
    }
  });

  await writeDb(db);
  return tasks;
}


export async function createTask(taskData: Omit<Task, 'id'>): Promise<Task> {
    const db = await readDb();

    const newId = `task-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
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
    db.categories = db.categories.filter(c => c.id !== categoryId);
    // Also remove this category from any tasks that have it
    db.tasks = db.tasks.map(task => ({
        ...task,
        categories: task.categories.filter(cat => cat.id !== categoryId)
    }));
    await writeDb(db);
}

    