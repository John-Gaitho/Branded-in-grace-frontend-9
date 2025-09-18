-- Add policy for admins to view all orders
CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
USING (is_admin_or_owner(auth.uid()));

-- Add policy for admins to view all order items  
CREATE POLICY "Admins can view all order items"
ON public.order_items
FOR SELECT
USING (is_admin_or_owner(auth.uid()));