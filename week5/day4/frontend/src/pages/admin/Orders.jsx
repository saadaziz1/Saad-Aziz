import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { User, Package, Calendar, MapPin } from 'lucide-react';

const Orders = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-orders', page],
    queryFn: () => api.get('/orders/all', { 
      params: { 
        page, 
        limit: 20,
        populate: 'userId'
      } 
    }).then(res => res.data),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }) => 
      api.put(`/orders/${orderId}/status`, { status }).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });

  const handleStatusUpdate = async (orderId, newStatus) => {
    await updateStatusMutation.mutateAsync({ orderId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
        <p className="text-muted-foreground">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
        <p className="text-destructive">Error loading orders</p>
      </div>
    );
  }

  const orders = data?.orders || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.currentPage || 1;

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'processing': return 'warning';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="max-w-400 mx-auto p-4 md:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Order Management</h1>
          <p className="text-muted-foreground mt-2">Manage and track all customer orders</p>
        </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Orders ({data?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="7" className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No orders found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-mono text-xs">
                        #{order._id.toString().slice(-6)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div className="min-w-0">
                            <p className="font-medium truncate">
                              {order.userId?.name || 'Unknown User'}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {order.userId?.email || 'No email'}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {order.items?.length || 0} items
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        €{order.totalAmount?.toFixed(2) || '0.00'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.orderStatus)}>
                          {order.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.orderStatus}
                          onValueChange={(value) => handleStatusUpdate(order._id, value)}
                          disabled={updateStatusMutation.isPending}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <Package className="h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground">No orders found</p>
                </div>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="border rounded-lg p-3 bg-card">
                  <div className="flex justify-between items-start mb-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs text-muted-foreground">
                        #{order._id.toString().slice(-6)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <p className="font-medium text-sm truncate">
                          {order.userId?.name || 'Unknown User'}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getStatusBadgeVariant(order.orderStatus)} className="ml-2">
                      {order.orderStatus}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm mb-3">
                    <div className="flex items-center gap-3">
                      <span>{order.items?.length || 0} items</span>
                      <span className="font-medium">€{order.totalAmount?.toFixed(2) || '0.00'}</span>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <Select
                    value={order.orderStatus}
                    onValueChange={(value) => handleStatusUpdate(order._id, value)}
                    disabled={updateStatusMutation.isPending}
                  >
                    <SelectTrigger className="w-full h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground px-4">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;