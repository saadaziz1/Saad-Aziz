import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import TaskForm from "../components/tasks/TaskForm";
import TaskItem from "../components/tasks/TaskItem";
import Loader from "../components/Loader";

export default function Dashboard() {
  const { tasks, loading, addTask, editTask, removeTask, toggleComplete } = useTasks();
  const [editId, setEditId] = useState(null);

  const onSubmit = async (data) => {
    if (editId) {
      await editTask(editId, data);
      setEditId(null);
    } else {
      await addTask(data);
    }
  };

  const handleEdit = (task) => {
    setEditId(task._id || task.id);
  };

  if (loading && tasks.length === 0) return <Loader />;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto bg-[#1A1A40] p-6 rounded-xl shadow-md text-white">
        <h1 className="text-3xl font-bold text-center mb-6">Task Dashboard</h1>

        <TaskForm onSubmit={onSubmit} loading={loading} editId={editId} />

        <ul className="space-y-4">
          {tasks.length === 0 && <p className="text-center text-gray-500">No tasks yet</p>}
          {tasks.map((task) => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={removeTask}
              onToggle={toggleComplete}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
