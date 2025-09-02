// API client for Flask backend
import type { Product, CartItem, Order, Review } from '@/types';

// Base URL for your Flask backend
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-domain.com' 
  : 'http://localhost:5000';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Helper function to make authenticated requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error! status: ${response.status}`);
  }

  // Handle empty responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return null;
};

// Auth API using Flask backend
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.access_token) {
      localStorage.setItem('auth_token', response.access_token);
    }
    
    return { user: response.user, token: response.access_token };
  },

  register: async (email: string, password: string) => {
    const response = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.access_token) {
      localStorage.setItem('auth_token', response.access_token);
    }
    
    return { user: response.user, token: response.access_token };
  },

  me: async () => {
    return await apiRequest('/api/auth/me');
  },

  logout: async () => {
    localStorage.removeItem('auth_token');
  },
};

// Products API using Flask backend
export const productsAPI = {
  list: async () => {
    return await apiRequest('/api/products/') as Product[];
  },

  getBySlug: async (slug: string) => {
    return await apiRequest(`/api/products/${slug}`) as Product;
  },

  create: async (productData: any) => {
    return await apiRequest('/api/products/', {
      method: 'POST',
      body: JSON.stringify(productData),
    }) as Product;
  },

  update: async (slug: string, productData: Partial<Product>) => {
    return await apiRequest(`/api/products/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }) as Product;
  },

  delete: async (slug: string) => {
    await apiRequest(`/api/products/${slug}`, {
      method: 'DELETE',
    });
  },
};

// Cart API using Flask backend
export const cartAPI = {
  get: async (): Promise<CartItem[]> => {
    const result = await apiRequest('/api/cart/');
    return result || [];
  },

  addItem: async (productId: string, quantity: number = 1) => {
    return await apiRequest('/api/cart/add', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  },

  updateItem: async (id: string, quantity: number) => {
    return await apiRequest('/api/cart/update', {
      method: 'POST',
      body: JSON.stringify({ item_id: id, quantity }),
    });
  },

  removeItem: async (id: string) => {
    await apiRequest(`/api/cart/${id}`, {
      method: 'DELETE',
    });
  },

  clear: async () => {
    try {
      const cartItems = await cartAPI.get();
      if (cartItems && cartItems.length > 0) {
        await Promise.all(cartItems.map(item => cartAPI.removeItem(item.id)));
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },
};

// Orders API using Flask backend
export const ordersAPI = {
  list: async () => {
    return await apiRequest('/api/orders/') as Order[];
  },

  // Admin function to get all orders - same endpoint but with admin privileges
  listAll: async () => {
    return await apiRequest('/api/orders/') as Order[];
  },

  get: async (id: string) => {
    return await apiRequest(`/api/orders/${id}`) as Order;
  },

  create: async (orderData: any) => {
    return await apiRequest('/api/orders/', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }) as Order;
  },

  createOrderItem: async (orderItemData: any) => {
    return await apiRequest('/api/order-items/', {
      method: 'POST',
      body: JSON.stringify(orderItemData),
    });
  },

  updateStatus: async (orderId: string, status: string) => {
    return await apiRequest(`/api/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }) as Order;
  },

  delete: async (orderId: string) => {
    await apiRequest(`/api/orders/${orderId}`, {
      method: 'DELETE',
    });
  },
};

// M-Pesa API using Flask backend
export const mpesaAPI = {
  initiatePayment: async (phoneNumber: string, amount: number, accountReference: string) => {
    return await apiRequest('/api/mpesa/stkpush', {
      method: 'POST',
      body: JSON.stringify({
        phone_number: phoneNumber,
        amount,
        account_reference: accountReference,
      }),
    });
  },

  checkStatus: async (checkoutRequestId: string) => {
    const transactions = await apiRequest('/api/mpesa/transactions');
    return Array.isArray(transactions) ? transactions.find((t: any) => t.checkout_request_id === checkoutRequestId) : null;
  },

  listTransactions: async () => {
    return await apiRequest('/api/mpesa/transactions');
  },
};

// Reviews API using Flask backend
export const reviewsAPI = {
  list: async (productId: string) => {
    return await apiRequest(`/api/reviews/product/${productId}`) as Review[];
  },

  create: async (reviewData: any) => {
    return await apiRequest('/api/reviews/', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    }) as Review;
  },

  update: async (id: string, reviewData: any) => {
    // Note: Your Flask backend doesn't seem to have update endpoint for reviews
    // You may need to add this endpoint to your Flask backend
    throw new Error('Update review endpoint not implemented in Flask backend');
  },

  delete: async (id: string) => {
    // Note: Your Flask backend doesn't seem to have delete endpoint for reviews
    // You may need to add this endpoint to your Flask backend
    throw new Error('Delete review endpoint not implemented in Flask backend');
  },
};

// Contact API using Flask backend
export const contactAPI = {
  create: async (contactData: any) => {
    return await apiRequest('/api/contact/', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },
};

// Upload API - Note: You'll need to implement file upload endpoint in your Flask backend
export const uploadAPI = {
  uploadProductImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/upload/product-image`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    return await response.json();
  },
};