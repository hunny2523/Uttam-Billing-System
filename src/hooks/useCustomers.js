import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useCustomers = (phone) => {
    const [debouncedPhone, setDebouncedPhone] = useState(phone);

    // Debounce phone input - wait 300ms after user stops typing
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedPhone(phone);
        }, 500);

        return () => clearTimeout(timer);
    }, [phone]);

    return useQuery({
        queryKey: ['customers', debouncedPhone],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${API_URL}/customers/search`, {
                params: { phone: debouncedPhone },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data;
        },
        enabled: !!debouncedPhone && debouncedPhone.length >= 5, // Only search when at least 5 digits entered
        staleTime: 1000 * 60, // 1 minute
    });
};