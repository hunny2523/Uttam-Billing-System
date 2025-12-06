import { useQuery } from '@tanstack/react-query';
import { getItems } from '../services/itemService';

export const useItems = () => {
    return useQuery({
        queryKey: ['items'],
        queryFn: getItems,
        staleTime: 1000 * 60 * 30, // 30 minutes (items don't change frequently)
        gcTime: 1000 * 60 * 60, // 1 hour
        retry: 1,
    });
};
