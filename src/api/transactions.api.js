import apiClient from './axios.config';

export const transactionsAPI = {
    getTransactions: async (params = {}) => {
        const response = await apiClient.get('/core/admin/transactions/', { params });
        const data = response.data;
        const results = Array.isArray(data) ? data : (data.results || data.data || []);
        return { 
            data: results,
            count: data.count,
            next: data.next,
            previous: data.previous
        };
    },

    updateTransactionStatus: async (id, status) => {
        const response = await apiClient.patch(`/core/admin/transactions/${id}/`, { status });
        return response;
    },

    getUserTransactions: async (userId, params = {}) => {
        const response = await apiClient.get(`/core/admin/users/${userId}/transactions/`, { params });
        const data = response.data;
        const results = Array.isArray(data) ? data : (data.results || data.data || []);
        return { 
            data: results,
            count: data.count,
            next: data.next,
            previous: data.previous
        };
    },

    retryCredit: async (uid) => {
        const response = await apiClient.post(`/core/admin/transactions/${uid}/retry_credit/`);
        return response;
    },

    getTransactionDetails: async (id) => {
        const response = await apiClient.get(`/core/admin/transactions/${id}/`);
        return response.data;
    },

    markCompleted: async (uid) => {
        const response = await apiClient.post(`/core/admin/transactions/${uid}/mark-completed/`);
        return response;
    },

    markFailed: async (uid) => {
        const response = await apiClient.post(`/core/admin/transactions/${uid}/mark-failed/`);
        return response;
    },

    // Commission Statistics
    getCommissionsStats: async (params = {}) => {
        const response = await apiClient.get('/core/admin/stats-detailed/commission-stats/', { params });
        return response.data;
    },

    getCommissionsGraphsStats: async (params = {}) => {
        const response = await apiClient.get('/core/admin/stats-detailed/chart-data/', { params });
        return response.data;
    },

    getCommissionsMonthsGraph: async (params = {}) => {
        const response = await apiClient.get('/core/admin/stats-detailed/monthly-chart-data/', { params });
        return response.data;
    }
};
