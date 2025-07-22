"use client";

import React, { useState, useMemo, useEffect, useTransition } from 'react';
import { notFound, useParams } from 'next/navigation';
import type { Task, Status, Project, Category } from '@/types';
import { PageHeader } from '@/components/page-header';
import { TaskCard } from '@/components/tasks/task-card';
import { TaskDetailsSheet } from '@/components/tasks/task-details-sheet';
import { getProjectById, getProjectTasks, updateTask, updateTasks, createTask, getCategories } from '@/lib/actions';
import { statuses as initialStatuses } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { BrainCircuit } from 'lucide-react';

export default function ProjectBoardPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  
  const [project, setProject] = useState<Project | undefined>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    if (!projectId) return;
    
    const fetchData = async () => {
      try {
        const [projectData, tasksData, categoriesData] = await Promise.all([
            getProjectById(projectId),
            getProjectTasks(projectId),
            getCategories()
        ]);

        if (!projectData) {
          console.error("Project not found!");
          notFound();
          return;
        }

        setProject(projectData);
        setTasks(tasksData);
        setCategories(categoriesData);

      } catch (error) {
        console.error("Failed to fetch project data:", error);
        toast({ title: "Error", description: "Failed to load project data.", variant: "destructive" });
      }
    };
    
    fetchData();
  }, [projectId, toast]);

  const handleTaskUpdate = (updatedTask: Task) => {
    startTransition(async () => {
      try {
        const result = await updateTask(updatedTask);
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === result.id ? result : task))
        );
        if (selectedTask && selectedTask.id === result.id) {
          setSelectedTask(result);
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to update task.", variant: "destructive" });
      }
    });
  };
  
  const handleTasksUpdate = (updatedTasks: Task[]) => {
    startTransition(async () => {
      try {
        const result = await updateTasks(updatedTasks);
        setTasks(result);
      } catch (error) {
        toast({ title: "Error", description: "Failed to update tasks.", variant: "destructive" });
      }
    });
  };

  const handleTaskCreate = (newTaskData: Omit<Task, 'id' | 'projectId'>) => {
    startTransition(async () => {
        try {
            const taskWithProjectId = { ...newTaskData, projectId };
            const newTask = await createTask(taskWithProjectId);
            setTasks(prev => [...prev, newTask]);
        } catch (error) {
            toast({ title: "Error", description: "Failed to create task.", variant: "destructive" });
        }
    });
  }

  const columns = useMemo(() => {
    return initialStatuses.map((status) => ({
      id: status,
      title: status,
      tasks: tasks.filter((task) => task.status === status),
    }));
  }, [tasks]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: Status, targetTaskId?: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedTaskId) return;

    const draggedTaskIndex = tasks.findIndex(t => t.id === draggedTaskId);
    if (draggedTaskIndex === -1) return;
    
    const draggedTask = { ...tasks[draggedTaskIndex], status };

    let newTasks = tasks.filter(t => t.id !== draggedTaskId);

    if (targetTaskId) {
        const targetIndex = newTasks.findIndex(t => t.id === targetTaskId);
        if (targetIndex !== -1) {
            newTasks.splice(targetIndex, 0, draggedTask);
        } else {
            newTasks.push(draggedTask);
        }
    } else {
        const columnTasks = newTasks.filter(t => t.status === status);
        const lastTaskInColumn = columnTasks[columnTasks.length-1];
        if (lastTaskInColumn) {
          const targetIndex = newTasks.findIndex(t => t.id === lastTaskInColumn.id);
          newTasks.splice(targetIndex + 1, 0, draggedTask);
        } else {
          newTasks.push(draggedTask);
        }
    }
    
    setTasks(newTasks);
    handleTasksUpdate(newTasks);
    setDraggedTaskId(null);
  };
  
  if (!project) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-32 w-32 rounded-full bg-primary/10 animate-ping" />
            <div className="relative p-4 bg-primary/10 rounded-full">
              <BrainCircuit className="w-16 h-16 text-primary" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Loading Project...
              </h1>
              <p className="text-lg text-muted-foreground">
                Please wait while we get everything ready.
              </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title={project.name} onTaskCreate={handleTaskCreate} />
      <main className="flex-grow overflow-hidden">
        <div className="h-full overflow-x-auto overflow-y-hidden">
          <div className="flex h-full gap-4 md:gap-6 p-4">
            {columns.map((column) => (
              <div
                key={column.id}
                className="w-[300px] sm:w-[320px] md:w-[340px] flex-shrink-0 flex flex-col"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id as Status)}
              >
                <div className="flex flex-col h-full bg-muted/80 rounded-xl shadow-sm">
                  <div className="p-4 md:p-5 flex-shrink-0 border-b border-border/50">
                    <h3 className="font-semibold text-lg md:text-xl flex items-center justify-between">
                      <span className="text-foreground">{column.title}</span>
                      <span className="text-base md:text-lg text-muted-foreground bg-muted-foreground/10 px-2 py-1 rounded-full min-w-[28px] text-center">
                        {column.tasks.length}
                      </span>
                    </h3>
                  </div>
                  
                  <div className="flex-grow overflow-y-auto px-4 md:px-5">
                    <div className="flex flex-col gap-4 md:gap-5 py-4 min-h-[100px]">
                      {column.tasks.length === 0 ? (
                        <div className="flex items-center justify-center h-24 text-muted-foreground text-sm md:text-base border-2 border-dashed border-muted-foreground/20 rounded-lg">
                          Drop tasks here
                        </div>
                      ) : (
                        column.tasks.map((task) => (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            onDrop={(e) => handleDrop(e, column.id as Status, task.id)}
                            onClick={() => setSelectedTask(task)}
                            className="cursor-pointer transform transition-all duration-200 hover:scale-105 active:scale-95"
                          >
                            <TaskCard task={task} />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      {selectedTask && (
        <TaskDetailsSheet
          task={selectedTask}
          open={!!selectedTask}
          onOpenChange={(isOpen) => !isOpen && setSelectedTask(null)}
          onUpdateTask={handleTaskUpdate}
        />
      )}
    </div>
  );
}
