const ProductGrid = ({ products, onProductClick }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 ">
      {products.map((product) => (
        <div 
          key={product.id} 
          className="group text-center cursor-pointer"
          onClick={() => onProductClick(product.id)}
        >
          <div className="aspect-square mb-4 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h3 className="text-sm mb-2 leading-tight text-[#282828] dark:text-foreground" >
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-foreground">
            <span className="font-semibold">{product.price}</span> / {product.weight}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;