import { useState, useRef, useEffect } from "react";
import { Card } from "./Card";
import { toast } from "react-toastify";
import { useCreateBill } from "../hooks/useCreateBill";
import { generatePrinterData, printWithRawBT } from "../utils/printer";
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
  const [currentBillNumber, setCurrentBillNumber] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Refs
  const priceRef = useRef(null);

  // Custom hook for creating bills
  const { mutate: createBillMutation, isPending: isLoading } = useCreateBill();

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

    // Prepare bill data
    const billData = {
      items,
      total: finalTotal,
      phoneNumber: phoneNumber || null,
      customerName: customerName || null,
      timestamp: new Date().toISOString(),
    };

    // Use mutation to create bill
    createBillMutation(billData, {
      onSuccess: (response) => {
        // Store current bill number for display and printing
        if (response && response.bill) {
          setCurrentBillNumber(response.bill.billNumber);

          // Clear form
          clearBill();

          // Print receipt via RawBT
          try {
            const encodedData = generatePrinterData({
              items: response.bill.items || items,
              total: response.bill.total || finalTotal,
              billNumber: response.bill.billNumber,
              customerName: response.bill.customerName,
              phoneNumber: response.bill.phoneNumber,
            });
            printWithRawBT(encodedData);
          } catch (printError) {
            console.error("Print error:", printError);
            toast.warning(
              "Bill saved but print failed. Check RawBT connection."
            );
          }
        }
      },
    });
  };

  const removeItem = (indexToRemove) => {
    setItems(items.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-6 px-2">
      <Card className="w-full p-3 max-w-md bg-white shadow-lg rounded-2xl">
        {/* Header */}
        <h2 className="text-xl font-bold text-center mb-4">Uttam Masala</h2>

        {/* Bill Number Display */}
        {currentBillNumber && (
          <p className="text-center font-semibold text-green-600 mb-4">
            Bill No: {currentBillNumber}
          </p>
        )}

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
          onSaveBill={handleSaveBill}
          onClearBill={clearBill}
        />
      </Card>
    </div>
  );
}
