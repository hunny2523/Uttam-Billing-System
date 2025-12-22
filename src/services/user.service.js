import api from './api';

/**
 * Change own password
 */
export const changePassword = async (currentPassword, newPassword) => {
    const response = await api.post('/users/change-password', {
        currentPassword,
        newPassword
    });
    return response.data;
};

/**
 * Admin: Get all users
 */
export const getAllUsers = async () => {
    const response = await api.get('/users/admin/users');
    return response.data;
};

/**
 * Admin: Reset any user's password
 */
export const adminResetPassword = async (targetUserId, newPassword, adminPassword) => {
    const response = await api.post('/users/admin/reset-password', {
        targetUserId,
        newPassword,
        adminPassword
    });
    return response.data;
};
