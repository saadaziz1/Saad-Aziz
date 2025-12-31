import { useState } from 'react';

const SortDropdown = ({ sortBy, setSortBy, filters, toggleFilter, selectedFilters, onFilterChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const filterData = {
    collectiona: {
      title: "COLLECTIONS",
      options: ["Black teas", "Green teas", "White teas", "Chai", "Matcha", "Herbal teas", "Oolong", "Rooibos", "Teaware"],
      type: 'category'
    },
    origin: {
      title: "ORIGIN",
      options: ["India", "Japan", "Iran", "South Africa"],
      type: 'tag'
    },
    flavour: {
      title: "FLAVOR",
      options: ["Spicy", "Sweet", "Citrus", "Smooth", "Fruity", "Floral", "Grassy", "Minty", "Bitter", "Creamy"],
      type: 'tag'
    },
    qualities: {
      title: "QUALITIES",
      options: ["Detox", "Energy", "Relax", "Digestion"],
      type: 'tag'
    },
    cafeine: {
      title: "CAFFEINE",
      options: ["No Caffeine", "Low Caffeine", "Medium Caffeine", "High Caffeine"],
      type: 'tag'
    },
    allergens: {
      title: "ALLERGENS",
      options: ["Lactose-free", "Gluten-free", "Nuts-free", "Soy-free"],
      type: 'tag'
    }
  };

  const handleCheckboxChange = (filterKey, option, checked) => {
    onFilterChange(filterKey, option, checked);
  };

  return (
    <div className="mb-6 relative">
      {/* Desktop: Separate dropdowns */}
      <div className="hidden lg:flex justify-end">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 text-base focus:outline-none font-semibold border border-gray-300 rounded dark:bg-background text-[#282828] dark:text-foreground font-montserrat"
        >
          <option value="">SORT BY</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {/* Mobile: Combined dropdown */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full px-4 min-w-[200px] py-2 border border-gray-300 rounded font-semibold text-[#282828] dark:text-foreground bg-white dark:bg-background flex justify-between items-center"
        >
          SORT & FILTER
          <span>{showDropdown ? '−' : '+'}</span>
        </button>

        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-background border border-gray-300 rounded shadow-lg z-10 max-h-80 overflow-y-auto">
            {/* Sorting Section */}
            <div className="p-3 border-b border-gray-200">
              <h3 className="font-semibold text-sm mb-2 text-[#282828] dark:text-foreground">SORTING</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded dark:bg-background text-[#282828] dark:text-foreground"
              >
                <option value="">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            {/* Filtering Section */}
            <div className="p-3">
              <h3 className="font-semibold text-sm mb-3 text-[#282828] dark:text-foreground">FILTERING</h3>
              <div className="space-y-3">
                {Object.entries(filterData).map(([key, data]) => (
                  <div key={key}>
                    <button
                      onClick={() => toggleFilter(key)}
                      className="flex items-center justify-between w-full text-left font-medium text-sm text-[#282828] dark:text-foreground"
                    >
                      {data.title}
                      <span className="text-lg">{filters[key] ? '−' : '+'}</span>
                    </button>
                    {filters[key] && (
                      <div className="mt-2 space-y-1 pl-2">
                        {data.options.map((option, index) => {
                          const filterKey = data.type === 'category' ? 'categories' : 'tags';
                          const isChecked = selectedFilters[filterKey]?.includes(option) || false;
                          return (
                            <label key={index} className="flex items-center text-xs text-[#282828] dark:text-foreground">
                              <input 
                                type="checkbox" 
                                className="mr-2 scale-75"
                                checked={isChecked}
                                onChange={(e) => handleCheckboxChange(filterKey, option, e.target.checked)}
                              />
                              {option}
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}

                {/* Organic Filter */}
                <div className="flex items-center justify-between pt-2">
                  <span className="font-medium text-sm text-[#282828] dark:text-foreground">ORGANIC</span>
                  <button
                    onClick={() => {
                      toggleFilter("organic");
                      const isOrganic = !selectedFilters.organic;
                      onFilterChange('organic', null, isOrganic);
                    }}
                    className="w-8 h-4 rounded-full transition-colors border border-gray-400"
                  >
                    <div
                      className={`w-3 h-3 rounded-full transition-transform bg-gray-800 ${
                        selectedFilters.organic ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    ></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SortDropdown;