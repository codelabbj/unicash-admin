import apiClient from './axios.config';

export const usersAPI = {
    getUsers: async (filters = {}) => {
        const response = await apiClient.get('/auth/admin/users/', { params: filters });
        const data = response.data;
        const results = Array.isArray(data) ? data : (data.results || data.data || []);
        return { data: results };
    },

    getUserById: async (id) => {
        const response = await apiClient.get(`/auth/admin/users/${id}/`);
        return response;
    },

    updateUserStatus: async (id, status) => {
        const response = await apiClient.patch(`/auth/admin/users/${id}/`, {
            is_active: status === 'ACTIVE'
        });
        return response;
    },

    updateUserRole: async (id, role) => {
        const response = await apiClient.patch(`/auth/admin/users/${id}/`, { role });
        return response;
    },

    blockUser: async (id) => {
        const response = await apiClient.post(`/auth/admin/users/${id}/block/`);
        return response;
    },

    unblockUser: async (id) => {
        const response = await apiClient.post(`/auth/admin/users/${id}/unblock/`);
        return response;
    },

    updateUserFee: async (userId, feeRate) => {
        const response = await apiClient.post('/core/admin/users/fees/', {
            user_uids: [userId],
            fee_rate: feeRate
        });
        return response;
    }
};
