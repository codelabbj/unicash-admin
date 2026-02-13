import apiClient from './axios.config';

export const kycAPI = {
    getKYCRequests: async (params = {}) => {
        const response = await apiClient.get('/core/admin/kyc/', { params });
        return response;
    },

    getKYCDetails: async (uid) => {
        const response = await apiClient.get(`/core/admin/kyc/${uid}/`);
        return response;
    },

    approveKYC: async (uid) => {
        const response = await apiClient.post(`/core/admin/kyc/${uid}/approve/`);
        return response;
    },

    rejectKYC: async (uid, reason) => {
        const response = await apiClient.post(`/core/admin/kyc/${uid}/reject/`, { reason });
        return response;
    },

    getKYCStatistics: async () => {
        const response = await apiClient.get('/core/admin/kyc/statistics/');
        return response;
    }
};
