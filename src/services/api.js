import axios from 'axios'
import { getActivePinia } from 'pinia'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://terrazapineda-backend.onrender.com'

// API Configuration
const API_CONFIG = {
  baseURL: `${API_BASE}/`,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
}

// Create main API instance
const api = axios.create(API_CONFIG)

// Alternative base URLs for different environments
export const API_ENDPOINTS = {
  auth: `${API_BASE}/auth/`,
  bookings: `${API_BASE}/api/bookings/`,
  user: `${API_BASE}/api/auth/user/`,
  terraza: `${API_BASE}/terraza/api/`,
}

// Helper function to create API instances for specific endpoints
export const createApiInstance = (baseURL) => {
  return axios.create({
    ...API_CONFIG,
    baseURL: baseURL,
  })
}

// Specific API instances for different services
export const authApi = createApiInstance(API_ENDPOINTS.auth)
export const bookingsApi = createApiInstance(API_ENDPOINTS.bookings)
export const userApi = createApiInstance(API_ENDPOINTS.user)
export const terrazaApi = createApiInstance(API_ENDPOINTS.terraza)

// Bare instance used only for token refresh — no interceptors to avoid recursive loops
const refreshApi = axios.create({
  baseURL: `${API_BASE}/auth/`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Global refresh state to prevent infinite loops
let isRefreshing = false
let failedQueue = []

// Process failed requests queue
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  
  failedQueue = []
}

// Request interceptor function to add JWT token
const addAuthInterceptor = (apiInstance) => {
  apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('[API] Adding Authorization header:', config.headers.Authorization)
    } else {
      console.log('[API] No accessToken found in localStorage')
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
}

// Response interceptor function to handle token expiration and refresh
const addResponseInterceptor = (apiInstance) => {
  apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
      
      // Handle 401 errors (unauthorized) and 403 errors (forbidden)
      if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
        console.log(`[API] ${error.response.status} error detected, attempting token refresh...`);
        
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return apiInstance(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }

      originalRequest._retry = true;
        isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
        
      if (refreshToken) {
        try {
            console.log('[API] Attempting token refresh...');
            const res = await refreshApi.post('jwt/refresh/', { refresh: refreshToken });
          const newAccess = res.data.access;
            
          localStorage.setItem('accessToken', newAccess);
          originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
            
            processQueue(null, newAccess);
            isRefreshing = false;
            
            return apiInstance(originalRequest);
        } catch (refreshError) {
            console.log('[API] Token refresh failed, clearing auth and redirecting...');
            console.log('[API] Refresh error:', refreshError.response?.data || refreshError.message);
            processQueue(refreshError, null);
            isRefreshing = false;
            
            // Clear all auth data
            clearAuthData();
            
          return Promise.reject(refreshError);
        }
      } else {
          console.log('[API] No refresh token found, clearing auth and redirecting...');
          processQueue(error, null);
          isRefreshing = false;
          
          // Clear all auth data
          clearAuthData();
          
          return Promise.reject(error);
        }
      }
      
      // Handle other token-related errors
      if (error.response?.status === 400 && error.response?.data?.detail?.includes('token')) {
        console.log('[API] Invalid token detected, clearing auth...');
        clearAuthData();
        return Promise.reject(error);
      }
      
    return Promise.reject(error);
  }
);
}

// Helper function to clear authentication data
const clearAuthData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');

  // Reset global refresh state
  isRefreshing = false;
  failedQueue = [];

  // Sync Pinia reactive state so isAuthenticated updates immediately
  try {
    const pinia = getActivePinia();
    if (pinia?.state.value.auth) {
      pinia.state.value.auth.accessToken = null;
      pinia.state.value.auth.refreshToken = null;
      pinia.state.value.auth.user = null;
    }
  } catch (e) {
    console.log('[API] Could not clear Pinia store:', e);
  }

  // Redirect to login (only once)
  if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
    window.location.href = '/login';
  }
}

// Add interceptors to authenticated API instances
// authApi is intentionally excluded — it handles public auth endpoints (login, register,
// password reset) and is also used internally for the refresh call, so adding the response
// interceptor would cause a recursive refresh loop on refresh failures.
addAuthInterceptor(api)
addResponseInterceptor(api)
addAuthInterceptor(bookingsApi)
addResponseInterceptor(bookingsApi)
addAuthInterceptor(userApi)
addResponseInterceptor(userApi)
addAuthInterceptor(terrazaApi)
addResponseInterceptor(terrazaApi)

// Authentication API
export const loginUser = (credentials) => authApi.post('jwt/create/', credentials);
export const registerUser = (userData) => authApi.post('users/', userData);
export const refreshToken = (refresh) => authApi.post('jwt/refresh/', { refresh });
export const verifyToken = (token) => authApi.post('jwt/verify/', { token });

// Wish List API
export const getWishes = () => bookingsApi.get('wishes/');
export const deleteWish = (id) => bookingsApi.delete(`wishes/${id}/`);

// Notifications API
export const getNotifications = () => bookingsApi.get('notifications/');
export const markNotificationRead = (id) => bookingsApi.patch(`notifications/${id}/`, { read: true });

// Profile API
export const updateUserProfile = (profileData) => userApi.patch('profile/', profileData);
export const changeUserPassword = (passwordData) => userApi.post('change-password/', passwordData);

// Terraza API
export const getTerrazaData = () => terrazaApi.get('');
export const getTerrazaBookings = () => terrazaApi.get('bookings/');

export default api; 