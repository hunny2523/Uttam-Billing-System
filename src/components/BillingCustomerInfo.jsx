import { Input } from "./Input";
import { useState, useEffect, useRef } from "react";
import { useCustomers } from "../hooks/useCustomers";
import { useContactPicker } from "../hooks/useContactPicker";
import { toast } from "react-toastify";

export default function BillingCustomerInfo({
  customerName,
  setCustomerName,
  phoneNumber,
  setPhoneNumber,
  errors,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch customers based on phone number (only when 5+ digits)
  const { data: customersData } = useCustomers(
    phoneNumber.length >= 5 ? phoneNumber : ""
  );

  const customers = customersData?.customers || [];

  // Contact Picker API
  const { isSupported: isContactPickerSupported, pickContact } =
    useContactPicker();

  // Handle contact picker
  const handlePickContact = async () => {
    try {
      const contact = await pickContact({
        properties: ["name", "tel"],
        multiple: false,
      });

      if (contact) {
        // Clean phone number (remove non-digits)
        const cleanPhone = contact.phone.replace(/\D/g, "");

        // Set phone number (take last 10 digits if longer)
        const phoneToSet =
          cleanPhone.length > 10 ? cleanPhone.slice(-10) : cleanPhone;
        setPhoneNumber(phoneToSet);

        // Set name if available
        if (contact.name) {
          setCustomerName(contact.name);
        }

        toast.success("Contact imported successfully");
      }
    } catch (error) {
      console.error("Error picking contact:", error);
      toast.error("Failed to import contact");
    }
  };

  // Handle phone number input change
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    setHighlightedIndex(-1);
    setIsFocused(true); // Ensure focused state is true while typing
  };

  // Handle input focus
  const handleFocus = () => {
    setIsFocused(true);
  };

  // Handle input blur
  const handleBlur = () => {
    // Delay to allow click on dropdown
    setTimeout(() => {
      setIsFocused(false);
      setShowDropdown(false);
    }, 200);
  };

  // Handle customer selection from dropdown
  const handleSelectCustomer = (customer) => {
    setPhoneNumber(customer.phone);
    if (customer.name) {
      setCustomerName(customer.name);
    }
    setShowDropdown(false);
    setHighlightedIndex(-1);
    setIsFocused(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown || customers.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < customers.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelectCustomer(customers[highlightedIndex]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setHighlightedIndex(-1);
    }
  };

  // Show/hide dropdown based on conditions
  useEffect(() => {
    if (isFocused && phoneNumber.length >= 5 && customers.length > 0) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [isFocused, phoneNumber, customers]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col relative">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            type="tel"
            placeholder="Type phone number"
            value={phoneNumber}
            onChange={handlePhoneChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoComplete="off"
          />

          {/* Contact Picker Button */}
          {isContactPickerSupported && (
            <button
              type="button"
              onClick={handlePickContact}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-2 whitespace-nowrap"
              title="Import from contacts"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className="hidden sm:inline">Contacts</span>
            </button>
          )}
        </div>

        {/* Dropdown for customer suggestions */}
        {showDropdown && customers.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            {customers.map((customer, index) => (
              <div
                key={customer.id}
                onClick={() => handleSelectCustomer(customer)}
                className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                  index === highlightedIndex ? "bg-blue-100" : ""
                }`}
              >
                <div className="font-medium">{customer.phone}</div>
                {customer.name && (
                  <div className="text-sm text-gray-600">{customer.name}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {errors.phoneNumber && (
          <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
        )}
        {phoneNumber && phoneNumber.length > 0 && phoneNumber.length !== 10 && (
          <p className="text-yellow-600 text-sm mt-1">
            Phone number must be 10 digits for WhatsApp
          </p>
        )}
      </div>

      <div className="flex flex-col">
        <Input
          placeholder="Customer Name (Optional)"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        {errors.customerName && (
          <p className="text-red-500 text-sm">{errors.customerName}</p>
        )}
      </div>
    </div>
  );
}
