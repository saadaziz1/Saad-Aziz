import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Task } from '../types/task';
import { taskService } from '../services/taskService';
import { TaskCard } from '../components/TaskCard';
import { AddTaskForm } from '../components/AddTaskForm';
import { TaskStats } from '../components/TaskStats';
import { FloatingNav } from '../components/FloatingNav';

export function TodoPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error: any) {
      console.error('Failed to load tasks:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData: { title: string; description?: string }) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
    } catch (error: any) {
      console.error('Failed to add task:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        window.location.reload();
      }
    }
  };

  const handleToggleTask = async (id: string, completed: boolean) => {
    try {
      const updatedTask = await taskService.updateTask(id, { completed });
      setTasks(prev => prev.map(task => 
        task._id === id ? updatedTask : task
      ));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-screen items-center justify-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <FloatingNav />
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 pt-20">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold mb-2">Todo App</h1>
          <p className="text-muted-foreground">Manage your tasks efficiently</p>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-6"
        >
          <TaskStats tasks={tasks} />
          <AddTaskForm onAdd={handleAddTask} />
          
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center py-8 text-muted-foreground"
              >
                No tasks yet. Add one above!
              </motion.div>
            ) : (
              tasks.map((task, index) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  <TaskCard
                    task={task}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                  />
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}