import { Button } from "./Button";

export default function BillingActions({
  isLoading,
  itemsCount,
  onSaveBill,
  onClearBill,
}) {
  return (
    <div className="flex flex-col gap-3 mt-3">
      {/* Main Save Bill Button */}
      <Button
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold text-lg py-2 disabled:cursor-not-allowed transition-all"
        onClick={onSaveBill}
        disabled={itemsCount === 0 || isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span> Saving...
          </span>
        ) : (
          "Save Bill"
        )}
      </Button>

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
