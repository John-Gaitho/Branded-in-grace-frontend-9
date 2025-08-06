-- Add RLS policy to allow admins to delete orders
CREATE POLICY "Admins can delete orders" 
ON public.orders 
FOR DELETE 
USING (is_admin_or_owner(auth.uid()));