const ProductImage = ({ image, alt }) => {
  return (
    <div className="lg:w-1/2">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ProductImage;