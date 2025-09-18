import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Package, User, Calendar, DollarSign, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/types';


export default function AdminOrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<string | null>(null);
  const { toast } = useToast();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/orders`);
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(orderId);
      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update order status');
      await fetchOrders();
      toast({
        title: 'Success',
        description: 'Order status updated successfully',
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      setDeletingOrder(orderId);
      const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete order');
      await fetchOrders();
      toast({
        title: 'Success',
        description: 'Order deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete order',
        variant: 'destructive',
      });
    } finally {
      setDeletingOrder(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading orders...</span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center p-8">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No orders found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
              <Badge className={getStatusColor(order.status || 'pending')}>
                {order.status || 'pending'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{order.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{formatCurrency(order.total_amount)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {order.order_items?.length || 0} items
                </span>
              </div>
            </div>

            {/* Customer Details */}
            {order.shipping_address && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-3">Customer Details:</h4>
                <div className="grid gap-2 md:grid-cols-2">
                  {order.shipping_address.name && (
                    <div>
                      <span className="text-sm font-medium">Name: </span>
                      <span className="text-sm">{order.shipping_address.name}</span>
                    </div>
                  )}
                  {order.shipping_address.phone && (
                    <div>
                      <span className="text-sm font-medium">Phone: </span>
                      <span className="text-sm">{order.shipping_address.phone}</span>
                    </div>
                  )}
                  {order.shipping_address.address && (
                    <div className="md:col-span-2">
                      <span className="text-sm font-medium">Address: </span>
                      <span className="text-sm">{order.shipping_address.address}</span>
                    </div>
                  )}
                  {order.shipping_address.city && (
                    <div>
                      <span className="text-sm font-medium">City: </span>
                      <span className="text-sm">{order.shipping_address.city}</span>
                    </div>
                  )}
                  {order.shipping_address.county && (
                    <div>
                      <span className="text-sm font-medium">County: </span>
                      <span className="text-sm">{order.shipping_address.county}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {order.order_items && order.order_items.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Order Items:</h4>
                <div className="space-y-2">
                  {order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-sm bg-muted p-2 rounded"
                    >
                      <span>{item.product?.name} x {item.quantity}</span>
                      <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex gap-2 flex-wrap">
              {order.status !== 'completed' && (
                <Button
                  size="sm"
                  onClick={() => updateOrderStatus(order.id, 'completed')}
                  disabled={updatingStatus === order.id}
                >
                  {updatingStatus === order.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Mark Complete
                </Button>
              )}
              {order.status !== 'processing' && order.status !== 'completed' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateOrderStatus(order.id, 'processing')}
                  disabled={updatingStatus === order.id}
                >
                  Mark Processing
                </Button>
              )}
              {order.status !== 'cancelled' && order.status !== 'completed' && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                  disabled={updatingStatus === order.id}
                >
                  Cancel Order
                </Button>
              )}
              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteOrder(order.id)}
                disabled={deletingOrder === order.id || updatingStatus === order.id}
                className="ml-auto"
              >
                {deletingOrder === order.id ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete Order
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
