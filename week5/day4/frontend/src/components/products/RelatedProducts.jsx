const RelatedProducts = ({ products }) => {
  return (
    <div className="mt-16">
      <h2 className="text-3xl font-medium text-center mb-12 font-prosto-one text-[#282828] dark:text-foreground">
        You may also like
      </h2>
      
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group text-center">
              <div className="aspect-square mb-4 overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm mb-2 leading-tight" >
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-foreground">
                <span className="font-semibold">{product.price}</span> / {product.weight}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;