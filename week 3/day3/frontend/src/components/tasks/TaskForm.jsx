import { useForm } from "react-hook-form";

export default function TaskForm({ onSubmit, loading, editId }) {
  const { register, handleSubmit, reset, setValue } = useForm();

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="mb-6 space-y-4 text-white">
      <input
        {...register("title", { required: true })}
        type="text"
        placeholder="Task title"
        className="w-full px-4 py-2 border rounded-lg  border-[#8758ff] placeholder:text-[#ffffff4d] outline-none"
      />
      <textarea
        {...register("description")}
        placeholder="Task description"
        className="w-full px-4 py-2 border rounded-lg  border-[#8758ff] placeholder:text-[#ffffff4d] outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Processing..." : editId ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
}
