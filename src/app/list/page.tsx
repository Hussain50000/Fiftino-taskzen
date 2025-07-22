"use client";

import React, { useState, useMemo } from 'react';
import {
  tasks as initialTasks,
  statuses as initialStatuses,
} from '@/lib/data';
import type { Task, Status } from '@/types';
import { PageHeader } from '@/components/page-header';
import { TaskDetailsSheet } from '@/components/tasks/task-details-sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, UserCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function ListPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    if (selectedTask && selectedTask.id === updatedTask.id) {
      setSelectedTask(updatedTask);
    }
  };

  const handleTaskCreate = (newTask: Omit<Task, 'id'>) => {
    const newId = `task-${Date.now()}`;
    const taskWithId: Task = { ...newTask, id: newId };
    setTasks(prev => [...prev, taskWithId]);
  }

  const groupedTasks = useMemo(() => {
    return initialStatuses.map(status => ({
      status,
      tasks: tasks.filter(task => task.status === status),
    }));
  }, [tasks]);

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="List" onTaskCreate={handleTaskCreate} />
      <div className="flex-grow p-4 overflow-y-auto">
        <Accordion type="multiple" defaultValue={initialStatuses} className="space-y-4">
          {groupedTasks.map(({ status, tasks }) => (
            tasks.length > 0 && (
              <AccordionItem value={status} key={status} className="border-none">
                <AccordionTrigger className="bg-card p-4 rounded-lg text-lg font-semibold hover:no-underline">
                  {status} ({tasks.length})
                </AccordionTrigger>
                <AccordionContent className="p-0 mt-2 space-y-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="bg-card p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                          {task.assignee ? (
                             <div className="flex items-center gap-2">
                               <Avatar className="h-6 w-6">
                                 <AvatarImage src={task.assignee.avatarUrl} alt={task.assignee.name} />
                                 <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                               </Avatar>
                               <span>{task.assignee.name}</span>
                             </div>
                           ) : (
                             <div className="flex items-center gap-2">
                               <UserCircle className="w-5 h-5" />
                               <span>Unassigned</span>
                             </div>
                           )}
                           {task.dueDate && (
                             <div className="flex items-center gap-2">
                               <CalendarDays className="w-5 h-5" />
                               <span>{format(task.dueDate, 'MMM d')}</span>
                             </div>
                           )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {task.categories.map(cat => (
                          <Badge key={cat.id} className={cat.color} variant="outline">{cat.name}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            )
          ))}
        </Accordion>
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
