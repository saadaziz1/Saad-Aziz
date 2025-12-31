const FilterSidebar = ({ filters, toggleFilter, selectedFilters, onFilterChange }) => {
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
    <>
      
      <div className="w-full max-w-54 hidden lg:block ">
        <div className="  space-y-6   dark:bg-background text-[#282828] dark:text-foreground font-montserrat">
          {Object.entries(filterData).map(([key, data]) => (
            <div key={key}>
              <button
                onClick={() => toggleFilter(key)}
                className="flex items-center justify-between w-full text-left font-medium pb-2"
                
              >
                {data.title}
                <span className="text-2xl">
                  {filters[key] ? "−" : "+"}
                </span>
              </button>
              {filters[key] && (
                <div className="mt-3 space-y-2">
                  {data.options.map((option, index) => {
                    const filterKey = data.type === 'category' ? 'categories' : 'tags';
                    const isChecked = selectedFilters[filterKey]?.includes(option) || false;
                    return (
                      <label key={index} className="flex items-center text-sm" >
                        <input 
                          type="checkbox" 
                          className="mr-2"
                          checked={isChecked}
                          onChange={(e) => handleCheckboxChange(filterKey, option, e.target.checked)}
                        />
                        {option}
                      </label>
                    );
                  })}
                </div>
              )}
              <div className="w-3/4 mx-auto border-b border-gray-400 mt-3"></div>
            </div>
          ))}

          {/* Organic Filter */}
          <div className="flex items-center">
            <span className="font-medium mr-6" >ORGANIC</span>
            <button
              onClick={() => {
                toggleFilter("organic");
                const isOrganic = !selectedFilters.organic;
                onFilterChange('organic', null, isOrganic);
              }}
              className="w-10 h-5 rounded-full transition-colors border"
              style={{backgroundColor: 'transparent', borderColor: '#282828'}}
            >
              <div
                className={`w-4 h-4 rounded-full transition-transform ${
                  selectedFilters.organic ? "translate-x-5" : "translate-x-0.5"
                }`}
                style={{backgroundColor: '#282828'}}
              ></div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;