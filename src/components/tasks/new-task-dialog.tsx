
"use client"

import React, { useState, useEffect } from 'react';
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
import { users, statuses } from '@/lib/data';
import { getCategories, createCategory, deleteCategory } from '@/lib/actions';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '../ui/calendar';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';

const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  status: z.enum(statuses as [string, ...string[]]),
  assigneeName: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  dueDate: z.date().optional(),
  subtasks: z.array(z.object({ text: z.string().min(1, "Subtask cannot be empty.") })).optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface NewTaskDialogProps {
  children: React.ReactNode;
  onTaskCreate: (task: Omit<Task, 'id' | 'projectId'>) => void;
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

export function NewTaskDialog({ children, onTaskCreate }: NewTaskDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryColor, setNewCategoryColor] = useState('#a855f7');


    const form = useForm<TaskFormValues>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            title: '',
            description: '',
            status: 'Pending',
            assigneeName: '',
            categoryIds: [],
            dueDate: undefined,
            subtasks: [],
        },
    });
    
    useEffect(() => {
        if (isOpen) {
            const fetchCats = async () => {
                const cats = await getCategories();
                setCategories(cats);
            }
            fetchCats();
        }
    }, [isOpen]);

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "subtasks",
    });

    function onSubmit(data: TaskFormValues) {
        const assignee = data.assigneeName ? users.find(u => u.name.toLowerCase() === data.assigneeName?.toLowerCase()) : undefined;

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

    const handleAddCategory = async () => {
        if (newCategoryName.trim() === '') return;
        const newCategory = await createCategory(newCategoryName, newCategoryColor);
        setCategories(prev => [...prev, newCategory]);
        setNewCategoryName('');
        setNewCategoryColor('#a855f7');
      };
      
    const handleRemoveCategory = async (categoryId: string) => {
        await deleteCategory(categoryId);
        setCategories(prev => prev.filter(c => c.id !== categoryId));
    }
    
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            form.reset();
        }
        setIsOpen(open);
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="w-[95vw] max-w-[425px] sm:max-w-lg md:max-w-xl h-[90vh] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to add a new task to your board.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full overflow-hidden">
                        <div className="flex-1 overflow-hidden">
                            <ScrollArea className="h-full px-1">
                                <div className="space-y-6 pr-4 pb-4">
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                            name="assigneeName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Assignee</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter assignee name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="sm:col-span-2">
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
                                    </div>
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="categoryIds"
                                            render={() => (
                                                <FormItem>
                                                <div className="mb-4">
                                                    <FormLabel>Categories</FormLabel>
                                                    <p className="text-sm text-muted-foreground">Select existing categories or add a new one.</p>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {categories.map((item) => (
                                                    <div key={item.id} className="flex items-center gap-2">
                                                        <FormField
                                                            control={form.control}
                                                            name="categoryIds"
                                                            render={({ field }) => (
                                                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 flex-grow">
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(item.id)}
                                                                            onCheckedChange={(checked) => {
                                                                                return checked
                                                                                    ? field.onChange([...(field.value || []), item.id])
                                                                                    : field.onChange(field.value?.filter((value) => value !== item.id));
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal flex items-center text-sm">
                                                                        <Badge
                                                                            style={{
                                                                                backgroundColor: item.color,
                                                                                color: getTextColor(item.color),
                                                                                borderColor: item.color,
                                                                            }}
                                                                            variant="outline"
                                                                            className="mr-2 h-4 text-xs px-2"
                                                                        >
                                                                            <span className="truncate">{item.name}</span>
                                                                        </Badge>
                                                                    </FormLabel>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 flex-shrink-0"
                                                            onClick={() => handleRemoveCategory(item.id)}
                                                        >
                                                            <Trash className="h-3 w-3" />
                                                            <span className="sr-only">Remove category</span>
                                                        </Button>
                                                    </div>
                                                ))}
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                        <Separator />
                                        <div className="space-y-3">
                                            <Label className="text-sm font-medium">Add New Category</Label>
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <Input
                                                    value={newCategoryName}
                                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                                    placeholder="Category name"
                                                    className="flex-1"
                                                />
                                                <div className="flex gap-2">
                                                    <Input
                                                        type="color"
                                                        value={newCategoryColor}
                                                        onChange={(e) => setNewCategoryColor(e.target.value)}
                                                        className="w-16 h-10 p-1 flex-shrink-0"
                                                    />
                                                    <Button 
                                                        type="button" 
                                                        onClick={handleAddCategory}
                                                        className="flex-shrink-0"
                                                    >
                                                        Add
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <FormLabel>Subtasks</FormLabel>
                                        <div className="space-y-3">
                                            {fields.map((field, index) => (
                                                <div key={field.id} className="flex items-start gap-2">
                                                    <FormField
                                                        control={form.control}
                                                        name={`subtasks.${index}.text`}
                                                        render={({ field }) => (
                                                            <FormItem className="flex-1">
                                                                <FormControl>
                                                                    <Input 
                                                                        {...field} 
                                                                        placeholder="e.g. Create database model" 
                                                                        className="min-h-[40px]"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <Button 
                                                        type="button" 
                                                        variant="outline" 
                                                        size="icon" 
                                                        onClick={() => remove(index)}
                                                        className="mt-0 flex-shrink-0"
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => append({ text: "" })}
                                                className="w-full sm:w-auto"
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Subtask
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>
                        </div>
                        <DialogFooter className="flex-shrink-0 pt-4 border-t mt-4">
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

    