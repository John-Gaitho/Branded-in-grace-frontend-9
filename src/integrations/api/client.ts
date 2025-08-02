// API client for backend integration
const API_BASE_URL = 'http://localhost:5000'; // Update with your backend URL

// Token management
let authToken: string | null = localStorage.getItem('authToken');

const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
});

// Base API call function
const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const data = await apiCall<{ access_token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(data.access_token);
    return data;
  },

  register: async (email: string, password: string) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  refresh: async () => {
    const data = await apiCall<{ access_token: string }>('/auth/refresh', {
      method: 'POST',
    });
    setAuthToken(data.access_token);
    return data;
  },

  logout: () => {
    setAuthToken(null);
  },
};

// Products API
export const productsAPI = {
  list: async () => {
    return apiCall<any[]>('/products/');
  },

  getBySlug: async (slug: string) => {
    return apiCall<any>(`/products/${slug}`);
  },

  create: async (productData: any) => {
    return apiCall('/products/', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  update: async (id: number, productData: any) => {
    return apiCall(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  delete: async (id: number) => {
    return apiCall(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Cart API
export const cartAPI = {
  get: async () => {
    return apiCall<any[]>('/cart/');
  },

  addItem: async (productId: string, quantity: number) => {
    return apiCall('/cart/', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  },

  updateItem: async (id: number, quantity: number) => {
    return apiCall(`/cart/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  removeItem: async (id: number) => {
    return apiCall(`/cart/${id}`, {
      method: 'DELETE',
    });
  },

  clear: async () => {
    return apiCall('/cart/', {
      method: 'DELETE',
    });
  },
};

// Orders API
export const ordersAPI = {
  list: async () => {
    return apiCall<any[]>('/orders/');
  },

  get: async (id: number) => {
    return apiCall<any>(`/orders/${id}`);
  },

  create: async (orderData: any) => {
    return apiCall('/orders/', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },
};

// M-Pesa API
export const mpesaAPI = {
  initiatePayment: async (phone: string, amount: number, accountReference: string) => {
    return apiCall('/mpesa/payment', {
      method: 'POST',
      body: JSON.stringify({
        phone_number: phone,
        amount,
        account_reference: accountReference,
      }),
    });
  },

  checkStatus: async (checkoutRequestId: string) => {
    return apiCall(`/mpesa/status/${checkoutRequestId}`);
  },
};

// Upload API
export const uploadAPI = {
  uploadProductImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/upload/product-images`, {
      method: 'POST',
      headers: {
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  },
};

export { setAuthToken, authToken };