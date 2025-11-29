import api from './api';

// Create a new bill
export const createBill = async (billData) => {
    const response = await api.post('/bills', billData);
    return response.data;
};

// Get all bills with optional filters
export const getBills = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.billNumber) {
        params.append('billNumber', filters.billNumber);
    }
    if (filters.startDate) {
        params.append('startDate', filters.startDate);
    }
    if (filters.endDate) {
        params.append('endDate', filters.endDate);
    }

    const response = await api.get(`/bills?${params.toString()}`);
    return response.data;
};

// Get single bill by ID
export const getBillById = async (billId) => {
    const response = await api.get(`/bills/${billId}`);
    return response.data;
};

// Get next bill number
export const getNextBillNumber = async () => {
    const response = await api.get('/bills/next-number');
    return response.data.nextBillNumber;
};
