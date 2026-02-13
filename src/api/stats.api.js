import apiClient from './axios.config';

export const statsAPI = {
    getAdminStats: async () => {
        const response = await apiClient.get('/core/stats/admin/');
        return response.data;
    },
};
