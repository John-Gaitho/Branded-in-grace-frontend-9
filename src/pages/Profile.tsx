import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Phone, MapPin, Save, CreditCard, Package, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ordersAPI } from '@/integrations/api/client';
import type { Order } from '@/types';

interface Profile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  address: string | null;
}

export default function Profile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    address: ''
  });
  const [paymentAmount, setPaymentAmount] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchProfile();
      fetchOrders();
    }
  }, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile information",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setProfile(data);
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone_number: data.phone_number || '',
          address: data.address || ''
        });
      } else {
        // Create new profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            user_id: user?.id,
            first_name: '',
            last_name: '',
            phone_number: '',
            address: ''
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
        } else {
          setProfile(newProfile);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
          address: formData.address
        })
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      fetchProfile();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
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
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
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
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (!formData.phone_number) {
      toast({
        title: "Error",
        description: "Please add your phone number first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingPayment(true);

    try {
      const { data, error } = await supabase.functions.invoke('mpesa-payment', {
        body: {
          amount: parseFloat(paymentAmount),
          phone_number: formData.phone_number,
          account_reference: user?.email || 'BlandedInGrace',
          transaction_desc: 'Payment to Blanded in Grace'
        }
      });

      if (error) {
        console.error('M-Pesa payment error:', error);
        toast({
          title: "Payment Error",
          description: error.message || "Failed to initiate M-Pesa payment",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Payment Initiated",
        description: "Please check your phone for the M-Pesa prompt",
      });
      
      setPaymentAmount('');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold grace-text-gradient">My Account</h1>
          <p className="text-muted-foreground mt-2">
            Manage your profile, view orders, and payment methods
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Information */}
            <Card className="grace-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your personal details below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          first_name: e.target.value
                        }))}
                        placeholder="Enter your first name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          last_name: e.target.value
                        }))}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="phone_number"
                        value={formData.phone_number}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          phone_number: e.target.value
                        }))}
                        placeholder="254XXXXXXXXX"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          address: e.target.value
                        }))}
                        placeholder="Enter your address"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isSaving} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card className="grace-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order History
                </CardTitle>
                <CardDescription>
                  View all your past and current orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No orders found</p>
                    <Button 
                      onClick={() => navigate('/shop')}
                      className="mt-4"
                    >
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
                              <Badge variant={getStatusBadgeVariant(order.status || 'pending')}>
                                {order.status || 'pending'}
                              </Badge>
                              <p className="font-bold mt-1">{formatPrice(order.total_amount)}</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{order.email}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            {/* M-Pesa Payment */}
            <Card className="grace-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  M-Pesa Payment
                </CardTitle>
                <CardDescription>
                  Make payments using M-Pesa mobile money
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!formData.phone_number && (
                  <Alert>
                    <AlertDescription>
                      Please add your phone number in the profile section above to use M-Pesa payments.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (KES)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="1"
                    step="0.01"
                    disabled={!formData.phone_number}
                  />
                </div>

                <Button
                  onClick={handleMpesaPayment}
                  disabled={isProcessingPayment || !formData.phone_number || !paymentAmount}
                  className="w-full"
                  variant="outline"
                >
                  {isProcessingPayment ? 'Processing...' : 'Pay with M-Pesa'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}