// API client for Supabase integration
import { supabase } from '@/integrations/supabase/client';
import type { Product, CartItem, Order, Review } from '@/types';

// Auth API using Supabase
export const authAPI = {
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw new Error(error.message);
    return { user: data.user };
  },

  register: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    
    if (error) throw new Error(error.message);
    return data;
  },

  refresh: async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw new Error(error.message);
    return data;
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },
};

// Products API using Supabase
export const productsAPI = {
  list: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as Product[];
  },

  getBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw new Error(error.message);
    return data as Product;
  },

  create: async (productData: any) => {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Product;
  },

  update: async (id: string, productData: Partial<Product>) => {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Product;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  },
};

// Cart API using Supabase
export const cartAPI = {
  get: async () => {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as CartItem[];
  },

  addItem: async (productId: string, quantity: number = 1) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      // Update existing item
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    } else {
      // Create new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity,
        })
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    }
  },

  updateItem: async (id: string, quantity: number) => {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  removeItem: async (id: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  },

  clear: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);
    
    if (error) throw new Error(error.message);
  },
};

// Orders API using Supabase
export const ordersAPI = {
  list: async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          product:products(*)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as Order[];
  },

  // Admin function to get all orders
  listAll: async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          product:products(*)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as Order[];
  },

  get: async (id: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          product:products(*)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    return data as Order;
  },

  create: async (orderData: any) => {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Order;
  },

  createOrderItem: async (orderItemData: any) => {
    const { data, error } = await supabase
      .from('order_items')
      .insert(orderItemData)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  updateStatus: async (orderId: string, status: string) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Order;
  },
};

// M-Pesa API using Supabase Edge Functions
export const mpesaAPI = {
  initiatePayment: async (phoneNumber: string, amount: number, accountReference: string) => {
    const { data, error } = await supabase.functions.invoke('mpesa-payment', {
      body: {
        phoneNumber,
        amount,
        accountReference,
      },
    });
    
    if (error) throw new Error(error.message);
    return data;
  },

  checkStatus: async (checkoutRequestId: string) => {
    const { data, error } = await supabase
      .from('mpesa_transactions')
      .select('*')
      .eq('checkout_request_id', checkoutRequestId)
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },
};

// Reviews API using Supabase
export const reviewsAPI = {
  list: async (productId: string) => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as Review[];
  },

  create: async (reviewData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('reviews')
      .insert({ ...reviewData, user_id: user.id })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Review;
  },

  update: async (id: string, reviewData: any) => {
    const { data, error } = await supabase
      .from('reviews')
      .update(reviewData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Review;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },
};

// Upload API using Supabase Storage
export const uploadAPI = {
  uploadProductImage: async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = fileName;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (error) throw new Error(error.message);

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return { url: publicUrl };
  },
};