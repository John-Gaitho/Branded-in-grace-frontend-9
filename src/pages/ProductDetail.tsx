import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Heart, Share2, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { productsAPI } from '@/integrations/api/client';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const data = await productsAPI.getBySlug(slug);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        navigate('/shop');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug, navigate]);

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
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-muted animate-pulse rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-6 bg-muted animate-pulse rounded w-1/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate('/shop')}>
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  const isOutOfStock = (product.stock_quantity || 0) <= 0;
  const isLowStock = (product.stock_quantity || 0) < 10 && !isOutOfStock;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/shop')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shop
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg grace-card">
              <img
                src={product.image_url || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full object-cover grace-hover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex gap-2">
                  {product.is_featured && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                  {isOutOfStock && (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                  {isLowStock && (
                    <Badge variant="outline">Low Stock</Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFavorited(!isFavorited)}
                  >
                    <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleShare}>
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(24 reviews)</span>
              </div>

              <p className="text-4xl font-bold text-primary mb-4">
                {formatPrice(product.price)}
              </p>

              {product.description && (
                <p className="text-muted-foreground text-lg mb-6">
                  {product.description}
                </p>
              )}
            </div>

            {/* Stock Info */}
            {product.stock_quantity && (
              <div className="text-sm text-muted-foreground">
                {isLowStock && `Only ${product.stock_quantity} left in stock`}
                {!isLowStock && !isOutOfStock && `${product.stock_quantity} in stock`}
              </div>
            )}

            {/* Quantity Selector */}
            {user && !isOutOfStock && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= (product.stock_quantity || 0)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full" 
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                </Button>
              </div>
            )}

            {!user && (
              <div className="space-y-4">
                <p className="text-muted-foreground">Please sign in to purchase this item.</p>
                <Button size="lg" className="w-full" onClick={() => navigate('/auth')}>
                  Sign In to Buy
                </Button>
              </div>
            )}

            {isOutOfStock && (
              <Button size="lg" className="w-full" disabled>
                Out of Stock
              </Button>
            )}

            <Separator />

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-primary" />
                <span>Free shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span>2 year warranty</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RotateCcw className="h-4 w-4 text-primary" />
                <span>30-day returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews (24)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card className="grace-card">
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {product.description || 'No description available.'}
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      Crafted with the utmost care and attention to detail, this beautiful cup represents 
                      the perfect blend of functionality and aesthetic appeal. Each piece is unique and 
                      tells its own story, making it a perfect addition to your daily routine or as a 
                      thoughtful gift for someone special.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <Card className="grace-card">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Material</h4>
                      <p className="text-muted-foreground">Premium ceramic</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Capacity</h4>
                      <p className="text-muted-foreground">350ml / 12oz</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Dimensions</h4>
                      <p className="text-muted-foreground">H: 10cm, D: 8cm</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Care Instructions</h4>
                      <p className="text-muted-foreground">Dishwasher safe</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card className="grace-card">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="font-semibold">Customer {i + 1}</span>
                        </div>
                        <p className="text-muted-foreground">
                          "Absolutely love this cup! The quality is exceptional and the design is beautiful. 
                          It's become my favorite for morning coffee."
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}