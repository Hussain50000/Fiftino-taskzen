"use client";

import React, { useState, useMemo } from 'react';
import {
  tasks as initialTasks,
  statuses as initialStatuses,
} from '@/lib/data';
import type { Task, Status } from '@/types';
import { PageHeader } from '@/components/page-header';
import { TaskCard } from '@/components/tasks/task-card';
import { TaskDetailsSheet } from '@/components/tasks/task-details-sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BoardPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    if (selectedTask && selectedTask.id === updatedTask.id) {
      setSelectedTask(updatedTask);
    }
  };
  
  const handleTasksUpdate = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };

  const handleTaskCreate = (newTask: Omit<Task, 'id'>) => {
    const newId = `task-${Date.now()}`;
    const taskWithId: Task = { ...newTask, id: newId };
    setTasks(prev => [...prev, taskWithId]);
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

    const draggedTask = tasks.find(t => t.id === draggedTaskId);
    if (!draggedTask) return;

    let newTasks = tasks.filter(t => t.id !== draggedTaskId);
    
    draggedTask.status = status;

    if (targetTaskId) {
        const targetIndex = newTasks.findIndex(t => t.id === targetTaskId);
        if (targetIndex !== -1) {
            newTasks.splice(targetIndex, 0, draggedTask);
        } else {
            // If target task not found (e.g., dropping in empty column but somehow got targetId), append to column
            newTasks = [...newTasks, draggedTask];
        }
    } else {
        // Dropped on a column, not a specific task. Append to end of that column's tasks.
        const columnTasks = newTasks.filter(t => t.status === status);
        const otherTasks = newTasks.filter(t => t.status !== status);
        newTasks = [...otherTasks, ...columnTasks, draggedTask];
    }
    
    handleTasksUpdate(newTasks);
    setDraggedTaskId(null);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Board" onTaskCreate={handleTaskCreate} />
      <div className="flex-grow p-4 overflow-x-auto">
        <div className="flex gap-6 h-full">
          {columns.map((column) => (
            <div 
              key={column.id} 
              className="w-80 shrink-0 flex flex-col"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id as Status)}
            >
              <Card className="bg-transparent border-0 shadow-none">
                <CardHeader className="px-1 py-2">
                  <CardTitle className="text-base font-medium flex items-center justify-between">
                    <span>{column.title}</span>
                    <span className="text-sm text-muted-foreground">{column.tasks.length}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-1 pt-0">
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
