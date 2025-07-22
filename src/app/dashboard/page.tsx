
"use client";

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { projects as initialProjects } from '@/lib/data';
import type { Project } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// This would be a server action in a real app
const createProject = async (name: string): Promise<Project> => {
  console.log("Creating project", name);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const randomId = Math.random().toString(36).substring(2, 8);

  const newProject: Project = {
    id: `${slug}-${randomId}`,
    name: name,
    taskCount: 0,
    imageUrl: `https://placehold.co/600x400?text=${encodeURIComponent(name)}`
  };
  
  // In a real app, you would save this to your database.
  // For this demo, we're pushing to an in-memory array.
  initialProjects.push(newProject);

  return newProject;
};


export default function ProjectsDashboardPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [newProjectName, setNewProjectName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const handleCreateProject = () => {
    if (newProjectName.trim() === "") return;

    startTransition(async () => {
      try {
        const newProject = await createProject(newProjectName);
        
        const updatedProjects = [...projects, newProject];
        setProjects(updatedProjects);

        setNewProjectName("");
        setIsDialogOpen(false);
        toast({
          title: "Project Created",
          description: `The project "${newProject.name}" has been successfully created.`,
        });
        router.push(`/projects/${newProject.id}`);
      } catch (error) {
         toast({
          title: "Error",
          description: "Failed to create project. Please try again.",
          variant: "destructive"
        });
      }
    });
  };
  
  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b shrink-0">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="-ml-1 h-5 w-5" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new project</DialogTitle>
              <DialogDescription>
                Give your new project a name to get started.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input 
                id="projectName"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="e.g. Q3 Marketing Campaign"
                disabled={isPending}
              />
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsDialogOpen(false)} disabled={isPending}>Cancel</Button>
              <Button onClick={handleCreateProject} disabled={isPending}>
                {isPending ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => (
            <Link href={`/projects/${project.id}`} key={project.id}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer flex flex-col">
                <div className="aspect-[16/9] bg-muted overflow-hidden rounded-t-lg">
                  <img 
                    src={project.imageUrl}
                    alt={project.name}
                    data-ai-hint="abstract background"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">{project.taskCount} tasks</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
