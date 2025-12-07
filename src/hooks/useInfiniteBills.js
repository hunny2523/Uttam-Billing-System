import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import api from "../services/api";

/**
 * Custom hook to fetch bills with infinite scroll/pagination
 * @param {Object} options - Query options
 * @param {string} options.startDate - Start date in YYYY-MM-DD format
 * @param {string} options.endDate - End date in YYYY-MM-DD format
 * @param {number} options.billNumber - Bill number to filter
 * @param {number} options.limit - Items per page (default: 10)
 * @param {boolean} options.enabled - Enable/disable the query
 * @returns {Object} Query result with pages, hasNextPage, fetchNextPage, etc.
 */
export const useInfiniteBills = (options = {}) => {
    const {
        startDate,
        endDate,
        billNumber,
        limit = 10,
        enabled = true,
    } = options;

    return useInfiniteQuery({
        queryKey: ["bills-infinite", { startDate, endDate, billNumber, limit }],
        queryFn: async ({ pageParam = 1 }) => {
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
            params.page = pageParam;
            params.limit = limit;

            const response = await api.get("/bills", { params });
            return response.data;
        },
        getNextPageParam: (lastPage) => {
            const { page, totalPages } = lastPage.pagination;
            return page < totalPages ? page + 1 : undefined;
        },
        enabled: enabled && (!!startDate || !!endDate || !!billNumber),
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
        retry: 1,
    });
};

/**
 * Custom hook to fetch ALL bills for export (no pagination)
 * @param {Object} options - Query options
 * @param {string} options.startDate - Start date in YYYY-MM-DD format
 * @param {string} options.endDate - End date in YYYY-MM-DD format
 * @param {boolean} options.enabled - Enable/disable the query
 * @returns {Object} Query result with all bills
 */
export const useAllBillsForExport = (options = {}) => {
    const {
        startDate,
        endDate,
        enabled = false, // Default disabled, only enable when user clicks export
    } = options;

    return useQuery({
        queryKey: ["bills-export", { startDate, endDate }],
        queryFn: async () => {
            const params = {
                limit: 0, // 0 = fetch all bills without pagination
            };

            if (startDate) {
                params.startDate = new Date(`${startDate}T00:00:00`).toISOString();
            }
            if (endDate) {
                params.endDate = new Date(`${endDate}T23:59:59`).toISOString();
            }

            const response = await api.get("/bills", { params });
            return response.data;
        },
        enabled: enabled && !!startDate && !!endDate,
        staleTime: 0, // Don't cache export data
        gcTime: 0,
        retry: 1,
    });
};
