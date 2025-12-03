const { v4: uuidv4 } = require("uuid");
const { sendSuccess, sendError } = require("../utils/responseHandler");

let tasks = [
  {
    id: uuidv4(),
    title: "Sample Task 1",
    description: "This is a sample task",
    completed: false,
  },
  {
    id: uuidv4(),
    title: "Sample Task 2",
    description: "This is another sample task",
    completed: true,
  },
];

// Get all tasks with optional title filter
const getAllTasks = (req, res) => {
  try {
    let filteredTasks = [...tasks];

    const { title } = req.query;
    if (title) {
      filteredTasks = filteredTasks.filter((task) =>
        task.title.toLowerCase().includes(title.toLowerCase())
      );
    }

    return sendSuccess(res, filteredTasks, "tasks reterived successfully");
  } catch (error) {
    return sendError(res, "Failed to retrieve tasks");
  }
};

const getTaskById = (req, res) => {
  try {
    const { id } = req.params;
    const task = tasks.find((t) => t.id === id);

    if (!task) {
      return sendError(res, "No task found", 404);
    }

    return sendSuccess(res, task, "Task found successfully");
  } catch (e) {
    return sendError(res, "Failed to retrieve task", 500);
  }
};

const createTask = (req, res) => {
    try {
        const { title, completed = false } = req.body;
        
        const newTask = {
            id: uuidv4(),
            title: title.trim(),
            completed
        };
        
        tasks.push(newTask);
        
        return sendSuccess(res, newTask, 'Task created successfully', 201);
    } catch (error) {
        return sendError(res, 'Failed to create task', 500);
    }
};

const updateTask = (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const task = tasks.findIndex((t) => t.id === id);
    if (task === -1) {
      return sendError(res, "Task not found", 404);
    }

    if (title !== undefined) {
      tasks[task].title = title.trim();
    }
    if (completed !== undefined) {
      tasks[task].completed = completed;
    }
    return sendSuccess(res, tasks[task], "task updated");
  } catch (e) {
    return sendError(res, "Failed to update task", 500);
  }
};

const deleteTask = (req, res) => {
  try {
    const { id } = req.params;
    const task = tasks.findIndex((t) => t.id === id);

    if (task === -1) {
      return sendError(res, "Task not found", 404);
    }
    const deletedTask = tasks.splice(task, 1)[0];
    return sendSuccess(res, deletedTask, "Task deleted successfully");
  } catch (e) {
    return sendError(res, "Failed to delete task", 500);
  }
};

const getTaskStats = (req, res) => {
    try {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        
        const stats = {
            total: totalTasks,
            completed: completedTasks,
            pending: pendingTasks,
            completionRate: totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(2) : 0
        };
        
        return sendSuccess(res, stats, 'Statistics retrieved successfully');
    } catch (error) {
        return sendError(res, 'Failed to retrieve statistics', 500);
    }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};
