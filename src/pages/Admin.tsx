import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/hooks/useAuth';
import { AdminProductManagement } from '@/components/AdminProductManagement';
import { AdminOrderManagement } from '@/components/AdminOrderManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigate, Link } from 'react-router-dom';
import { Shield, Package, ArrowLeft, ShoppingCart } from 'lucide-react';

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto text-destructive mb-4" />
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              You don't have permission to access the admin panel.
            </p>
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Store
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground">Manage your store products</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Shield className="h-5 w-5" />
            <span>Admin Access</span>
          </div>
        </div>

        {/* Admin Sections */}
        <div className="grid gap-8">
          {/* Product Management Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <CardTitle>Product Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <AdminProductManagement />
            </CardContent>
          </Card>

          {/* Order Management Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <CardTitle>Order Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <AdminOrderManagement />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}