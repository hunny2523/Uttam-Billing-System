import { Input } from "./Input";

export default function BillingCustomerInfo({
  customerName,
  setCustomerName,
  phoneNumber,
  setPhoneNumber,
  errors,
}) {
  return (
    <div className="flex flex-col gap-4">
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

      <div className="flex flex-col">
        <Input
          type="number"
          placeholder="Phone Number (Optional - for WhatsApp)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
        )}
        {phoneNumber && phoneNumber.length > 0 && phoneNumber.length !== 10 && (
          <p className="text-yellow-600 text-sm mt-1">
            Phone number must be 10 digits for WhatsApp
          </p>
        )}
      </div>
    </div>
  );
}
