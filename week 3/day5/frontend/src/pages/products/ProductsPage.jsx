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
    
    // Add categories
    if (selectedFilters.categories.length > 0) {
      params.category = selectedFilters.categories;
    }
    
    // Add tags
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

  const { data, isLoading, error } = useProducts(queryParams);

  const toggleFilter = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const handleFilterChange = (filterKey, value, checked) => {
    setSelectedFilters((prev) => {
      if (filterKey === 'organic') {
        return { ...prev, organic: checked };
      }
      
      const currentArray = prev[filterKey] || [];
      if (checked) {
        return {
          ...prev,
          [filterKey]: [...currentArray, value],
        };
      } else {
        return {
          ...prev,
          [filterKey]: currentArray.filter((item) => item !== value),
        };
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
        image: product.images?.[0] || '/LayoutImages/collection.jpg',
        description: product.description,
        slug: product.slug,
      };
    });
  }, [data]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <HeroSection heroImg={HERO_IMAGE} />
      <Breadcrumb />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar 
            filters={filters} 
            toggleFilter={toggleFilter}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
          
          <div className="lg:w-3/4">
            <SortDropdown sortBy={sortBy} setSortBy={handleSortChange} />
            {isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading products...</p>
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