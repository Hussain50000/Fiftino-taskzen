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

export function CategoryManager({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#a855f7');

  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') return;
    const newCategory = {
      id: `cat-${Date.now()}`,
      name: newCategoryName,
      color: selectedColor,
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    // Note: In a real app, this would also be persisted to the backend.
    // For this scaffold, we're just updating local state.
    initialCategories.splice(0, initialCategories.length, ...updatedCategories);
    setNewCategoryName('');
    setSelectedColor('#a855f7')
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
          <DialogDescription>
            Add new categories to organize your tasks.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
            <div>
                <Label className="text-sm font-medium">Existing Categories</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                    {categories.map((cat) => (
                        <Badge key={cat.id} style={{ backgroundColor: cat.color, color: getTextColor(cat.color), borderColor: cat.color }} variant="outline">{cat.name}</Badge>
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
                <div className="flex items-center gap-2">
                    <Input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="w-12 h-10 p-1"
                    />
                    <Badge style={{ backgroundColor: selectedColor, color: getTextColor(selectedColor) }} variant="outline">{newCategoryName || "New Category"}</Badge>
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
