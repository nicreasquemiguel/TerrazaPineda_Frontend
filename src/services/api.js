import axios from 'axios'

const api = axios.create({
  baseURL: 'http://54.144.65.30:8000', // nuevo IP
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add JWT token
api.interceptors.request.use(
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

// Response interceptor to handle token expiration and refresh
api.interceptors.response.use(
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
          return api(originalRequest);
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

// Wish List API
export const getWishes = () => api.get('/api/bookings/wishes/');
export const deleteWish = (id) => api.delete(`/api/bookings/wishes/${id}/`);

// Notifications API
export const getNotifications = () => api.get('/api/bookings/notifications/');
export const markNotificationRead = (id) => api.patch(`/api/bookings/notifications/${id}/`, { read: true });

// Profile API
export const updateUserProfile = (profileData) => api.patch('/api/auth/user/profile/', profileData);
export const changeUserPassword = (passwordData) => api.post('/api/auth/user/change-password/', passwordData);

export default api; 