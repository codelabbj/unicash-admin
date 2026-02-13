import apiClient from './axios.config';

export const authAPI = {
    login: (credentials) => apiClient.post('/auth/login/', credentials),
    logout: () => apiClient.post('/auth/logout/'),
    getCurrentUser: () => apiClient.get('/auth/me/'),
    refreshToken: (refresh) => apiClient.post('/auth/token/refresh/', { refresh }),
    changePassword: (data) => apiClient.post('/auth/change-password/', data),
};
