import type { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, CheckSquare, UserCircle } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const completedSubtasks = task.subtasks.filter(s => s.completed).length;

  return (
    <Card className="hover:bg-secondary/80 transition-colors shadow-sm">
      <CardHeader className="p-4">
        <CardTitle className="text-base font-medium">{task.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            {task.assignee ? (
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.assignee.avatarUrl} alt={task.assignee.name} />
                <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ) : (
                <UserCircle className="w-6 h-6" />
            )}
            {task.dueDate && (
              <div className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4" />
                <span>{format(task.dueDate, 'MMM d')}</span>
              </div>
            )}
            {task.subtasks.length > 0 && (
                <div className="flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4"/>
                    <span>{completedSubtasks}/{task.subtasks.length}</span>
                </div>
            )}
          </div>
        </div>
        {task.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {task.categories.map((category) => (
              <Badge key={category.id} className={category.color} variant="outline">
                {category.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
