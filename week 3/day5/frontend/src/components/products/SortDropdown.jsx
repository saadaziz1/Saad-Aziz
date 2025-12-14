const SortDropdown = ({ sortBy, setSortBy }) => {
  return (
    <div className="flex justify-end mb-6">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="px-4 py-2 text-base focus:outline-none font-semibold border border-gray-300 rounded"
      >
        <option value="">SORT BY</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="name">Name</option>
        <option value="rating">Rating</option>
      </select>
    </div>
  );
};

export default SortDropdown;