import apiClient from './axios.config';

export const countriesAPI = {
    getCountries: async () => {
        const response = await apiClient.get('/core/admin/countries/');
        const data = response.data;
        const results = Array.isArray(data) ? data : (data.results || data.data || []);
        return { data: results };
    },

    createCountry: async (data) => {
        const response = await apiClient.post('/core/admin/countries/', data);
        return response;
    },

    updateCountry: async (id, data) => {
        const response = await apiClient.patch(`/core/admin/countries/${id}/`, data);
        return response;
    },

    deleteCountry: async (id) => {
        const response = await apiClient.delete(`/core/admin/countries/${id}/`);
        return response;
    },

    toggleStatus: async (id, currentStatus) => {
        const response = await apiClient.patch(`/core/admin/countries/${id}/`, {
            is_active: !currentStatus
        });
        return response;
    }
};
