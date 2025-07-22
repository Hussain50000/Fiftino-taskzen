"use client"

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash } from 'lucide-react';

import type { Task, Status, User, Category } from '@/types';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { categories, statuses, users } from '@/lib/data';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '../ui/calendar';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';

const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  status: z.enum(statuses as [string, ...string[]]),
  assigneeId: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  dueDate: z.date().optional(),
  subtasks: z.array(z.object({ text: z.string().min(1, "Subtask cannot be empty.") })).optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface NewTaskDialogProps {
  children: React.ReactNode;
  onTaskCreate: (task: Omit<Task, 'id'>) => void;
}

export function NewTaskDialog({ children, onTaskCreate }: NewTaskDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<TaskFormValues>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            title: '',
            description: '',
            status: 'Todo',
            assigneeId: undefined,
            categoryIds: [],
            dueDate: undefined,
            subtasks: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "subtasks",
    });

    function onSubmit(data: TaskFormValues) {
        const assignee = users.find(u => u.id === data.assigneeId);
        const selectedCategories = categories.filter(c => data.categoryIds?.includes(c.id));
        const subtasks = data.subtasks?.map((st, index) => ({
            id: `subtask-${Date.now()}-${index}`,
            text: st.text,
            completed: false,
        })) || [];
        
        onTaskCreate({
            title: data.title,
            description: data.description || '',
            status: data.status as Status,
            assignee: assignee,
            dueDate: data.dueDate,
            categories: selectedCategories,
            subtasks: subtasks,
        });
        form.reset();
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to add a new task to your board.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <ScrollArea className="h-[60vh] pr-6">
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Design the landing page" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Add more details about the task..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {statuses.map(status => (
                                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="assigneeId"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Assignee</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                            <SelectValue placeholder="Select an assignee" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="unassigned">Unassigned</SelectItem>
                                            {users.map((user) => (
                                            <SelectItem key={user.id} value={user.id}>
                                                {user.name}
                                            </SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="dueDate"
                                    render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Due Date</FormLabel>
                                        <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                'w-full pl-3 text-left font-normal',
                                                !field.value && 'text-muted-foreground'
                                                )}
                                            >
                                                {field.value ? (
                                                format(field.value, 'PPP')
                                                ) : (
                                                <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => date < new Date('1900-01-01')}
                                            initialFocus
                                            />
                                        </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="categoryIds"
                                    render={() => (
                                        <FormItem>
                                        <FormLabel>Categories</FormLabel>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {categories.map((item) => (
                                            <FormField
                                            key={item.id}
                                            control={form.control}
                                            name="categoryIds"
                                            render={({ field }) => {
                                                return (
                                                <FormItem
                                                    key={item.id}
                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                >
                                                    <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(item.id)}
                                                        onCheckedChange={(checked) => {
                                                        return checked
                                                            ? field.onChange([...(field.value || []), item.id])
                                                            : field.onChange(
                                                                field.value?.filter(
                                                                (value) => value !== item.id
                                                                )
                                                            )
                                                        }}
                                                    />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                    {item.name}
                                                    </FormLabel>
                                                </FormItem>
                                                )
                                            }}
                                            />
                                        ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <div>
                                    <FormLabel>Subtasks</FormLabel>
                                    <div className="space-y-2 mt-2">
                                        {fields.map((field, index) => (
                                            <div key={field.id} className="flex items-center gap-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`subtasks.${index}.text`}
                                                    render={({ field }) => (
                                                         <FormItem className="flex-grow">
                                                            <FormControl>
                                                                <Input {...field} placeholder="e.g. Create database model" />
                                                            </FormControl>
                                                            <FormMessage/>
                                                         </FormItem>
                                                    )}
                                                />
                                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => append({ text: "" })}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Subtask
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                        <DialogFooter className="mt-6 pt-4 border-t">
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Create Task</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

    