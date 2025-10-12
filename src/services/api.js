import axios from 'axios'

// API Configuration
const API_CONFIG = {
  baseURL: 'https://api.terrazapineda.com/', // HTTPS API domain
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Ensure no credentials are sent
}

// Create API instance
const api = axios.create(API_CONFIG)

// Alternative base URLs for different environments
export const API_ENDPOINTS = {
  auth: 'https://api.terrazapineda.com/auth/',
  bookings: 'https://api.terrazapineda.com/api/bookings/',
  user: 'https://api.terrazapineda.com/api/auth/user/',
  terraza: 'https://api.terrazapineda.com/terraza/api/',
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
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const res = await api.post('/auth/jwt/refresh/', { refresh: refreshToken });
            const newAccess = res.data.access;
            localStorage.setItem('accessToken', newAccess);
            originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
            return apiInstance(originalRequest);
          } catch (refreshError) {
            // SOLO UNA VEZ: limpiar y redirigir
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            // Detén el ciclo: no recargues ni redirijas infinitamente
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );
}

// Add interceptors to all API instances
addAuthInterceptor(api)
addResponseInterceptor(api)
addAuthInterceptor(authApi)
addResponseInterceptor(authApi)
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