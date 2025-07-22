"use client"

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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

const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  status: z.enum(statuses as [string, ...string[]]),
  assigneeId: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface NewTaskDialogProps {
  children: React.ReactNode;
  onTaskCreate: (task: Omit<Task, 'id'>) => void;
}

export function NewTaskDialog({ children, onTaskCreate }: NewTaskDialogProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    const form = useForm<TaskFormValues>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            title: '',
            description: '',
            status: 'Todo',
            assigneeId: undefined,
            categoryIds: [],
        },
    });

    function onSubmit(data: TaskFormValues) {
        const assignee = users.find(u => u.id === data.assigneeId);
        const selectedCategories = categories.filter(c => data.categoryIds?.includes(c.id));
        
        onTaskCreate({
            title: data.title,
            description: data.description || '',
            status: data.status as Status,
            assignee: assignee,
            categories: selectedCategories,
            subtasks: [],
        });
        form.reset();
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to add a new task to your board.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                         <DialogFooter>
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
