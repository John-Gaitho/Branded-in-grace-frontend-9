import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Phone, MapPin, Save, CreditCard, Package, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ordersAPI, mpesaAPI } from '@/integrations/api/client';
import type { Order } from '@/types';

interface ProfileData {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  bio: string;
  avatar_url: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
    bio: '',
    avatar_url: '',
  });
  const [paymentAmount, setPaymentAmount] = useState('');

  // Fetch profile from backend
  const fetchProfile = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch profile');

      const data = await res.json();

      setProfile(data);
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        phone_number: data.phone_number || '',
        address: data.address || '',
        bio: data.bio || '',
        avatar_url: data.avatar_url || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({ title: 'Error', description: 'Failed to fetch profile', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);

    try {
      const token = localStorage.getItem('access_token');
      const payload = { ...formData }; // send all fields

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to update profile');

      const updatedProfile = await res.json();
      setProfile(updatedProfile);

      toast({ title: 'Success', description: 'Profile updated successfully' });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({ title: 'Error', description: error.message || 'Failed to update profile', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const userOrders = await ordersAPI.list();
      setOrders(userOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({ title: 'Error', description: 'Failed to load orders', variant: 'destructive' });
    }
  };

  const formatPrice = (price: number) => `KSh ${(price / 100).toFixed(2)}`;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const handleMpesaPayment = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast({ title: 'Error', description: 'Please enter a valid amount', variant: 'destructive' });
      return;
    }
    if (!formData.phone_number) {
      toast({ title: 'Error', description: 'Please add your phone number first', variant: 'destructive' });
      return;
    }

    setIsProcessingPayment(true);
    try {
      await mpesaAPI.initiatePayment(formData.phone_number, parseFloat(paymentAmount), user?.email || 'BrandedInGrace');
      toast({ title: 'Payment Initiated', description: 'Please check your phone for the M-Pesa prompt' });
      setPaymentAmount('');
    } catch (error: any) {
      console.error('M-Pesa payment error:', error);
      toast({ title: 'Payment Error', description: error.message || 'Failed to initiate M-Pesa payment', variant: 'destructive' });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) { navigate('/auth'); return; }
    if (user) { fetchProfile(); fetchOrders(); }
  }, [user, authLoading, navigate]);

  if (authLoading || isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold grace-text-gradient">My Account</h1>
          <p className="text-muted-foreground mt-2">Manage your profile, view orders, and payment methods</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="grace-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><User className="h-5 w-5"/> Personal Information</CardTitle>
                <CardDescription>Update your personal details below</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input id="first_name" value={formData.first_name} onChange={(e)=>setFormData(prev=>({...prev, first_name:e.target.value}))} placeholder="Enter your first name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input id="last_name" value={formData.last_name} onChange={(e)=>setFormData(prev=>({...prev, last_name:e.target.value}))} placeholder="Enter your last name" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                      <Input id="phone_number" value={formData.phone_number} onChange={(e)=>setFormData(prev=>({...prev, phone_number:e.target.value}))} placeholder="254XXXXXXXXX" className="pl-10"/>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-muted-foreground h-4 w-4"/>
                      <Input id="address" value={formData.address} onChange={(e)=>setFormData(prev=>({...prev, address:e.target.value}))} placeholder="Enter your address" className="pl-10"/>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" value={formData.bio} onChange={(e)=>setFormData(prev=>({...prev, bio:e.target.value}))} placeholder="Tell us about yourself" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avatar_url">Avatar URL</Label>
                    <Input id="avatar_url" value={formData.avatar_url} onChange={(e)=>setFormData(prev=>({...prev, avatar_url:e.target.value}))} placeholder="Enter image URL"/>
                  </div>

                  <Button type="submit" disabled={isSaving} className="w-full"><Save className="mr-2 h-4 w-4"/>{isSaving?'Saving...':'Save Changes'}</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
  <Card className="grace-card">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Package className="h-5 w-5" /> Order History
      </CardTitle>
      <CardDescription>View all your past and current orders</CardDescription>
    </CardHeader>
    <CardContent>
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No orders found</p>
          <Button onClick={() => navigate("/shop")} className="mt-4">
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="border">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={getStatusBadgeVariant(order.status || "pending")}>
                      {order.status || "pending"}
                    </Badge>
                    <p className="font-bold mt-1">{formatPrice(order.total_amount)}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{order.email}</p>

                {/* Delete button for admin */}
                {user?.role === "admin" && (
                  <div className="mt-4 flex justify-end">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        if (!confirm("Are you sure you want to delete this order?")) return;
                        try {
                          await ordersAPI.delete(order.id);
                          setOrders((prev) => prev.filter((o) => o.id !== order.id));
                          toast({ title: "Order deleted" });
                        } catch (err) {
                          console.error("Failed to delete order:", err);
                          toast({ title: "Error", description: "Failed to delete order", variant: "destructive" });
                        }
                      }}
                    >
                      Delete Order
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card className="grace-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5"/> M-Pesa Payment</CardTitle>
                <CardDescription>Make payments using M-Pesa mobile money</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!formData.phone_number && <Alert><AlertDescription>Please add your phone number in the profile section above to use M-Pesa payments.</AlertDescription></Alert>}
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (KES)</Label>
                  <Input id="amount" type="number" value={paymentAmount} onChange={(e)=>setPaymentAmount(e.target.value)} placeholder="Enter amount" min="1" step="0.01" disabled={!formData.phone_number}/>
                </div>
                <Button onClick={handleMpesaPayment} disabled={isProcessingPayment || !formData.phone_number || !paymentAmount} className="w-full" variant="outline">{isProcessingPayment?'Processing...':'Pay with M-Pesa'}</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
