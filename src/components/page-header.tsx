import type { Task } from '@/types';
import { NewTaskDialog } from './tasks/new-task-dialog';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  onTaskCreate: (task: Omit<Task, 'id'>) => void;
}

export function PageHeader({ title, onTaskCreate }: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b shrink-0">
      <h1 className="text-2xl font-bold">{title}</h1>
      <NewTaskDialog onTaskCreate={onTaskCreate}>
        <Button>
          <Plus className="-ml-1 h-5 w-5" />
          New Task
        </Button>
      </NewTaskDialog>
    </header>
  );
}
