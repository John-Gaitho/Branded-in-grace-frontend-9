-- Update price column in products table to handle decimal values properly
ALTER TABLE public.products 
ALTER COLUMN price TYPE numeric(10,2);

-- Update price column in order_items table to handle decimal values properly  
ALTER TABLE public.order_items 
ALTER COLUMN price TYPE numeric(10,2);

-- Update total_amount column in orders table to handle decimal values properly
ALTER TABLE public.orders 
ALTER COLUMN total_amount TYPE numeric(10,2);

-- Update amount column in mpesa_transactions table to handle decimal values properly
ALTER TABLE public.mpesa_transactions 
ALTER COLUMN amount TYPE numeric(10,2);