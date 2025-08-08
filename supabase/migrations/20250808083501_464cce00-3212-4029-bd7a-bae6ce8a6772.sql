-- Update price columns to store values in KES instead of cents
-- Products table: convert prices from cents to KES
UPDATE public.products 
SET price = price / 100.0;

-- Orders table: convert total_amount from cents to KES
UPDATE public.orders 
SET total_amount = total_amount / 100.0;

-- Order items table: convert price from cents to KES
UPDATE public.order_items 
SET price = price / 100.0;

-- Update mpesa_transactions table: convert amount from cents to KES
UPDATE public.mpesa_transactions 
SET amount = amount / 100.0;