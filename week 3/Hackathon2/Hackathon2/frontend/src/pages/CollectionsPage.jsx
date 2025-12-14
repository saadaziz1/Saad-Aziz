import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Import images from public folder
const heroImg = "/imgs/collectionImg.jpg";
const ld1 = "/imgs/col1.jpeg";
const ld2 = "/imgs/col2.jpeg";
const ld3 = "/imgs/col3.jpeg";
const ld4 = "/imgs/col4.jpeg";
const ld5 = "/imgs/col5.jpeg";
const ld6 = "/imgs/col6.jpeg";
const ld7 = "/imgs/col7.jpeg";
const ld8 = "/imgs/col2.jpeg";
const ld9 = "/imgs/col1.jpeg";

export const CollectionsPage = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("");
  const [filters, setFilters] = useState({
    collectiona: true,
    origin: true,
    flavour: true,
    qualities: true,
    cafeine: true,
    allergens: true,
    organic: false,
  });

  const toggleFilter = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const products = [
    {
      id: 1,
      name: "Ceylon Ginger Cinnamon chai tea",
      price: "€4.85",
      weight: "50 g",
      image: ld1,
    },
    {
      id: 2,
      name: "Ceylon Ginger Cinnamon chai tea",
      price: "€4.85",
      weight: "50 g",
      image: ld2,
    },
    {
      id: 3,
      name: "Ceylon Ginger Cinnamon chai tea",
      price: "€4.85",
      weight: "50 g",
      image: ld3,
    },
    {
      id: 4,
      name: "Ceylon Ginger Cinnamon chai tea",
      price: "€4.85",
      weight: "50 g",
      image: ld4,
    },
    {
      id: 5,
      name: "Ceylon Ginger Cinnamon chai tea",
      price: "€4.85",
      weight: "50 g",
      image: ld5,
    },
    {
      id: 6,
      name: "Ceylon Ginger Cinnamon chai tea",
      price: "€4.85",
      weight: "50 g",
      image: ld6,
    },
    {
      id: 7,
      name: "Ceylon Ginger Cinnamon chai tea",
      price: "€4.85",
      weight: "50 g",
      image: ld7,
    },
    {
      id: 8,
      name: "Ceylon Ginger Cinnamon chai tea",
      price: "€4.85",
      weight: "50 g",
      image: ld8,
    },
    {
      id: 9,
      name: "Ceylon Ginger Cinnamon chai tea",
      price: "€4.85",
      weight: "50 g",
      image: ld9,
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-64 md:h-80">
        <img
          src={heroImg}
          alt="Tea collection hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute bg-opacity-30"></div>
      </section>

      {/* Breadcrumb */}
     <div className=" py-4 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs sm:text-sm text-[#282828] truncate" style={{fontFamily: 'Montserrat', color: '#282828'}}>
            HOME/COLLECTIONS/CHAI
          </p>
        </div>
      </div>

      <style>
        {`
          input[type="checkbox"] {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            width: 16px;
            height: 16px;
            border: 1px solid #282828;
            border-radius: 2px;
            background-color: transparent;
            position: relative;
            cursor: pointer;
          }
          input[type="checkbox"]:checked {
            background-color: transparent;
            border-color: #282828;
          }
          input[type="checkbox"]:checked::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #282828;
            font-size: 12px;
            font-weight: bold;
          }
        `}
      </style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="space-y-6">
              {/* Collection Filter */}
              <div>
                <button
                  onClick={() => toggleFilter("collectiona")}
                  className="flex items-center justify-between w-full text-left font-medium pb-2"
                  style={{color: '#282828'}}
                >
                  COLLECTIONS
                  <span className="text-2xl">
                    {filters.collectiona ? "−" : "+"}
                  </span>
                </button>
                {filters.collectiona && (
                  <div className="mt-3 space-y-2">
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Black teas
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Green teas
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      White teas
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" checked />
                      Chai
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Matcha
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Herbal teas
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Oolong
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Rooibos
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Teaware
                    </label>
                  </div>
                )}
                <div className="w-3/4 mx-auto border-b border-gray-400 mt-3"></div>
              </div>

              {/* Origin Filter */}
              <div>
                <button
                  onClick={() => toggleFilter("origin")}
                  className="flex items-center justify-between w-full text-left font-medium pb-2"
                  style={{color: '#282828'}}
                >
                  ORIGIN
                  <span className="text-2xl">{filters.origin ? "−" : "+"}</span>
                </button>
                {filters.origin && (
                  <div className="mt-3 space-y-2">
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      India
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Japan
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Iran
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      South Africa
                    </label>
                  </div>
                )}
                <div className="w-3/4 mx-auto border-b border-gray-400 mt-3"></div>
              </div>

              {/* Flavour Filter */}
              <div>
                <button
                  onClick={() => toggleFilter("flavour")}
                  className="flex items-center justify-between w-full text-left font-medium pb-2"
                  style={{color: '#282828'}}
                >
                  FLAVOR
                  <span className="text-2xl">{filters.flavour ? "−" : "+"}</span>
                </button>
                {filters.flavour && (
                  <div className="mt-3 space-y-2">
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Spicy
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Sweet
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Citrus
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Smooth
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Fruity
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Floral
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Grassy
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Minty
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Bitter
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Creamy
                    </label>
                  </div>
                )}
                <div className="w-3/4 mx-auto border-b border-gray-400 mt-3"></div>
              </div>

              {/* Qualities Filter */}
              <div>
                <button
                  onClick={() => toggleFilter("qualities")}
                  className="flex items-center justify-between w-full text-left font-medium pb-2"
                  style={{color: '#282828'}}
                >
                  QUALITIES
                  <span className="text-2xl">{filters.qualities ? "−" : "+"}</span>
                </button>
                {filters.qualities && (
                  <div className="mt-3 space-y-2">
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Detox
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Energy
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Relax
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Digestion
                    </label>
                  </div>
                )}
                <div className="w-3/4 mx-auto border-b border-gray-400 mt-3"></div>
              </div>

              {/* Cafeine Filter */}
              <div>
                <button
                  onClick={() => toggleFilter("cafeine")}
                  className="flex items-center justify-between w-full text-left font-medium pb-2"
                  style={{color: '#282828'}}
                >
                  CAFFEINE
                  <span className="text-2xl">{filters.cafeine ? "−" : "+"}</span>
                </button>
                {filters.cafeine && (
                  <div className="mt-3 space-y-2">
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      No Caffeine
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Low Caffeine
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Medium Caffeine
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      High Caffeine
                    </label>
                  </div>
                )}
                <div className="w-3/4 mx-auto border-b border-gray-400 mt-3"></div>
              </div>

              {/* Allergens Filter */}
              <div>
                <button
                  onClick={() => toggleFilter("allergens")}
                  className="flex items-center justify-between w-full text-left font-medium pb-2"
                  style={{color: '#282828'}}
                >
                  ALLERGENS
                  <span className="text-2xl">{filters.allergens ? "−" : "+"}</span>
                </button>
                {filters.allergens && (
                  <div className="mt-3 space-y-2">
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Lactose-free
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Gluten-free
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Nuts-free
                    </label>
                    <label className="flex items-center text-sm" style={{color: '#282828'}}>
                      <input type="checkbox" className="mr-2" />
                      Soy-free
                    </label>
                  </div>
                )}
                <div className="w-3/4 mx-auto border-b border-gray-400 mt-3"></div>
              </div>

              {/* Organic Filter */}
              <div className="flex items-center">
                <span className="font-medium mr-6" style={{color: '#282828'}}>ORGANIC</span>
                <button
                  onClick={() => toggleFilter("organic")}
                  className="w-10 h-5 rounded-full transition-colors border"
                  style={{backgroundColor: 'transparent', borderColor: '#282828'}}
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-transform ${
                      filters.organic ? "translate-x-5" : "translate-x-0.5"
                    }`}
                    style={{backgroundColor: '#282828'}}
                  ></div>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sort Dropdown */}
            <div className="flex justify-end mb-6">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 text-base focus:outline-none font-semibold"
              >
                <option value="">SORT BY</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="group text-center cursor-pointer"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="aspect-square mb-4 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-sm mb-2 leading-tight" style={{color: '#282828'}}>
                    Ceylon Ginger<br/>Cinnamon chai tea
                  </h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">{product.price}</span> / {product.weight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
