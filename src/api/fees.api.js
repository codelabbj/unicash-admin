import apiClient from './axios.config';

export const feesAPI = {
    getFeeConfigs: async () => {
        const response = await apiClient.get('/core/admin/fee-configs/');
        const data = response.data;
        const results = Array.isArray(data) ? data : (data.results || data.data || []);
        return { data: results };
    },

    createFeeConfig: async (data) => {
        const response = await apiClient.post('/core/admin/fee-configs/', data);
        return response;
    },

    updateFeeConfig: async (id, data) => {
        const response = await apiClient.patch(`/core/admin/fee-configs/${id}/`, data);
        return response;
    },

    deleteFeeConfig: async (id) => {
        const response = await apiClient.delete(`/core/admin/fee-configs/${id}/`);
        return response;
    },

    toggleStatus: async (id, currentStatus) => {
        const response = await apiClient.patch(`/core/admin/fee-configs/${id}/`, {
            is_active: !currentStatus
        });
        return response;
    }
};
