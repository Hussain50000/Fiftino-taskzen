"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { categories as initialCategories } from '@/lib/data';
import { Label } from '../ui/label';

const colorOptions = [
    { name: 'Sky', class: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200 border border-sky-200 dark:border-sky-700' },
    { name: 'Green', class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-700' },
    { name: 'Amber', class: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-700' },
    { name: 'Red', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border border-red-200 dark:border-red-700' },
    { name: 'Indigo', class: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700' },
    { name: 'Pink', class: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 border border-pink-200 dark:border-pink-700' },
];

export function CategoryManager({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].class);

  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') return;
    const newCategory = {
      id: `cat-${Date.now()}`,
      name: newCategoryName,
      color: selectedColor,
    };
    setCategories([...categories, newCategory]);
    // Note: In a real app, this would also be persisted to the backend.
    // For this scaffold, we're just updating local state.
    initialCategories.push(newCategory); // Mutating imported data for demo purposes
    setNewCategoryName('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
          <DialogDescription>
            Add, edit, or remove categories to organize your tasks.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
            <div>
                <Label className="text-sm font-medium">Existing Categories</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                    {categories.map((cat) => (
                        <Badge key={cat.id} className={cat.class || cat.color} variant="outline">{cat.name}</Badge>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="new-category-name" className="text-sm font-medium">Add New Category</Label>
                <div className="flex gap-2">
                    <Input
                        id="new-category-name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Category name"
                    />
                </div>
            </div>
             <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                    {colorOptions.map(color => (
                        <button key={color.name} onClick={() => setSelectedColor(color.class)} className={`p-1 rounded-md border-2 ${selectedColor === color.class ? 'border-primary' : 'border-transparent'}`}>
                             <Badge className={color.class} variant="outline">{color.name}</Badge>
                        </button>
                    ))}
                </div>
             </div>
        </div>

        <DialogFooter>
          <Button onClick={handleAddCategory}>Add Category</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
