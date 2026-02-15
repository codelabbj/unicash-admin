import apiClient from './axios.config';

export const aggregatorMappingsAPI = {
    // Get all aggregator mappings
    getMappings: async (params = {}) => {
        const response = await apiClient.get('/core/admin/aggregator-mappings/', { params });
        const data = response.data;
        const results = Array.isArray(data) ? data : (data.results || data.data || []);
        return {
            data: results,
            count: data.count,
            next: data.next,
            previous: data.previous
        };
    },

    // Get mapping details
    getMappingDetails: async (uid) => {
        const response = await apiClient.get(`/core/admin/aggregator-mappings/${uid}/`);
        return response.data;
    },

    // Create new mapping
    createMapping: async (data) => {
        const response = await apiClient.post('/core/admin/aggregator-mappings/', data);
        return response.data;
    },

    // Update mapping
    updateMapping: async (uid, data) => {
        const response = await apiClient.patch(`/core/admin/aggregator-mappings/${uid}/`, data);
        return response.data;
    },

    // Delete mapping
    deleteMapping: async (uid) => {
        const response = await apiClient.delete(`/core/admin/aggregator-mappings/${uid}/`);
        return response.data;
    }
};
