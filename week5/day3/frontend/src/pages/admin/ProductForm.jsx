import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct, useCreateProduct, useUpdateProduct } from '../../hooks/useProducts';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Plus, Minus, Upload, ArrowLeft } from 'lucide-react';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: productData, isLoading } = useProduct(id);
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    basePrice: '',
    tags: '',
    variants: [{ name: '', priceDiff: 0, stock: 0, sku: '', isActive: true }],
    image: null
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id && productData?.product) {
      const p = productData.product;
      setFormData({
        name: p.name || '',
        description: p.description || '',
        category: p.category || '',
        basePrice: p.basePrice || '',
        tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''),
        variants: p.variants?.length > 0 ? p.variants : [{ name: '', priceDiff: 0, stock: 0, sku: '', isActive: true }],
        image: null
      });
    }
  }, [id, productData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'File too large. Max 5MB.' }));
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { name: '', priceDiff: 0, stock: 0, sku: '', isActive: true }]
    }));
  };

  const removeVariant = (index) => {
    if (formData.variants.length > 1) {
      setFormData(prev => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index)
      }));
    }
  };

  const handleVariantChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) newErrors.basePrice = 'Valid price is required';
    
    // Validate at least one variant with name
    if (!formData.variants.some(v => v.name.trim())) {
      newErrors.variants = 'At least one variant with size is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    try {
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('description', formData.description.trim());
      data.append('category', formData.category);
      data.append('basePrice', formData.basePrice);
      
      if (formData.tags.trim()) {
        data.append('tags', formData.tags.trim());
      }
      
      if (formData.variants.length > 0) {
        const validVariants = formData.variants.filter(v => v.name.trim());
        if (validVariants.length > 0) {
          data.append('variants', JSON.stringify(validVariants));
        }
      }
      
      if (formData.image) {
        data.append('image', formData.image);
      }

      if (id) {
        await updateMutation.mutateAsync({ id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      
      navigate('/admin/products');
    } catch (error) {
      setErrors({ form: error.response?.data?.message || error.message });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-400 mx-auto">
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate('/admin/products')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {id ? 'Edit Product' : 'Create Product'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {id ? 'Update product information' : 'Add a new product to your catalog'}
            </p>
          </div>
        </div>
        
        {errors.form && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">{errors.form}</p>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.description ? 'border-destructive' : ''}`}
                  placeholder="Enter product description"
                />
                {errors.description && <p className="text-destructive text-sm">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange({ target: { name: 'category', value } })}>
                    <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Black teas">Black teas</SelectItem>
                      <SelectItem value="Green teas">Green teas</SelectItem>
                      <SelectItem value="White teas">White teas</SelectItem>
                      <SelectItem value="Chai">Chai</SelectItem>
                      <SelectItem value="Matcha">Matcha</SelectItem>
                      <SelectItem value="Herbal teas">Herbal teas</SelectItem>
                      <SelectItem value="Oolong">Oolong</SelectItem>
                      <SelectItem value="Rooibos">Rooibos</SelectItem>
                      <SelectItem value="Teaware">Teaware</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-destructive text-sm">{errors.category}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="basePrice">Base Price (€) *</Label>
                  <Input
                    id="basePrice"
                    name="basePrice"
                    type="number"
                    value={formData.basePrice}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className={errors.basePrice ? 'border-destructive' : ''}
                  />
                  {errors.basePrice && <p className="text-destructive text-sm">{errors.basePrice}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="organic, premium, caffeine-free (comma separated)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Product Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
                {formData.image && (
                  <p className="text-sm text-muted-foreground">Selected: {formData.image.name}</p>
                )}
                {errors.image && <p className="text-destructive text-sm">{errors.image}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Product Variants *</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Add different sizes and pricing options</p>
                </div>
                <Button type="button" onClick={addVariant} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Variant
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {errors.variants && <p className="text-destructive text-sm mb-4">{errors.variants}</p>}

              <div className="space-y-4">
                {formData.variants.map((variant, index) => (
                  <Card key={index} className="border-muted">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Variant {index + 1}</Badge>
                          {index === 0 && <Badge variant="secondary">Required</Badge>}
                        </div>
                        {formData.variants.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVariant(index)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="space-y-2">
                          <Label>Size *</Label>
                          <Select 
                            value={variant.name} 
                            onValueChange={(value) => handleVariantChange(index, 'name', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="50g">50g</SelectItem>
                              <SelectItem value="100g">100g</SelectItem>
                              <SelectItem value="170g">170g</SelectItem>
                              <SelectItem value="250g">250g</SelectItem>
                              <SelectItem value="1kg">1kg</SelectItem>
                              <SelectItem value="sampler">sampler</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Price Diff (€)</Label>
                          <Input
                            type="number"
                            value={variant.priceDiff}
                            onChange={(e) => handleVariantChange(index, 'priceDiff', parseFloat(e.target.value) || 0)}
                            step="0.01"
                            placeholder="0.00"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Stock</Label>
                          <Input
                            type="number"
                            value={variant.stock}
                            onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value) || 0)}
                            min="0"
                            placeholder="0"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>SKU</Label>
                          <Input
                            value={variant.sku}
                            onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                            placeholder="Auto-generated"
                          />
                        </div>

                        <div className="flex items-center space-x-2 pt-6">
                          <input
                            type="checkbox"
                            id={`active-${index}`}
                            checked={variant.isActive}
                            onChange={(e) => handleVariantChange(index, 'isActive', e.target.checked)}
                            className="h-4 w-4"
                          />
                          <Label htmlFor={`active-${index}`} className="text-sm">Active</Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/products')}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;