import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

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
    async (config) => {
        const token = await SecureStore.getItemAsync('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export interface RegisterData {
    email: string;
    password: string;
    deviceId: string;
    deviceInfo: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    userId: string;
    email: string;
    subscriptionStatus?: string;
    subscriptionPlan?: string;
}

export const authApi = {
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    },

    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/login', data);
        return response.data;
    },
};

export interface RecoveryReportData {
    userId: string;
    smsCount: number;
    whatsappCount: number;
    notificationCount: number;
    mediaCount: number;
    deviceId?: string;
    metadata?: string;
}

export const recoveryApi = {
    submitReport: async (data: RecoveryReportData) => {
        const response = await apiClient.post('/recovery/report', data);
        return response.data;
    },

    getHistory: async (userId: string) => {
        const response = await apiClient.get(`/recovery/history/${userId}`);
        return response.data;
    },
};

export interface PaymentIntentData {
    userId: string;
    plan: 'basic' | 'pro' | 'family';
}

export const billingApi = {
    createIntent: async (data: PaymentIntentData) => {
        const response = await apiClient.post('/billing/create-intent', data);
        return response.data;
    },

    verifyPayment: async (reference: string, provider: string) => {
        const response = await apiClient.post('/billing/verify', { reference, provider });
        return response.data;
    },

    getStatus: async (userId: string) => {
        const response = await apiClient.get(`/billing/status/${userId}`);
        return response.data;
    },
};

export default apiClient;
