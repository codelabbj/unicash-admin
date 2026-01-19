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
    }
};
