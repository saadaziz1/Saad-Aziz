import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../api/auth';
import { useOrders } from '../hooks/useOrders';
import useAuthStore from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { User, ShoppingBag, MapPin, CreditCard, LogOut } from 'lucide-react';
import { toast } from '../hooks/useToast';

const Profile = () => {
  const { user: authUser, logout } = useAuthStore();
  const queryClient = useQueryClient();
  
  const { data, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => authAPI.me().then(res => res.data),
    enabled: false, // Disable API call, use authUser instead
  });

  const { data: ordersData, isLoading: ordersLoading } = useOrders();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    const currentUser = data?.user || authUser;

    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
      });
    }
  }, [data, authUser]);



  const updateProfileMutation = useMutation({
    mutationFn: (data) => authAPI.updateProfile(data).then(res => res.data),
    onSuccess: (response) => {
      // Update auth store
      const updatedUser = response.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      useAuthStore.setState({ user: updatedUser });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Failed to update profile.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfileMutation.mutateAsync({ name: user.name, email: user.email });
  };

  const handleChange = (e) => {
    const updatedUser = { ...user, [e.target.name]: e.target.value };
    if (data?.user) {
      queryClient.setQueryData(['user-profile'], { ...data, user: updatedUser });
    } else {
      useAuthStore.setState({ user: updatedUser });
    }
  };

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
  //       <p className="text-muted-foreground">Loading profile...</p>
  //     </div>
  //   );
  // }

  const user = data?.user || authUser;

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
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your account and view order history</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={user?.name || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={user?.email || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="flex-1"
                    >
                      {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={logout}
                      className="flex-1"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Account Status */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Role</Label>
                  <Badge variant="secondary" className="mt-1 capitalize">
                    {user?.role || 'user'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge 
                    variant={user?.isBlocked ? 'destructive' : 'success'} 
                    className="mt-1"
                  >
                    {user?.isBlocked ? 'Blocked' : 'Active'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Order History */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Order History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <p className="text-muted-foreground">Loading orders...</p>
            ) : ordersData?.orders?.length > 0 ? (
              <div className="space-y-4">
                {ordersData.orders.map((order) => (
                  <Card key={order._id} className="border-muted">
                    <CardContent className="pt-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                        <div>
                          <p className="font-medium">Order #{order._id.slice(-8)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-medium">€{order.totalAmount.toFixed(2)}</p>
                          <Badge variant={getStatusBadgeVariant(order.orderStatus)}>
                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {order.items?.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.productId?.name || 'Product'} x{item.quantity}</span>
                            <span>€{(item.priceAtOrderTime * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="pt-4 border-t border-muted space-y-2">
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <span className="font-medium">Shipping: </span>
                            <span className="text-muted-foreground">
                              {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Payment: </span>
                          <span className="text-muted-foreground capitalize">
                            {order.paymentMethod.replace('_', ' ')} - {order.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingBag className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No orders found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

