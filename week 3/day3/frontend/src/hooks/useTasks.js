import { useState, useEffect } from "react";
import { fetchTasks, createTask, updateTask, deleteTask } from "../api";
import { getToken } from "../utils/auth";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = getToken();

  const loadTasks = async () => {
    if (!token) return;
    setLoading(true);
    const res = await fetchTasks(token);
    if (Array.isArray(res)) setTasks(res);
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, [token]);

  const addTask = async (data) => {
    if (!token) return { success: false };
    setLoading(true);
    await createTask(data, token);
    await loadTasks();
    setLoading(false);
    return { success: true };
  };

  const editTask = async (id, data) => {
    if (!token) return { success: false };
    setLoading(true);
    await updateTask(id, data, token);
    await loadTasks();
    setLoading(false);
    return { success: true };
  };

  const removeTask = async (id) => {
    if (!token) return;
    await deleteTask(id, token);
    setTasks(tasks.filter((t) => (t._id || t.id) !== id));
  };

  const toggleComplete = async (task) => {
    if (!token) return;
    const updated = await updateTask(task._id || task.id, { completed: !task.completed }, token);
    if (updated) {
      setTasks(tasks.map((t) => (t._id === task._id ? updated : t)));
    }
  };

  return { tasks, loading, addTask, editTask, removeTask, toggleComplete };
};
