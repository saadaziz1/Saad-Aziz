import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { productsAPI } from '../../api/products';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';

import { Package, Plus, Edit, Eye, Trash2 } from 'lucide-react';

const Products = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-products', page],
    queryFn: () =>
      productsAPI.list({ page, limit: 10 }).then(res => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => productsAPI.delete(id).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">Error loading products</p>
      </div>
    );
  }

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.currentPage || 1;

  return (
    <div className="w-full min-h-screen bg-background max-w-screen overflow-x-hidden">
      <div className="max-w-400 mx-auto px-4 sm:px-6 py-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Product Management
            </h1>
            <p className="text-muted-foreground">
              Manage your product catalog
            </p>
          </div>

          <Button
            onClick={() => navigate('/admin/products/new')}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Products ({data?.total || products.length})
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 sm:p-6">
            <div className="w-full overflow-x-auto">
              <div className="max-w-full">
                <Table className="min-w-[720px] table-fixed">

                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Variants</TableHead>
                      <TableHead className="text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell className="truncate max-w-[220px]">
                          {product.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          €{product.basePrice?.toFixed(2) || '0.00'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {product.variants?.length || 0}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(product._id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>

                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
