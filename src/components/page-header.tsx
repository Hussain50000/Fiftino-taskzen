
"use client"
import type { Task } from '@/types';
import { NewTaskDialog } from './tasks/new-task-dialog';
import { Button } from './ui/button';
import { Plus, Share2 } from 'lucide-react';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';

interface PageHeaderProps {
  title: string;
  onTaskCreate: (task: Omit<Task, 'id' | 'projectId'>) => void;
}

export function PageHeader({ title, onTaskCreate }: PageHeaderProps) {
  const { isMobile } = useSidebar();
  const { toast } = useToast();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Project link has been copied to your clipboard.",
    });
  };
  
  return (
    <header className="flex items-center justify-between p-4 border-b shrink-0">
      <div className="flex items-center gap-2">
        {isMobile && <SidebarTrigger />}
        <h1 className="text-2xl font-bold">{title}</h1>
        <Button variant="ghost" size="icon" onClick={handleShare}>
          <Share2 className="h-5 w-5" />
          <span className="sr-only">Share Project</span>
        </Button>
      </div>
      <NewTaskDialog onTaskCreate={onTaskCreate}>
        <Button>
          <Plus className="-ml-1 h-5 w-5" />
          New Task
        </Button>
      </NewTaskDialog>
    </header>
  );
}
