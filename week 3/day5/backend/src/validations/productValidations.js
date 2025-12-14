const { z } = require('zod');

const variantSchema = z.object({
  name: z.string().min(1, 'Variant name is required'),
  priceDiff: z.number().default(0),
  stock: z.number().min(0, 'Stock cannot be negative'),
  sku: z.string().min(1, 'SKU is required'),
  additionalImages: z.array(z.string().url()).optional(),
  isActive: z.boolean().default(true)
});

const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional(),
  basePrice: z.number().min(0, 'Base price must be positive'),
  images: z.array(z.string().url()).optional(),
  variants: z.array(variantSchema).min(1, 'At least one variant is required')
});

const updateProductSchema = createProductSchema.partial();

module.exports = { createProductSchema, updateProductSchema };