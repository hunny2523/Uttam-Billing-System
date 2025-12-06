import { useMutation } from "@tanstack/react-query";
import { createBill } from "../services/bill.service";
import { toast } from "react-toastify";

/**
 * Custom hook to create a bill with useMutation
 * Handles loading, error, and success states
 * Also handles WhatsApp status notifications
 * @returns {Object} Mutation object with mutate, isPending, isSuccess, etc.
 */
export const useCreateBill = () => {
    return useMutation({
        mutationFn: async (billData) => {
            const response = await createBill(billData);
            return response;
        },
        onSuccess: (data) => {

            // Check WhatsApp status and show appropriate message
            if (data?.whatsapp) {
                if (data.whatsapp.success) {
                    toast.success("Bill saved, WhatsApp message sent!");
                } else {
                    toast.warning(
                        `Bill saved successfully, but WhatsApp sending failed`
                    );
                }
            }
        },
        onError: (error) => {
            console.error("Error creating bill:", error);
            // Error toast is already shown by interceptor
        },
    });
};
