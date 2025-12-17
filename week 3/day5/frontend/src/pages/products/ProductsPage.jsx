import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import HeroSection from "../../components/products/HeroSection";
import Breadcrumb from "../../components/products/Breadcrumb";
import FilterSidebar from "../../components/products/FilterSidebar";
import SortDropdown from "../../components/products/SortDropdown";
import ProductGrid from "../../components/products/ProductGrid";
import { HERO_IMAGE } from "../../constants";
import { useProducts } from "../../hooks/useProducts";

 const ProductsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '');
  const [filters, setFilters] = useState({
    collectiona: true,
    origin: true,
    flavour: true,
    qualities: true,
    cafeine: true,
    allergens: true,
    organic: false,
  });
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    tags: [],
    organic: false,
  });

  // Build query params from URL and selected filters
  const queryParams = useMemo(() => {
    const params = {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '12',
    };
    
    const search = searchParams.get('search');
    if (search) params.search = search;
    
    // Add categories (send as single value, not array)
    if (selectedFilters.categories.length > 0) {
      params.category = selectedFilters.categories[0]; // Backend expects single category
    }
    
    // Add tags (send as array)
    if (selectedFilters.tags.length > 0) {
      params.tags = selectedFilters.tags;
    }
    
    // Add organic filter
    if (selectedFilters.organic) {
      params.organic = 'true';
    }
    
    // Add sort
    if (sortBy) {
      params.sort = sortBy;
    }
    
    return params;
  }, [searchParams, selectedFilters, sortBy]);

  console.log('Query params being sent:', queryParams);
  console.log('Selected filters:', selectedFilters);
  const { data, isLoading, error } = useProducts(queryParams);

  const toggleFilter = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const handleFilterChange = (filterKey, value, checked) => {
    console.log('Filter change:', { filterKey, value, checked });
    setSelectedFilters((prev) => {
      if (filterKey === 'organic') {
        return { ...prev, organic: checked };
      }
      
      const currentArray = prev[filterKey] || [];
      if (checked) {
        const newFilters = {
          ...prev,
          [filterKey]: [...currentArray, value],
        };
        console.log('New filters after adding:', newFilters);
        return newFilters;
      } else {
        const newFilters = {
          ...prev,
          [filterKey]: currentArray.filter((item) => item !== value),
        };
        console.log('New filters after removing:', newFilters);
        return newFilters;
      }
    });
    
    // Reset to page 1 when filters change
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', '1');
      return newParams;
    });
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (newSort) {
        newParams.set('sort', newSort);
      } else {
        newParams.delete('sort');
      }
      newParams.set('page', '1');
      return newParams;
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', newPage.toString());
      return newParams;
    });
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Transform backend products to match frontend format
  const transformedProducts = useMemo(() => {
    if (!data?.products) return [];
    
    return data.products.map((product) => {
      // Get the first variant or default
      const firstVariant = product.variants?.[0];
      const price = firstVariant 
        ? (product.basePrice + (firstVariant.priceDiff || 0)).toFixed(2)
        : product.basePrice.toFixed(2);
      
      return {
        id: product._id,
        name: product.name,
        price: `€${price}`,
        weight: firstVariant?.name || '50 g',
        image: product.featuredImage || '/LayoutImages/collection.jpg',
        description: product.description,
        slug: product.slug,
      };
    });
  }, [data]);

  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection heroImg={'./LayoutImages/products.jpg'} />
      <Breadcrumb />
      
      <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-8">
        <div className="flex flex-row gap-8 ">
          <FilterSidebar 
            filters={filters} 
            toggleFilter={toggleFilter}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
          
          <div className="w-full lg:w-[840px] xl:w-[1112px]">
           
             <div className="flex justify-end ">
              <SortDropdown 
              sortBy={sortBy} 
              setSortBy={handleSortChange}
              filters={filters}
              toggleFilter={toggleFilter}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
             </div>
           
            {isLoading && (
              <div className="text-center py-12">
                <p className="">Loading products...</p>
              </div>
            )}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-600">Error loading products. Please try again.</p>
              </div>
            )}
            {!isLoading && !error && (
              <>
                <ProductGrid products={transformedProducts} onProductClick={handleProductClick} />
                {data && data.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(data.currentPage - 1)}
                      disabled={data.currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2">
                      Page {data.currentPage} of {data.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(data.currentPage + 1)}
                      disabled={data.currentPage === data.totalPages}
                      className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;