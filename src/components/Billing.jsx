import { useRef, useEffect } from "react";
import { Card } from "./Card";
import { toast } from "react-toastify";
import { useCreateBill } from "../hooks/useCreateBill";
import { usePrinterSettings } from "../hooks/usePrinterSettings";
import { useBillingContext } from "../contexts/BillingContext";
import {
  generatePrinterData,
  printWithRawBT,
  generatePOSPrinterData,
  printWithBrowserDialog,
} from "../utils/printer";
import BillingItemInput from "./BillingItemInput";
import BillingItemsList from "./BillingItemsList";
import BillingCustomerInfo from "./BillingCustomerInfo";
import BillingActions from "./BillingActions";

export default function Billing() {
  // Get billing state and functions from context
  const {
    items,
    price,
    setPrice,
    weight,
    setWeight,
    phoneNumber,
    setPhoneNumber,
    customerName,
    setCustomerName,
    errors,
    currentBillNumber,
    setCurrentBillNumber,
    selectedItem,
    setSelectedItem,
    lastBillData,
    setLastBillData,
    addItem,
    removeItem,
    getFinalTotal,
    clearBill,
    validateItemInputs,
    validatePhoneNumber,
  } = useBillingContext();

  // Refs
  const priceRef = useRef(null);

  // Custom hook for creating bills
  const { mutate: createBillMutation, isPending: isLoading } = useCreateBill();

  // Get printer settings
  const { isPOSPrinter } = usePrinterSettings();

  // Auto-populate price when item is selected (if item has default price)
  useEffect(() => {
    if (selectedItem?.price) {
      setPrice(selectedItem.price.toString());
    }
  }, [selectedItem]);

  const finalTotal = getFinalTotal();

  // Handle add item with auto-focus
  const handleAddItem = () => {
    addItem();
    // Auto-focus back to price input
    if (priceRef.current) {
      priceRef.current.focus();
    }
  };

  const handleSaveBill = async () => {
    // Validate before proceeding
    if (items.length === 0) {
      toast.error("Please add items to the bill");
      return;
    }

    // Validate phone number only if provided
    if (phoneNumber && !validatePhoneNumber()) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    // Check if automatic WhatsApp is enabled in settings
    const whatsappEnabled = localStorage.getItem("whatsappEnabled") === "true";

    // Prepare bill data
    const billData = {
      items,
      total: finalTotal,
      phoneNumber: phoneNumber || null,
      customerName: customerName || null,
      timestamp: new Date().toISOString(),
      whatsappEnabled, // Pass WhatsApp setting to backend
    };

    // Use mutation to create bill
    createBillMutation(billData, {
      onSuccess: (response) => {
        // Store current bill number for display and printing
        if (response && response.bill) {
          setCurrentBillNumber(response.bill.billNumber);

          // Prepare bill data for printing
          const printData = {
            items: response.bill.items || items,
            total: response.bill.total || finalTotal,
            billNumber: response.bill.billNumber,
            customerName: response.bill.customerName,
            phoneNumber: response.bill.phoneNumber,
          };

          // Store bill data for potential reprinting
          setLastBillData(printData);

          // Auto print based on selected printer type
          try {
            if (isPOSPrinter) {
              // Print with POS printer (browser dialog)
              printWithBrowserDialog(printData);
              toast.success("Bill saved! Printing...");
            } else {
              // Print with Thermal printer (RawBT)
              const encodedData = generatePrinterData(printData);
              printWithRawBT(encodedData);
              toast.success("Bill saved! Sent to thermal printer");
            }

            // Clear form after successful print
            setTimeout(() => {
              clearBill();
            }, 500);
          } catch (printError) {
            console.error("Print error:", printError);
            toast.warning(
              "Bill saved but print failed. Check printer connection.",
            );
            // Still clear the form even if print fails
            clearBill();
          }
        }
      },
    });
  };

  // Print with POS Printer (Browser Dialog - works with any POS printer)
  const handlePOSPrint = () => {
    if (!lastBillData) {
      toast.error("No bill to print. Please save a bill first.");
      return;
    }

    try {
      printWithBrowserDialog(lastBillData);
    } catch (error) {
      console.error("POS Print error:", error);
      toast.error("Failed to open print dialog");
    }
  };

  // Reprint with RawBT (old printer)
  const handleRawBTPrint = () => {
    if (!lastBillData) {
      toast.error("No bill to print. Please save a bill first.");
      return;
    }

    try {
      const encodedData = generatePrinterData(lastBillData);
      printWithRawBT(encodedData);
      toast.success("Sent to thermal printer!");
    } catch (error) {
      console.error("Print error:", error);
      toast.error("Failed to print");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-6 px-2">
      <Card className="w-full p-3 max-w-md bg-white shadow-lg rounded-2xl">
        {/* Item Input Section */}
        <BillingItemInput
          price={price}
          setPrice={setPrice}
          weight={weight}
          setWeight={setWeight}
          priceRef={priceRef}
          errors={errors}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          onAddItem={handleAddItem}
        />

        {/* Items List Section */}
        <BillingItemsList items={items} onRemoveItem={removeItem} />

        {/* Total Section */}
        <div className="text-lg font-bold text-center mt-4 mb-4">
          Final Total: ₹{finalTotal.toFixed(2)}
        </div>

        {/* Customer Info Section */}
        <BillingCustomerInfo
          customerName={customerName}
          setCustomerName={setCustomerName}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          errors={errors}
        />

        {/* Actions Section */}
        <BillingActions
          isLoading={isLoading}
          itemsCount={items.length}
          onSaveBill={handleSaveBill}
          onClearBill={clearBill}
        />
      </Card>
    </div>
  );
}
