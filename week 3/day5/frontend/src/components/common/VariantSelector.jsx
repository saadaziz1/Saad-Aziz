import React from 'react';
import { cn } from '@/lib/utils';

const VariantSelector = ({ variants, selectedVariant, onVariantChange, basePrice }) => {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900">Select Variant:</h4>
      <div className="grid grid-cols-1 gap-2">
        {variants.map((variant) => {
          const isSelected = selectedVariant?.variantId === variant.variantId;
          const totalPrice = basePrice + (variant.priceDiff || 0);
          const isOutOfStock = variant.stock === 0;
          
          return (
            <button
              key={variant.variantId}
              onClick={() => !isOutOfStock && onVariantChange(variant)}
              disabled={isOutOfStock}
              className={cn(
                "flex justify-between items-center p-3 border rounded-lg text-left transition-all",
                isSelected 
                  ? "border-primary bg-primary/5" 
                  : "border-gray-200 hover:border-gray-300",
                isOutOfStock && "opacity-50 cursor-not-allowed"
              )}
            >
              <div>
                <div className="font-medium">{variant.name}</div>
                <div className="text-sm text-gray-500">
                  Stock: {variant.stock} | SKU: {variant.sku}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">${totalPrice.toFixed(2)}</div>
                {variant.priceDiff !== 0 && (
                  <div className="text-xs text-gray-500">
                    {variant.priceDiff > 0 ? '+' : ''}${variant.priceDiff.toFixed(2)}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VariantSelector;