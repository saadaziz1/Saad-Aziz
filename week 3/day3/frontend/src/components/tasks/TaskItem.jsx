export default function TaskItem({ task, onEdit, onDelete, onToggle }) {
  return (
    <li
      className={`${
        task.completed ? "bg-white border-red-400" : "bg-[#c5aeff] border-green-400"
      } p-4  cursor-pointer border-2 rounded-lg flex justify-between items-center text-gray-700`}
      onClick={() => onToggle(task)}
    >
      <div>
        <div className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task)}
  className="h-6 w-6 appearance-none rounded-full cursor-pointer border border-green-500 bg-white shadow-[0_0_6px_rgba(16,185,129,0.6)] checked:shadow-[0_0_8px_rgba(239,68,68,0.7)] checked:bg-red-500 checked:border-red-500 transition-all duration-200 ease-in-out relative before:absolute before:inset-0 before:hidden checked:before:flex checked:before:items-center checked:before:justify-center before:content-['✕'] before:text-white before:text-[14px] before:font-bold before:leading-none before:text-center"
/>
          <div>

         
          <h2
            className={
              task.completed
                ? "line-through text-gray-400 text-lg font-semibold"
                : "text-lg font-semibold"
            }
          >
            {task.title}
          </h2>
        <p className="text-gray-600">{task.description}</p>
 </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onEdit(task)}
          className="px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task._id || task.id)}
          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
