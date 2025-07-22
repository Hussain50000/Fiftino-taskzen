"use client"

import React, { useState } from 'react';
import type { Task, Status, User, Subtask } from '@/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Separator } from '../ui/separator';
import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronsUpDown, Tag, UserCircle, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { statuses, users } from '@/lib/data';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '../ui/calendar';

interface TaskDetailsSheetProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateTask: (task: Task) => void;
}

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

export function TaskDetailsSheet({ task, open, onOpenChange, onUpdateTask }: TaskDetailsSheetProps) {
  const [editedTask, setEditedTask] = useState<Task>(task);

  const handleUpdate = <K extends keyof Task>(field: K, value: Task[K]) => {
    const updatedTask = { ...editedTask, [field]: value };
    setEditedTask(updatedTask);
    onUpdateTask(updatedTask);
  };
  
  const handleSubtaskChange = (subtaskId: string, completed: boolean) => {
    const updatedSubtasks = editedTask.subtasks.map(subtask =>
        subtask.id === subtaskId ? { ...subtask, completed } : subtask
    );
    handleUpdate('subtasks', updatedSubtasks);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl flex flex-col p-0">
        <SheetHeader className="p-6">
          <SheetTitle className="text-2xl">{editedTask.title}</SheetTitle>
        </SheetHeader>
        <Separator/>
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                    value={editedTask.description}
                    onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                    onBlur={() => onUpdateTask(editedTask)}
                    className="min-h-[100px]"
                    placeholder="Add a more detailed description..."
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={editedTask.status} onValueChange={(value: Status) => handleUpdate('status', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statuses.map(status => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Assignee</Label>
                    <Select value={editedTask.assignee?.id} onValueChange={(userId) => handleUpdate('assignee', users.find(u => u.id === userId))}>
                        <SelectTrigger>
                             <SelectValue placeholder={<div className="flex items-center gap-2"><UserCircle className="w-5 h-5" /> Unassigned</div>}>
                                {editedTask.assignee && (
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={editedTask.assignee.avatarUrl} />
                                            <AvatarFallback>{editedTask.assignee.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span>{editedTask.assignee.name}</span>
                                    </div>
                                )}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                            {users.map(user => (
                                <SelectItem key={user.id} value={user.id}>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={user.avatarUrl} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span>{user.name}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !editedTask.dueDate && "text-muted-foreground"
                            )}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {editedTask.dueDate ? format(editedTask.dueDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                            mode="single"
                            selected={editedTask.dueDate}
                            onSelect={(date) => handleUpdate('dueDate', date)}
                            initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-2">
                    <Label>Categories</Label>
                    <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
                        {editedTask.categories.length > 0 ? editedTask.categories.map(cat => (
                            <Badge key={cat.id} style={{backgroundColor: cat.color, color: getTextColor(cat.color), borderColor: cat.color}} variant="outline">{cat.name}</Badge>
                        )) : <span className="text-sm text-muted-foreground">No categories</span>}
                    </div>
                </div>
            </div>

            {editedTask.subtasks.length > 0 && (
                 <div className="space-y-3">
                    <Label className="text-base">Subtasks ({editedTask.subtasks.filter(s=>s.completed).length}/{editedTask.subtasks.length})</Label>
                    <div className="space-y-2">
                        {editedTask.subtasks.map(subtask => (
                            <div key={subtask.id} className="flex items-center gap-3 bg-secondary/60 p-2 rounded-md">
                                <Checkbox
                                    id={`subtask-${subtask.id}`}
                                    checked={subtask.completed}
                                    onCheckedChange={(checked) => handleSubtaskChange(subtask.id, !!checked)}
                                />
                                <label
                                    htmlFor={`subtask-${subtask.id}`}
                                    className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", subtask.completed && "line-through text-muted-foreground")}
                                >
                                    {subtask.text}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
