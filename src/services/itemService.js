import api from './api';

// Fetch all items (with optional includeInactive for admin)
export const getItems = async (includeInactive = false) => {
    const params = includeInactive ? { includeInactive: 'true' } : {};
    const response = await api.get('/items', { params });
    return response.data;
};

// Update item price (admin only)
export const updateItemPrice = async (id, price) => {
    const response = await api.patch(`/items/${id}/price`, { price });
    return response.data;
};

// Create new item (admin only)
export const createItem = async (itemData) => {
    const response = await api.post('/items', itemData);
    return response.data;
};

// Toggle item active status (admin only)
export const toggleItemStatus = async (id) => {
    const response = await api.patch(`/items/${id}/toggle`);
    return response.data;
};
