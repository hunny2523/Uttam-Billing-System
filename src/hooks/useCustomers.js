import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useState, useEffect } from 'react';

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
            const { data } = await api.get('/customers/search', {
                params: { phone: debouncedPhone }
            });
            return data;
        },
        enabled: !!debouncedPhone && debouncedPhone.length >= 5, // Only search when at least 5 digits entered
        staleTime: 1000 * 60, // 1 minute
    });
};