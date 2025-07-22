
"use client";

import React, { useState, useMemo, useEffect, useTransition } from 'react';
import { useParams, notFound } from 'next/navigation';
import type { Task, Status, Project, Category } from '@/types';
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
import { BrainCircuit, CalendarDays, UserCircle } from 'lucide-react';
import { format } from 'date-fns';
import { getProjectById, getProjectTasks, updateTask, createTask, getCategories } from '@/lib/actions';
import { statuses as initialStatuses } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';


function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getTextColor(hex: string) {
    const rgb = hexToRgb(hex);
    if (!rgb) return '#000000';
    // Formula to determine brightness (from WCAG)
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
}

export default function ProjectListPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [project, setProject] = useState<Project | undefined>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      try {
        const [projectData, tasksData] = await Promise.all([
          getProjectById(projectId),
          getProjectTasks(projectId),
        ]);

        if (!projectData) {
          console.error("Project not found!");
          notFound();
          return;
        }

        setProject(projectData);
        setTasks(tasksData);
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

  const groupedTasks = useMemo(() => {
    return initialStatuses.map(status => ({
      status,
      tasks: tasks.filter(task => task.status === status),
    }));
  }, [tasks]);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-32 w-32 rounded-full bg-primary/10 animate-ping" />
            <div className="relative p-4 bg-primary/10 rounded-full">
              <BrainCircuit className="w-16 h-16 text-primary" />
            </div>
          </div>
          <p className="text-lg text-muted-foreground">
            Loading your project...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title={project.name} onTaskCreate={handleTaskCreate} />
      <div className="flex-grow p-4 overflow-y-auto">
        <Accordion type="multiple" defaultValue={initialStatuses as string[]} className="space-y-4">
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
                               <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                             </div>
                           )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {task.categories.map(cat => (
                          <Badge key={cat.id} style={{ backgroundColor: cat.color, color: getTextColor(cat.color), borderColor: cat.color }} variant="outline">{cat.name}</Badge>
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
