import api from './api';

// Login user
export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;

    // Store token and user data in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { token, user };
};

// Logout user
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Get current user from localStorage
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (error) {
            return null;
        }
    }
    return null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

// Get token
export const getToken = () => {
    return localStorage.getItem('token');
};

// Verify token with backend
export const verifyToken = async () => {
    try {
        const response = await api.get('/auth/verify');
        return response.data.user;
    } catch (error) {
        return null;
    }
};
