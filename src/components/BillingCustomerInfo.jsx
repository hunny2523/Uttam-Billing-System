import { Input } from "./Input";
import { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import { useCustomers } from "../hooks/useCustomers";

export default function BillingCustomerInfo({
  customerName,
  setCustomerName,
  phoneNumber,
  setPhoneNumber,
  errors,
}) {
  const [phoneSearch, setPhoneSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Fetch customers based on phone search
  const { data: customersData } = useCustomers(phoneSearch);

  // Transform customers for select dropdown
  const customerOptions =
    customersData?.customers?.map((customer) => ({
      value: customer.phone,
      label: `${customer.phone}${customer.name ? ` - ${customer.name}` : ""}`,
      phone: customer.phone,
      name: customer.name,
    })) || [];

  // Handle customer selection
  const handleCustomerChange = (selected) => {
    setSelectedCustomer(selected);
    if (selected) {
      setPhoneNumber(selected.phone);
      if (selected.name) {
        setCustomerName(selected.name);
      }
    } else {
      setPhoneNumber("");
      setCustomerName("");
    }
  };

  // Handle creating new customer (manual phone entry)
  const handleCreateCustomer = (inputValue) => {
    // User typed a phone number
    const newCustomer = {
      value: inputValue,
      label: inputValue,
      phone: inputValue,
      name: null,
    };
    setSelectedCustomer(newCustomer);
    setPhoneNumber(inputValue);
  };

  // Update phone search when user types
  const handleInputChange = (inputValue) => {
    setPhoneSearch(inputValue);
  };

  // Sync selected customer with phone number changes
  useEffect(() => {
    if (!phoneNumber) {
      setSelectedCustomer(null);
    }
  }, [phoneNumber]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">
          Phone Number (Optional - for WhatsApp)
        </label>
        <CreatableSelect
          value={selectedCustomer}
          options={customerOptions}
          onChange={handleCustomerChange}
          onCreateOption={handleCreateCustomer}
          onInputChange={handleInputChange}
          placeholder="Type phone number"
          isClearable
          formatCreateLabel={(inputValue) => `Use: ${inputValue}`}
        />
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
