import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import { toast } from 'sonner';
import { mpesaAPI, ordersAPI } from '@/integrations/api/client';

const Checkout = () => {
  const { items: cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    address: '',
    city: '',
    zipCode: ''
  });

  const formatPrice = (price: number) => `KSh ${(price / 100).toFixed(2)}`; // Convert from cents to KES

  const subtotal = cart.reduce((sum, item) => sum + ((item.product?.price || 0) * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 500; // KSh 500 shipping
  const tax = subtotal * 0.16; // 16% VAT in Kenya
  const total = subtotal + shipping + tax;

  const handleMpesaPayment = async () => {
    if (!phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }

    if (!phoneNumber.match(/^254\d{9}$/)) {
      toast.error('Please enter a valid Kenyan phone number (254XXXXXXXXX)');
      return;
    }

    setIsProcessing(true);

    try {
      const data = await mpesaAPI.initiatePayment(
        phoneNumber,
        Math.round(total),
        `ORDER-${Date.now()}`
      ) as any;

      if (data.success) {
        toast.success('M-Pesa payment initiated! Please check your phone for the payment prompt.');
        pollPaymentStatus(data.checkout_request_id);
      } else {
        throw new Error(data.message || 'Payment initiation failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const pollPaymentStatus = async (checkoutRequestId: string) => {
    const maxAttempts = 30; // Poll for 5 minutes (30 * 10 seconds)
    let attempts = 0;

    const poll = async () => {
      try {
        const data = await mpesaAPI.checkStatus(checkoutRequestId) as any;

        if (data.status === 'completed') {
          toast.success('Payment completed successfully!');
          clearCart();
          navigate('/');
          return;
        }

        if (data.status === 'failed') {
          toast.error('Payment failed. Please try again.');
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Poll every 10 seconds
        } else {
          toast.warning('Payment status check timed out. Please contact support if payment was deducted.');
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    poll();
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (paymentMethod === 'mpesa') {
      await handleMpesaPayment();
    } else {
      // Handle other payment methods here
      toast.info('Other payment methods coming soon!');
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-6">Please sign in to proceed with checkout.</p>
          <Button onClick={() => navigate('/auth')}>Sign In</Button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some items to your cart before checkout.</p>
          <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Billing Information */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="John"
                    value={billingInfo.firstName}
                    onChange={(e) => setBillingInfo({...billingInfo, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe"
                    value={billingInfo.lastName}
                    onChange={(e) => setBillingInfo({...billingInfo, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@example.com"
                  value={billingInfo.email}
                  onChange={(e) => setBillingInfo({...billingInfo, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  placeholder="123 Main St"
                  value={billingInfo.address}
                  onChange={(e) => setBillingInfo({...billingInfo, address: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    placeholder="Nairobi"
                    value={billingInfo.city}
                    onChange={(e) => setBillingInfo({...billingInfo, city: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">Postal Code</Label>
                  <Input 
                    id="zipCode" 
                    placeholder="00100"
                    value={billingInfo.zipCode}
                    onChange={(e) => setBillingInfo({...billingInfo, zipCode: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mpesa" id="mpesa" />
                  <Label htmlFor="mpesa" className="flex items-center space-x-2">
                    <span>M-Pesa Payment</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 opacity-50">
                  <RadioGroupItem value="card" id="card" disabled />
                  <Label htmlFor="card">Credit/Debit Card (Coming Soon)</Label>
                </div>
              </RadioGroup>

              {paymentMethod === 'mpesa' && (
                <div className="mt-4">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="254712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter your M-Pesa registered phone number (format: 254XXXXXXXXX)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.product?.name || 'Unknown Product'}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{formatPrice((item.product?.price || 0) * item.quantity)}</p>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full mt-6" 
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || (paymentMethod === 'mpesa' && !phoneNumber)}
                >
                  {isProcessing ? 'Processing Payment...' : 
                   paymentMethod === 'mpesa' ? 'Pay with M-Pesa' : 'Place Order'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;