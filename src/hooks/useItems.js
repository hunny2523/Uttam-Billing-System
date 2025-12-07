import { useQuery } from '@tanstack/react-query';
import { getItems } from '../services/itemService';

/**
 * Custom hook to fetch items with React Query
 * @param {boolean} includeInactive - Whether to include inactive items (admin only)
 * @returns {Object} React Query result with items data
 */
export const useItems = (includeInactive = false) => {
    return useQuery({
        queryKey: ['items', includeInactive],
        queryFn: () => getItems(includeInactive),
        staleTime: 1000 * 60 * 30, // 30 minutes (items don't change frequently)
        gcTime: 1000 * 60 * 60, // 1 hour
        retry: 1,
    });
};
