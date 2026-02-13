import apiClient from './axios.config';

export const statsAPI = {
    getAdminStats: async () => {
        const response = await apiClient.get('/core/stats/admin/');
        return response.data;
    },

    getKycStats: async () => {
        const response = await apiClient.get('/core/admin/kyc/statistics/');
        return response.data;
    },
};
