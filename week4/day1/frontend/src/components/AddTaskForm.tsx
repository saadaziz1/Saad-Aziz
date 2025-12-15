import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import type { CreateTaskDto } from '../types/task';

interface AddTaskFormProps {
  onAdd: (task: CreateTaskDto) => void;
}

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({ 
        title: title.trim(), 
        description: description.trim() || undefined 
      });
      setTitle('');
      setDescription('');
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-3"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="text"
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 min-w-0"
        />
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button type="submit" disabled={!title.trim()} className="sm:w-auto w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </motion.div>
      </div>
      <Input
        type="text"
        placeholder="Description (optional)..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full"
      />
    </motion.form>
  );
}