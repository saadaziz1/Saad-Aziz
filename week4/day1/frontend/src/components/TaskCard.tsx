import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import type { Task } from '../types/task';
import { Card, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="w-full overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={(checked) => onToggle(task._id, !!checked)}
              className="mt-1 flex-shrink-0"
            />
            <div 
              className="flex-1 min-w-0 cursor-pointer" 
              onDoubleClick={() => onToggle(task._id, !task.completed)}
            >
              <motion.div 
                className={`font-medium break-words ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                animate={{ opacity: task.completed ? 0.6 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {task.title}
              </motion.div>
              {task.description && (
                <motion.div 
                  className={`text-sm mt-1 break-words ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}
                  animate={{ opacity: task.completed ? 0.6 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {task.description}
                </motion.div>
              )}
            </div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task._id)}
                className="text-destructive hover:text-destructive flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}