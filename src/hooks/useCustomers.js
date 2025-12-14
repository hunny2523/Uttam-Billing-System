import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useCustomers = (phone) => {
    return useQuery({
        queryKey: ['customers', phone],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${API_URL}/customers/search`, {
                params: { phone },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data;
        },
        enabled: !!phone && phone.length >= 3, // Only search when at least 3 digits entered
        staleTime: 1000 * 60, // 1 minute
    });
};
