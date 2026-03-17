import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

const BillingContext = createContext(null);

export const useBillingContext = () => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error("useBillingContext must be used within a BillingProvider");
  }
  return context;
};

export const BillingProvider = ({ children }) => {
  // State management
  const [items, setItems] = useState([]);
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [errors, setErrors] = useState({});
  const [currentBillNumber, setCurrentBillNumber] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [lastBillData, setLastBillData] = useState(null);

  // Validation functions
  const validateItemInputs = useCallback(() => {
    const newErrors = {};
    if (!price || parseFloat(price) <= 0)
      newErrors.price = "Enter a valid price.";
    if (!weight || parseFloat(weight) <= 0)
      newErrors.weight = "Enter a valid weight.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [price, weight]);

  const validatePhoneNumber = useCallback(() => {
    const newErrors = {};
    if (!phoneNumber.match(/^\d{10}$/))
      newErrors.phoneNumber = "Enter a valid 10-digit phone number.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [phoneNumber]);

  // Add item to bill
  const addItem = useCallback(() => {
    if (!validateItemInputs()) return;
    if (!price || !weight) return;

    const total = parseFloat(price) * parseFloat(weight);
    setItems((prevItems) => [
      ...prevItems,
      {
        name: selectedItem?.label ?? "",
        price,
        weight,
        total,
        labelGujarati: selectedItem?.labelGujarati,
        labelEnglish: selectedItem?.labelEnglish,
      },
    ]);

    // Clear item inputs after adding
    setPrice("");
    setWeight("");
    setErrors({});
    setSelectedItem(null);
  }, [price, weight, selectedItem, validateItemInputs]);

  // Remove item from bill
  const removeItem = useCallback((indexToRemove) => {
    setItems((prevItems) =>
      prevItems.filter((_, index) => index !== indexToRemove),
    );
  }, []);

  // Calculate final total
  const getFinalTotal = useCallback(() => {
    return items.reduce((sum, item) => sum + item.total, 0);
  }, [items]);

  // Clear entire bill
  const clearBill = useCallback(() => {
    setItems([]);
    setPrice("");
    setWeight("");
    setPhoneNumber("");
    setCustomerName("");
    setErrors({});
    setSelectedItem(null);
  }, []);

  const value = useMemo(
    () => ({
      // State
      items,
      price,
      weight,
      phoneNumber,
      customerName,
      errors,
      currentBillNumber,
      selectedItem,
      lastBillData,

      // Setters
      setItems,
      setPrice,
      setWeight,
      setPhoneNumber,
      setCustomerName,
      setErrors,
      setCurrentBillNumber,
      setSelectedItem,
      setLastBillData,

      // Functions
      addItem,
      removeItem,
      getFinalTotal,
      clearBill,
      validateItemInputs,
      validatePhoneNumber,
    }),
    [
      items,
      price,
      weight,
      phoneNumber,
      customerName,
      errors,
      currentBillNumber,
      selectedItem,
      lastBillData,
      addItem,
      removeItem,
      getFinalTotal,
      clearBill,
      validateItemInputs,
      validatePhoneNumber,
    ],
  );

  return (
    <BillingContext.Provider value={value}>{children}</BillingContext.Provider>
  );
};
