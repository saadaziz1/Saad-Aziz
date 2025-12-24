export const FilterSection = ({ title, open, onToggle, items }) => (
  <div>
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full text-left font-medium pb-2"
      style={{ color: "#282828" }}
    >
      {title}
      <span className="text-2xl">{open ? "−" : "+"}</span>
    </button>

    {open && (
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <label
            key={item}
            className="flex items-center text-sm"
            style={{ color: "#282828" }}
          >
            <input type="checkbox" className="mr-2" />
            {item}
          </label>
        ))}
      </div>
    )}

    <div className="w-3/4 mx-auto border-b border-gray-400 mt-3" />
  </div>
);
