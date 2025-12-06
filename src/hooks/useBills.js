import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

/**
 * Custom hook to fetch bills with optional date filtering
 * @param {Object} options - Query options
 * @param {string} options.startDate - Start date in YYYY-MM-DD format
 * @param {string} options.endDate - End date in YYYY-MM-DD format
 * @param {number} options.billNumber - Bill number to filter
 * @param {number} options.page - Page number for pagination (default: 1)
 * @param {number} options.limit - Items per page (default: 50)
 * @param {boolean} options.enabled - Enable/disable the query
 * @returns {Object} Query result with bills, isLoading, error, etc.
 */
export const useBills = (options = {}) => {
    const {
        startDate,
        endDate,
        billNumber,
        page = 1,
        limit = 50,
        enabled = true,
    } = options;

    return useQuery({
        queryKey: ["bills", { startDate, endDate, billNumber, page, limit }],
        queryFn: async () => {
            const params = {};

            if (billNumber) {
                params.billNumber = billNumber;
            }
            if (startDate) {
                params.startDate = new Date(`${startDate}T00:00:00`).toISOString();
            }
            if (endDate) {
                params.endDate = new Date(`${endDate}T23:59:59`).toISOString();
            }
            params.page = page;
            params.limit = limit;

            const response = await api.get("/bills", { params });
            return response.data;
        },
        enabled: enabled && (!!startDate || !!endDate || !!billNumber),
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
        retry: 1,
    });
};
