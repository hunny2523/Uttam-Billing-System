import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBill } from "../services/bill.service";
import { toast } from "react-toastify";

/**
 * Custom hook to create a bill with useMutation
 * Handles loading, error, and success states
 * Also handles WhatsApp status notifications
 * Invalidates bills queries to revalidate dashboard data
 * @returns {Object} Mutation object with mutate, isPending, isSuccess, etc.
 */
export const useCreateBill = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (billData) => {
            const response = await createBill(billData);
            return response;
        },
        onSuccess: (data) => {
            console.log(data)
            
            // Revalidate bills data in dashboard
            // Invalidates both infinite scroll and export queries
            queryClient.invalidateQueries({ 
                queryKey: ["bills-infinite"]
            });
            queryClient.invalidateQueries({ 
                queryKey: ["bills-export"]
            });
            
            // Check WhatsApp status and show appropriate message
            if (data?.whatsapp) {
                if (data.whatsapp.success) {
                    toast.success("Bill saved, WhatsApp message sent!");
                } else {
                    toast.warning(
                        `Bill saved successfully, but WhatsApp sending failed`
                    );
                }
            } else {
                toast.success("Bill saved!");
            }
        },
        onError: (error) => {
            console.error("Error creating bill:", error);
            // Error toast is already shown by interceptor
        },
    });
};
