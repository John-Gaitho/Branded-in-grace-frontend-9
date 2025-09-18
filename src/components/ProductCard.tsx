import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className = '' }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation();
    
    setIsLoading(true);
    await addToCart(product.id);
    setIsLoading(false);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const isOutOfStock = (product.stock_quantity || 0) <= 0;

  return (
    <Card className={`group grace-card grace-hover overflow-hidden ${className}`}>
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image_url || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.is_featured && (
              <Badge variant="secondary" className="text-xs">
                Featured
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleToggleFavorite}
          >
            <Heart 
              className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-foreground'}`} 
            />
          </Button>

          {/* Quick Add Button */}
          {user && !isOutOfStock && (
            <Button
              size="sm"
              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleAddToCart}
              disabled={isLoading}
            >
              <Plus className="h-4 w-4 mr-1" />
              {isLoading ? 'Adding...' : 'Add'}
            </Button>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
            {product.description}
          </p>
          
          {/* Rating Placeholder */}
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className="h-4 w-4 fill-yellow-400 text-yellow-400" 
              />
            ))}
            <span className="text-sm text-muted-foreground ml-1">(24)</span>
          </div>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.stock_quantity && product.stock_quantity < 10 && (
              <span className="text-xs text-muted-foreground">
                Only {product.stock_quantity} left
              </span>
            )}
          </div>
          
          {!user && (
            <Button size="sm" variant="outline" disabled>
              Sign in to buy
            </Button>
          )}
        </CardFooter>
      </Link>
    </Card>
  );
}