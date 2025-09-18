-- Add RLS policy to allow admins to update orders
CREATE POLICY "Admins can update orders" 
ON public.orders 
FOR UPDATE 
USING (is_admin_or_owner(auth.uid()));