import axios from 'axios'
import store from '../interface/model';
function getCsrfToken() {
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "/api",
    withCredentials: true, 
    
})
// Add a request interceptor to conditionally add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
    (response )=> response,
    (error) => {
        const allowAnonymous = error.config?.allowAnonymous;

        const authHeader = error.response?.headers?.['www-authenticate'] || '';

        // Expired or invalid token → clear it
        if (authHeader.includes('invalid_token')) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            store.getActions().user.logout();
        }

        if (!allowAnonymous && error.response?.status === 401) {
            store.getActions().user.logout();
            if (!error.config?.suppressRedirect) {
                window.location.href = '/';
            }
        }

        return Promise.reject(error);
    }
)
export default api;