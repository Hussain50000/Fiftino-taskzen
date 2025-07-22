
"use client";

import React, { useState } from 'react';
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

export default function ProjectsDashboardPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [newProjectName, setNewProjectName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleCreateProject = () => {
    if (newProjectName.trim() === "") return;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: newProjectName,
      taskCount: 0,
      imageUrl: `https://placehold.co/600x400?text=${encodeURIComponent(newProjectName)}`
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    initialProjects.push(newProject);

    setNewProjectName("");
    setIsDialogOpen(false);
    router.push(`/projects/${newProject.id}`);
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
              />
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateProject}>Create Project</Button>
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
