import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Coffee, Heart, Star, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { productsAPI } from '@/integrations/api/client';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { SocialMediaButtons } from '@/components/SocialMediaButtons';

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const data = await productsAPI.list();
        const featured = data.filter(product => product.is_featured).slice(0, 3);
        setFeaturedProducts(featured || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-background bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('/lovable-uploads/d5a84ee5-cd60-4fcf-8782-259032cb277b.png')` }}>
        <div className="absolute inset-0 bg-background/80"></div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 text-primary text-sm">
                <Star className="h-4 w-4" />
                <span>New Collection Available</span>
              </div>
              
              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="text-foreground word-stagger-1">Sip in </span>
                  <span className="text-primary text-glow word-stagger-2">Grace</span>
                  <span className="text-foreground word-stagger-2">,</span>
                  <br />
                  <span className="text-foreground word-stagger-3">Taste the </span>
                  <span className="text-primary text-glow word-stagger-4">Moment</span>
                </h1>
              </div>
              
              {/* Description */}
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Discover our curated collection of elegant cups and mugs, 
                each crafted with love to make every sip a graceful experience.
              </p>
              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="oval-button luxury-glow bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  <Link to="/shop">
                    Shop Collection
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="oval-button hover:bg-primary/5 hover:border-primary/30 font-semibold">
                  <Link to="/about">
                    Learn Our Story
                  </Link>
                </Button>
              </div>
              
              {/* Social Proof */}
              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-foreground font-medium">4.8/5</span>
                  <span className="text-muted-foreground">from 500+ reviews</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-primary" />
                  <span className="text-foreground font-medium">500+</span>
                  <span className="text-muted-foreground">happy customers😊</span>
                </div>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="relative flex justify-center items-center relative z-10">
              <div className="relative">
                {/* Rotating Cup Container */}
                <div className="floating-cup">
                  <div className="rotating-cup cup-glow">
                    <img 
                      src="/lovable-uploads/rotating.png"
                      alt="Elegant Grace Cup"
                      className="w-96 h-96 object-cover rounded-2xl"
                    />
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary/20 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-primary/30 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 -right-8 w-4 h-4 bg-primary/20 rounded-full animate-bounce delay-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Collection</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Handpicked favorites that embody the perfect blend of beauty and functionality
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="grace-card h-96 animate-pulse bg-muted" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {featuredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center">
            <Button asChild size="lg" variant="outline" className="oval-button grace-hover hover:bg-primary/5 hover:border-primary/30 font-semibold">
              <Link to="/shop">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Cups?</h2>
            <p className="text-muted-foreground text-lg">
              Every cup is crafted with love and attention to detail
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="grace-card grace-hover text-center p-8">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Handcrafted with Love</h3>
                <p className="text-muted-foreground">
                  Each cup is carefully crafted by skilled artisans with attention to every detail.
                </p>
              </CardContent>
            </Card>
            
            <Card className="grace-card grace-hover text-center p-8">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
                <p className="text-muted-foreground">
                  Made from the finest materials to ensure durability and elegant design.
                </p>
              </CardContent>
            </Card>
            
            <Card className="grace-card grace-hover text-center p-8">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast & Safe Delivery</h3>
                <p className="text-muted-foreground">
                  Quick shipping with secure packaging to ensure your cups arrive perfect.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 grace-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Cup?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have made our cups part of their daily routine.
          </p>
          <Button asChild size="lg" className="oval-button luxury-glow grace-hover bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
            <Link to="/shop">
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>
      
      {/* Floating Social Media Buttons */}
      <SocialMediaButtons />
    </div>
  );
};

export default Index;
