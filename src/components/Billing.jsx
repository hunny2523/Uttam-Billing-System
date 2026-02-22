import { useState, useRef, useEffect } from "react";
import { Card } from "./Card";
import { toast } from "react-toastify";
import { useCreateBill } from "../hooks/useCreateBill";
import { usePrinterSettings } from "../hooks/usePrinterSettings";
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
  // State management
  const [items, setItems] = useState([]);
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [errors, setErrors] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [lastBillData, setLastBillData] = useState(null); // Store last bill for reprinting

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

  const validateItemInputs = () => {
    const newErrors = {};
    if (!price || parseFloat(price) <= 0)
      newErrors.price = "Enter a valid price.";
    if (!weight || parseFloat(weight) <= 0)
      newErrors.weight = "Enter a valid weight.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePhoneNumber = () => {
    const newErrors = {};
    if (!phoneNumber.match(/^\d{10}$/))
      newErrors.phoneNumber = "Enter a valid 10-digit phone number.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addItem = () => {
    if (!validateItemInputs()) return;
    if (!price || !weight) return;
    const total = parseFloat(price) * parseFloat(weight);
    setItems([
      ...items,
      { name: selectedItem?.label ?? "", price, weight, total },
    ]);
    setPrice("");
    setWeight("");
    setErrors({});
    setSelectedItem(null);

    // Auto-focus back to price input
    if (priceRef.current) {
      priceRef.current.focus();
    }
  };

  const finalTotal = items.reduce((sum, item) => sum + item.total, 0);

  const clearBill = () => {
    setItems([]);
    setPrice("");
    setWeight("");
    setPhoneNumber("");
    setCustomerName("");
    setErrors({});
  };

  const handleSaveBill = async (options = {}) => {
    const { autoPrint = false, sendWhatsapp = false } = options;

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

    // Prepare bill data
    const billData = {
      items,
      total: finalTotal,
      phoneNumber: phoneNumber || null,
      customerName: customerName || null,
      timestamp: new Date().toISOString(),
      sendWhatsapp, // Pass the flag to backend
    };

    // Use mutation to create bill
    createBillMutation(billData, {
      onSuccess: (response) => {
        // Store current bill number for display and printing
        if (response && response.bill) {
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

          // Handle auto-print if requested
          if (autoPrint) {
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
            } catch (printError) {
              console.error("Print error:", printError);
              toast.warning(
                "Bill saved but print failed. Check printer connection.",
              );
            }
          }

          // Clear form after successful operation
          setTimeout(() => {
            clearBill();
          }, 500);
        }
      },
    });
  };

  // Handler for Print Bill button
  const handlePrintBill = () => {
    handleSaveBill({ autoPrint: true, sendWhatsapp: false });
  };

  // Handler for Send WhatsApp button
  const handleSendWhatsApp = () => {
    // Validate before proceeding
    if (items.length === 0) {
      toast.error("Please add items to the bill");
      return;
    }

    // Validate phone number is required for WhatsApp
    if (!phoneNumber) {
      toast.error("Please enter customer phone number to send WhatsApp");
      return;
    }

    if (!validatePhoneNumber()) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    // Check if automatic WhatsApp is enabled in settings
    const whatsappEnabled = localStorage.getItem("whatsappEnabled") === "true";

    // Save bill first, then open WhatsApp
    const billData = {
      items,
      total: finalTotal,
      phoneNumber: phoneNumber || null,
      customerName: customerName || null,
      timestamp: new Date().toISOString(),
      sendWhatsapp: whatsappEnabled, // Use settings preference for auto-send
    };

    createBillMutation(billData, {
      onSuccess: (response) => {
        if (response && response.bill) {
          // Store bill data
          const printData = {
            items: response.bill.items || items,
            total: response.bill.total || finalTotal,
            billNumber: response.bill.billNumber,
            customerName: response.bill.customerName,
            phoneNumber: response.bill.phoneNumber,
          };
          setLastBillData(printData);
          // Open WhatsApp with pre-filled message
          const message = `Hello ${customerName || "Customer"},\n\nThank you for your purchase!\n\nBill #${response.bill.billNumber}\nTotal: ₹${finalTotal.toFixed(2)}\n\nItems:\n${items.map((item, index) => `${index + 1}. ${item.name} - ${item.weight}kg @ ₹${item.price}/kg = ₹${item.total.toFixed(2)}`).join("\n")}\n\nThank you for your business!`;

          const encodedMessage = encodeURIComponent(message);
          const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${encodedMessage}`;

          // Open WhatsApp in new tab/window
          window.open(whatsappUrl, "_blank");

          toast.success("Bill saved! Opening WhatsApp...");

          // Clear form after successful operation
          setTimeout(() => {
            clearBill();
          }, 500);
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

  const removeItem = (indexToRemove) => {
    setItems(items.filter((_, index) => index !== indexToRemove));
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
          onAddItem={addItem}
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
          phoneNumber={phoneNumber}
          onPrintBill={handlePrintBill}
          onSendWhatsApp={handleSendWhatsApp}
          onClearBill={clearBill}
        />
      </Card>
    </div>
  );
}
