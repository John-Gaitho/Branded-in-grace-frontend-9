import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Heart, Share2, Star, Truck, Shield, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { productsAPI, reviewsAPI } from '@/integrations/api/client';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { ReviewForm } from '@/components/ReviewForm';
import type { Product, Review } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Fetch product
  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const data = await productsAPI.getBySlug(slug);
        setProduct(data);
      } catch {
        navigate('/shop');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [slug, navigate]);

  // Fetch reviews
  const fetchReviews = async () => {
    if (!product) return;
    try {
      const data = await reviewsAPI.list(product.id);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    if (product) fetchReviews();
  }, [product, reviewRefreshTrigger]);

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAddingToCart(true);
    await addToCart(product.id, quantity);
    setIsAddingToCart(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description || '',
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Link copied', description: 'Product link copied to clipboard' });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewsAPI.delete(reviewId);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      toast({ title: 'Review deleted', variant: 'success' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to delete review', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
      </div>
    );
  }

  const isOutOfStock = (product.stock_quantity || 0) <= 0;
  const isLowStock = (product.stock_quantity || 0) < 10 && !isOutOfStock;

  return (
    <div className="min-h-screen py-8 container mx-auto px-4">
      <Button variant="ghost" onClick={() => navigate('/shop')} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shop
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg grace-card">
            <img src={product.image_url || '/placeholder.svg'} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-start justify-between mb-2">
            <div className="flex gap-2">
              {product.is_featured && <Badge variant="secondary">Featured</Badge>}
              {isOutOfStock && <Badge variant="destructive">Out of Stock</Badge>}
              {isLowStock && <Badge variant="outline">Low Stock</Badge>}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsFavorited(!isFavorited)}>
                <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare}><Share2 className="h-5 w-5" /></Button>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
          <p className="text-4xl font-bold text-primary mb-4">{formatPrice(product.price)}</p>
          {product.description && <p className="text-muted-foreground text-lg mb-6">{product.description}</p>}

          {!isOutOfStock && user && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}><Minus className="h-4 w-4"/></Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)} disabled={quantity >= (product.stock_quantity || 0)}><Plus className="h-4 w-4"/></Button>
                </div>
              </div>
              <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={isAddingToCart}>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</Button>
            </div>
          )}

          {isOutOfStock && <Button size="lg" className="w-full" disabled>Out of Stock</Button>}

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm"><Truck className="h-4 w-4 text-primary" /><span>Free shipping (4000+ Ksh)</span></div>
            <div className="flex items-center gap-2 text-sm"><Shield className="h-4 w-4 text-primary" /><span>1 year warranty</span></div>
            <div className="flex items-center gap-2 text-sm"><RotateCcw className="h-4 w-4 text-primary" /><span>3-day returns</span></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card className="grace-card"><CardContent className="p-6">{product.description || 'No description available.'}</CardContent></Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card className="grace-card"><CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><h4 className="font-semibold mb-2">Category</h4><p className="text-muted-foreground capitalize">{product.category}</p></div>
                <div><h4 className="font-semibold mb-2">Stock</h4><p className="text-muted-foreground">{product.stock_quantity || 0} available</p></div>
                {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key}><h4 className="font-semibold mb-2">{key}</h4><p className="text-muted-foreground">{value}</p></div>
                ))}
              </div>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              {reviews.length === 0 && <p className="text-muted-foreground">No reviews yet.</p>}
              {reviews.map(r => (
                <div key={r.id} className="p-4 border rounded-lg flex justify-between items-start">
                  <div>
                    <p className="font-medium">{r.rating} ⭐</p>
                    <p className="text-muted-foreground">{r.comment}</p>
                  </div>
                  {user?.role === 'admin' && (
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteReview(r.id)}>
                      <Trash2 className="h-4 w-4"/>
                    </Button>
                  )}
                </div>
              ))}
              <ReviewForm productId={product.id} onReviewAdded={() => setReviewRefreshTrigger(prev => prev + 1)} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
