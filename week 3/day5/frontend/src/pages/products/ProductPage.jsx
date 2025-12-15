import { useState, useMemo, useEffect, useRef } from "react";
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
  const hasSetInitialVariant = useRef(false);
  
  const { data, isLoading, error } = useProduct(id);
  const { data: allProductsData } = useProducts({ limit: 10 });
  const addToCartMutation = useAddToCart();
  const { isAuthenticated } = useAuthStore();

  // Transform product data
  const product = useMemo(() => {
    if (!data?.product) return null;
    
    const p = data.product;
    const variants = p.variants?.map((v, index) => {
      // Mongoose subdocuments have _id, use that for variantId
      const variantId = v._id || v.variantId;
      return {
        id: variantId?.toString() || `variant-${index}`,
        label: v.name,
        price: `€${(p.basePrice + (v.priceDiff || 0)).toFixed(2)}`,
        variantId: variantId?.toString() || v.variantId?.toString(),
        stock: v.stock,
        sku: v.sku,
        isActive: v.isActive !== false,
      };
    }) || [];
    
    return {
      ...p,
      variants,
      price: variants.length > 0 ? variants[0].price : `€${p.basePrice.toFixed(2)}`,
    };
  }, [data]);

  // Set default selected variant when product loads
  useEffect(() => {
    if (product && product.variants.length > 0 && !hasSetInitialVariant.current) {
      const firstActive = product.variants.find(v => v.isActive) || product.variants[0];
      if (firstActive) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setSelectedVariantId(firstActive.id);
        hasSetInitialVariant.current = true;
      }
    }
    // Reset when product ID changes
    if (id && data?.product?._id !== id) {
      hasSetInitialVariant.current = false;
    }
  }, [product, id, data?.product?._id]);
  
  const currentSelectedVariantId = selectedVariantId || (product?.variants?.find(v => v.isActive) || product?.variants?.[0])?.id || null;

  // Get related products (exclude current product)
  const relatedProducts = useMemo(() => {
    if (!allProductsData?.products) return [];
    
    return allProductsData.products
      .filter(p => p._id !== id)
      .slice(0, 3)
      .map(p => {
        const firstVariant = p.variants?.[0];
        const price = firstVariant 
          ? (p.basePrice + (firstVariant.priceDiff || 0)).toFixed(2)
          : p.basePrice.toFixed(2);
        
        return {
          id: p._id,
          name: p.name,
          price: `€${price}`,
          weight: firstVariant?.name || '50 g',
          image: p.featuredImage || '/LayoutImages/collection.jpg',
        };
      });
  }, [allProductsData, id]);

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToBag = async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (!product || !selectedVariantId) return;

    const selectedVariant = product.variants.find(v => v.id === currentSelectedVariantId);
    if (!selectedVariant) {
      alert('Please select a variant');
      return;
    }

    if (!selectedVariant.isActive) {
      alert('This variant is not available');
      return;
    }

    if (selectedVariant.stock < quantity) {
      alert(`Only ${selectedVariant.stock} items available in stock`);
      return;
    }

    try {
      await addToCartMutation.mutateAsync({
        productId: product._id,
        variantId: selectedVariant.variantId || selectedVariant.id,
        quantity: quantity,
      });
      alert('Product added to cart!');
      // Optionally show success message or open cart
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumb path={`HOME/COLLECTIONS/${product.name.toUpperCase()}`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          <ProductImage 
            image={product.featuredImage || '/LayoutImages/collection.jpg'} 
            alt={product.name} 
          />

          <ProductDetails 
            title={product.name}
            description={product.description}
            price={product.variants.find(v => v.id === currentSelectedVariantId)?.price || product.price}
            variants={product.variants}
            selectedVariant={currentSelectedVariantId}
            setSelectedVariant={setSelectedVariantId}
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
            onAddToBag={handleAddToBag}
          />
        </div>

        <ProductInfo product={product} />
        {relatedProducts.length > 0 && <RelatedProducts products={relatedProducts} />}
      </div>
    </div>
  );


};