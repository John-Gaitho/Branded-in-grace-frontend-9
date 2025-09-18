-- Fix order creation and management issues

-- First, allow users to create orders
CREATE POLICY "Users can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow system to update order status (for payment updates)
CREATE POLICY "Service role can update orders" 
ON public.orders 
FOR UPDATE 
USING (auth.role() = 'service_role');

-- Allow users to create order items when creating orders
CREATE POLICY "Users can create order items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM orders 
  WHERE orders.id = order_items.order_id 
  AND orders.user_id = auth.uid()
));

-- Allow system to update order items
CREATE POLICY "Service role can update order items" 
ON public.order_items 
FOR UPDATE 
USING (auth.role() = 'service_role');