import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Determine API URL based on platform
// Android Emulator: 10.0.2.2
// iOS Simulator: localhost
// Physical Device: Your Machine's LAN IP (e.g., 192.168.1.x)
const DEV_API_URL = Platform.select({
    android: 'http://192.168.137.159:3000/api',
    ios: 'http://192.168.137.159:3000/api',
    default: 'http://192.168.137.159:3000/api',
});

// TODO: Replace with your production URL
const PROD_API_URL = 'https://your-production-app.railway.app/api';

const API_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request Interceptor: Add Token
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('@datanyx_auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            await AsyncStorage.removeItem('@datanyx_auth_token');
            await AsyncStorage.removeItem('@datanyx_user');
            // You might want to trigger a global logout action here
        }
        return Promise.reject(error);
    }
);

export default api;
