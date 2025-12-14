import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/products/Breadcrumb";
import ProductImage from "../../components/products/ProductImage";
import ProductDetails from "../../components/products/ProductDetails";
import ProductInfo from "../../components/products/ProductInfo";
import RelatedProducts from "../../components/products/RelatedProducts";
import { useProduct, useProducts } from "../../hooks/useProducts";
import { useAddToCart } from "../../hooks/useCart";
import useAuthStore from "../../store/authStore";

export const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState(null);

  const { data, isLoading, error } = useProduct(id);
  const { data: allProductsData } = useProducts({ limit: 10 });
  const addToCartMutation = useAddToCart();
  const { isAuthenticated } = useAuthStore();

  // 🔹 Normalize product data (NO side effects here)
  const product = useMemo(() => {
    if (!data?.product) return null;

    const p = data.product;

    const variants =
      p.variants?.map((v) => ({
        _id: v._id, // ✅ MongoDB _id ONLY
        label: v.name,
        price: `€${(p.basePrice + (v.priceDiff || 0)).toFixed(2)}`,
        stock: v.stock,
        sku: v.sku,
        
      })) || [];

    return {
      ...p,
      variants,
      price:
        variants.length > 0
          ? variants[0].price
          : `€${p.basePrice.toFixed(2)}`,
    };
  }, [data]);

  // ✅ Set default variant safely
 useEffect(() => {
  if (!selectedVariantId && product?.variants?.length > 0) {
    setSelectedVariantId(product.variants[0]._id);
  }
}, [product]);

  // 🔹 Related products
  const relatedProducts = useMemo(() => {
    if (!allProductsData?.products) return [];

    return allProductsData.products
      .filter((p) => p._id !== id)
      .slice(0, 3)
      .map((p) => {
        const firstVariant = p.variants?.[0];
        const price = firstVariant
          ? (p.basePrice + (firstVariant.priceDiff || 0)).toFixed(2)
          : p.basePrice.toFixed(2);

        return {
          id: p._id,
          name: p.name,
          price: `€${price}`,
          weight: firstVariant?.name || "50 g",
          image: p.images?.[0] || "/LayoutImages/collection.jpg",
        };
      });
  }, [allProductsData, id]);

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  // 🛒 ADD TO BAG (FIXED)
  const handleAddToBag = async () => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    if (!product || !selectedVariantId) return;

    const selectedVariant = product.variants.find(
      (v) => v._id === selectedVariantId
    );

    if (!selectedVariant) return;

    try {
      await addToCartMutation.mutateAsync({
        productId: product._id,
        variantId: selectedVariant._id, // ✅ correct backend ID
        quantity,
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Breadcrumb path={`HOME/COLLECTIONS/${product.name.toUpperCase()}`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          <ProductImage
            image={product.images?.[0] || "/LayoutImages/collection.jpg"}
            alt={product.name}
          />

          <ProductDetails
          key={product.id}
            title={product.name}
            description={product.description}
            price={
              product.variants.find((v) => v._id === selectedVariantId)
                ?.price || product.price
            }
            variants={product.variants}
            selectedVariant={selectedVariantId}
            setSelectedVariant={setSelectedVariantId}
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
            onAddToBag={handleAddToBag}
          />
        </div>

        <ProductInfo product={product} />
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </div>
    </div>
  );
};
