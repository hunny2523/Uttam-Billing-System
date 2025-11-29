import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add JWT token to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Server responded with error status
            const { status, data, config } = error.response;

            // Check if this is a login request - don't redirect, just show error
            const isLoginRequest = config.url.includes('/auth/login');

            if (status === 401 || status === 403) {
                if (!isLoginRequest) {
                    // Token expired or invalid - redirect to login
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    toast.error('Session expired. Please login again.');
                    window.location.href = '/';
                } else {
                    // Login failed - show error but don't redirect
                    toast.error(data.error || 'Invalid email or password');
                }
            } else if (status === 404) {
                toast.error(data.error || 'Resource not found');
            } else if (status === 409) {
                toast.error(data.error || 'Conflict error');
            } else if (status >= 500) {
                toast.error('Server error. Please try again later.');
            } else if (status === 400) {
                toast.error(data.error || 'Invalid request');
            } else {
                toast.error(data.error || 'An error occurred');
            }
        } else if (error.request) {
            // Request made but no response received
            toast.error('Network error. Please check your connection.');
        } else {
            // Something else happened
            toast.error('An unexpected error occurred');
        }

        return Promise.reject(error);
    }
);

export default api;
