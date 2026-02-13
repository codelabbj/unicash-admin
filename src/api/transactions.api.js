import apiClient from './axios.config';

export const transactionsAPI = {
    getTransactions: async (params = {}) => {
        const response = await apiClient.get('/core/admin/transactions/', { params });
        // Handle pagination or direct array
        const data = response.data;
        const results = Array.isArray(data) ? data : (data.results || data.data || []);
        return { data: results };
    },

    updateTransactionStatus: async (id, status) => {
        const response = await apiClient.patch(`/core/admin/transactions/${id}/`, { status });
        return response;
    },

    getUserTransactions: async (userId, params = {}) => {
        const response = await apiClient.get(`/core/admin/users/${userId}/transactions/`, { params });
        const data = response.data;
        const results = Array.isArray(data) ? data : (data.results || data.data || []);
        return { data: results };
    },

    retryCredit: async (uid) => {
        const response = await apiClient.post(`/core/admin/transactions/${uid}/retry_credit/`);
        return response;
    },

    getTransactionDetails: async (id) => {
        const response = await apiClient.get(`/core/admin/transactions/${id}/`);
        return response.data;
    }
};
