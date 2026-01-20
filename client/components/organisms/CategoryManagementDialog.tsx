import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit2, Trash2, Loader2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import {
    useGetAllCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    Category,
} from '@/libreduxservices/categoryApi';

interface CategoryManagementDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const CategoryManagementDialog: React.FC<CategoryManagementDialogProps> = ({ open, onOpenChange }) => {
    const { data: categories, isLoading } = useGetAllCategoriesQuery();
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');

    const handleCreate = async () => {
        if (!newCategoryName.trim()) {
            toast.error('Category name cannot be empty');
            return;
        }

        try {
            await createCategory({ name: newCategoryName.trim(), isActive: true }).unwrap();
            toast.success('Category created successfully');
            setNewCategoryName('');
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to create category');
        }
    };

    const handleUpdate = async (id: string) => {
        if (!editingName.trim()) {
            toast.error('Category name cannot be empty');
            return;
        }

        try {
            await updateCategory({ id, data: { name: editingName.trim() } }).unwrap();
            toast.success('Category updated successfully');
            setEditingId(null);
            setEditingName('');
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update category');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
            return;
        }

        try {
            await deleteCategory(id).unwrap();
            toast.success('Category deleted successfully');
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to delete category');
        }
    };

    const handleToggleActive = async (id: string, isActive: boolean) => {
        try {
            await updateCategory({ id, data: { isActive: !isActive } }).unwrap();
            toast.success(`Category ${!isActive ? 'activated' : 'deactivated'} successfully`);
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update category status');
        }
    };

    const startEditing = (category: Category) => {
        setEditingId(category._id);
        setEditingName(category.name);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingName('');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#1F1D2B] text-white border-gray-700 max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Manage Categories</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-6 flex-1 overflow-hidden">
                    {/* Add New Category */}
                    <div className="space-y-2">
                        <Label>Add New Category</Label>
                        <div className="flex gap-2">
                            <Input
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Enter category name"
                                maxLength={10}
                                className="bg-[#2D303E] border-gray-700 text-white flex-1"
                                onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
                            />
                            <Button
                                onClick={handleCreate}
                                disabled={isCreating || !newCategoryName.trim()}
                                className="bg-primary hover:bg-primary/90"
                            >
                                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>

                    {/* Category List */}
                    <div className="flex-1 overflow-auto pr-2 no-scrollbar">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-10">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : categories && categories.length > 0 ? (
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <div
                                        key={category._id}
                                        className="bg-[#252836] p-4 rounded-lg flex items-center justify-between gap-3"
                                    >
                                        {editingId === category._id ? (
                                            <>
                                                <Input
                                                    value={editingName}
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                    maxLength={10}
                                                    className="bg-[#1F1D2B] border-gray-700 text-white flex-1"
                                                    onKeyPress={(e) => e.key === 'Enter' && handleUpdate(category._id)}
                                                    autoFocus
                                                />
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => handleUpdate(category._id)}
                                                        disabled={isUpdating}
                                                        className="text-green-500 hover:text-green-400 hover:bg-green-500/10"
                                                    >
                                                        {isUpdating ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Check className="w-4 h-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={cancelEditing}
                                                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate" title={category.name}>{category.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {category.isActive ? (
                                                            <span className="text-green-500">Active</span>
                                                        ) : (
                                                            <span className="text-gray-400">Inactive</span>
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleToggleActive(category._id, category.isActive)}
                                                        className={`border-gray-700 ${category.isActive
                                                            ? 'text-gray-400 hover:text-white'
                                                            : 'text-green-500 hover:text-green-400'
                                                            }`}
                                                    >
                                                        {category.isActive ? 'Deactivate' : 'Activate'}
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => startEditing(category)}
                                                        className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => handleDelete(category._id, category.name)}
                                                        disabled={isDeleting}
                                                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                                    >
                                                        {isDeleting ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                No categories yet. Create one above!
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
