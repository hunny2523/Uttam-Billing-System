import { Button } from "./Button";

export default function BillingActions({
  isLoading,
  itemsCount,
  phoneNumber,
  onPrintBill,
  onSendWhatsApp,
  onClearBill,
}) {
  return (
    <div className="flex flex-col gap-3 mt-3">
      {/* Print Bill Button */}
      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold text-lg py-2 disabled:cursor-not-allowed transition-all"
        onClick={onPrintBill}
        disabled={itemsCount === 0 || isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span> Processing...
          </span>
        ) : (
          "🖨️ Print Bill"
        )}
      </Button>

      {/* Send WhatsApp Button */}
      <Button
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold text-lg py-2 disabled:cursor-not-allowed transition-all"
        onClick={onSendWhatsApp}
        disabled={itemsCount === 0 || isLoading || !phoneNumber}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span> Processing...
          </span>
        ) : (
          "📱 Send WhatsApp"
        )}
      </Button>

      {/* Helper text for WhatsApp button */}
      {!phoneNumber && itemsCount > 0 && (
        <p className="text-xs text-gray-500 text-center -mt-2">
          Enter phone number to send WhatsApp
        </p>
      )}

      {/* Clear Bill Button */}
      <Button
        className="w-full bg-red-600 hover:bg-red-700 text-white"
        onClick={onClearBill}
        disabled={isLoading}
      >
        🗑️ Clear Bill
      </Button>
    </div>
  );
}
