import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const adminApi = {
    // Users
    getUsers: async (page = 1, limit = 20) => {
        const response = await apiClient.get(`/admin/users?page=${page}&limit=${limit}`);
        return response.data;
    },

    blockUser: async (userId: string) => {
        const response = await apiClient.post(`/admin/users/${userId}/block`);
        return response.data;
    },

    // Payments
    getPayments: async (page = 1, limit = 20) => {
        const response = await apiClient.get(`/admin/payments?page=${page}&limit=${limit}`);
        return response.data;
    },

    // Devices  
    getDevices: async (userId?: string) => {
        const url = userId ? `/admin/devices?userId=${userId}` : '/admin/devices';
        const response = await apiClient.get(url);
        return response.data;
    },

    // Statistics
    getStatistics: async () => {
        const response = await apiClient.get('/admin/statistics');
        return response.data;
    },
};

export default apiClient;
