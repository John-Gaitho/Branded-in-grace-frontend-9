-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- Price in cents
  image_url TEXT,
  category TEXT DEFAULT 'cups',
  stock_quantity INTEGER DEFAULT 0,
  slug TEXT UNIQUE NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  total_amount INTEGER NOT NULL, -- Total in cents
  status TEXT DEFAULT 'pending',
  stripe_session_id TEXT,
  shipping_address JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL, -- Price at time of order in cents
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create cart_items table for persistent cart
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Products are viewable by everyone
CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT 
USING (true);

-- Only authenticated users can view their own orders
CREATE POLICY "Users can view their own orders" 
ON public.orders FOR SELECT 
USING (auth.uid() = user_id);

-- Only authenticated users can view their own order items
CREATE POLICY "Users can view their own order items" 
ON public.order_items FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.orders 
  WHERE orders.id = order_items.order_id 
  AND orders.user_id = auth.uid()
));

-- Only authenticated users can manage their own cart
CREATE POLICY "Users can manage their own cart" 
ON public.cart_items FOR ALL 
USING (auth.uid() = user_id);

-- Insert some sample products
INSERT INTO public.products (name, description, price, image_url, slug, is_featured, stock_quantity) VALUES
('Grace Elegance Cup', 'A beautifully designed ceramic cup with elegant patterns perfect for your morning coffee', 2999, 'https://images.unsplash.com/photo-1570742544137-02d68dd93b16?w=400', 'grace-elegance-cup', true, 25),
('Blessed Morning Mug', 'Start your day with blessings in this inspirational ceramic mug', 2499, 'https://images.unsplash.com/photo-1557992260-ec58e38d363c?w=400', 'blessed-morning-mug', true, 30),
('Divine Grace Tumbler', 'Insulated tumbler to keep your drinks at perfect temperature', 3499, 'https://images.unsplash.com/photo-1577003833619-76bbd7f82948?w=400', 'divine-grace-tumbler', true, 20),
('Serenity Tea Cup Set', 'Delicate tea cup set for peaceful moments', 4999, 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400', 'serenity-tea-cup-set', false, 15),
('Faithful Coffee Cup', 'Classic coffee cup with inspirational messages', 2199, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400', 'faithful-coffee-cup', false, 40),
('Heavenly Hot Chocolate Mug', 'Perfect for cozy evenings with hot chocolate', 2799, 'https://images.unsplash.com/photo-1573163094367-4d41de397cb7?w=400', 'heavenly-hot-chocolate-mug', false, 35);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();