
"use client";

import React, { useState, useMemo, useEffect, useTransition } from 'react';
import { notFound, useParams } from 'next/navigation';
import type { Task, Status, Project, Category } from '@/types';
import { PageHeader } from '@/components/page-header';
import { TaskCard } from '@/components/tasks/task-card';
import { TaskDetailsSheet } from '@/components/tasks/task-details-sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProjectById, getProjectTasks, updateTask, updateTasks, createTask, getCategories } from '@/lib/actions';
import { statuses as initialStatuses, users } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

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
        // Find the column's tasks and add to the end
        const columnTasks = newTasks.filter(t => t.status === status);
        const lastTaskInColumn = columnTasks[columnTasks.length-1];
        if (lastTaskInColumn) {
          const targetIndex = newTasks.findIndex(t => t.id === lastTaskInColumn.id);
          newTasks.splice(targetIndex + 1, 0, draggedTask);
        } else {
          newTasks.push(draggedTask);
        }
    }
    
    setTasks(newTasks); // Optimistic update
    handleTasksUpdate(newTasks);
    setDraggedTaskId(null);
  };
  
  if (!project) {
    // This can be a loading spinner
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title={project.name} onTaskCreate={handleTaskCreate} />
      <div className="flex-grow p-4 overflow-auto">
        <div className="flex gap-6 h-full">
          {columns.map((column) => (
            <div 
              key={column.id} 
              className="w-72 md:w-80 shrink-0 flex flex-col"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id as Status)}
            >
              <Card className="bg-transparent border-0 shadow-none flex flex-col flex-grow">
                <CardHeader className="px-1 py-2">
                  <CardTitle className="text-base font-medium flex items-center justify-between">
                    <span>{column.title}</span>
                    <span className="text-sm text-muted-foreground">{column.tasks.length}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-1 pt-0 flex-grow overflow-y-auto">
                  <div className="flex flex-col gap-3 min-h-[50px]">
                    {column.tasks.map((task) => (
                      <div 
                        key={task.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDrop={(e) => handleDrop(e, column.id as Status, task.id)}
                        onClick={() => setSelectedTask(task)} 
                        className="cursor-pointer"
                      >
                        <TaskCard task={task} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
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
