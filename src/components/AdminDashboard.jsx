import { useState } from "react";
import { Card, CardContent } from "./Card";
import { Input } from "./Input";
import { Button } from "./Button";
import { toast } from "react-toastify";
import { useBills } from "../hooks/useBills";
import BillDetailsModal from "./BillDetailsModal";

export default function AdminDashboard() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);

  // Initialize dates with today's date
  if (!startDate || !endDate) {
    const today = new Date().toISOString().split("T")[0];
    if (!startDate) setStartDate(today);
    if (!endDate) setEndDate(today);
  }

  // Fetch bills using custom hook
  const {
    data: response,
    isLoading,
    refetch,
  } = useBills({
    startDate,
    endDate,
    enabled: !!startDate && !!endDate,
  });

  const bills = response?.bills || [];
  const totalAmount = bills.reduce((sum, bill) => sum + bill.total, 0);

  const handleFilter = () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Start date cannot be after end date");
      return;
    }

    // Refetch with new dates (useQuery will automatically update via queryKey)
    refetch();
  };

  const handleToday = () => {
    const today = new Date().toISOString().split("T")[0];
    setStartDate(today);
    setEndDate(today);
    // useQuery will automatically refetch due to queryKey change
  };

  const handleThisMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-indexed (0 = January, 11 = December)

    // First day of current month
    const firstDay = new Date(year, month, 1);
    // Last day of current month
    const lastDay = new Date(year, month + 1, 0);

    // Format as YYYY-MM-DD using local date (no timezone conversion)
    const start = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const end = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      lastDay.getDate()
    ).padStart(2, "0")}`;

    setStartDate(start);
    setEndDate(end);
    // useQuery will automatically refetch due to queryKey change
  };
  const exportToCSV = () => {
    if (bills.length === 0) {
      toast.error("No bills to export");
      return;
    }

    const headers = ["Bill No", "Customer Name", "Phone", "Total", "Date"];
    const rows = bills.map((bill) => [
      bill.billNumber,
      bill.customerName || "N/A",
      bill.phoneNumber || "N/A",
      bill.total.toFixed(2),
      new Date(bill.timestamp).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bills-${startDate}-to-${endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Bills exported successfully");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-6 px-2">
      <Card className="w-full max-w-6xl bg-white shadow-lg rounded-2xl p-6">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center mb-6">
          📊 Bills Dashboard
        </h2>

        {/* Filter Section */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Start Date */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-2 text-gray-700">
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-2 text-gray-700">
                End Date
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Filter Button */}
            <div className="flex items-end">
              <Button
                onClick={handleFilter}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2"
              >
                🔍 Filter
              </Button>
            </div>

            {/* Export Button */}
            <div className="flex items-end">
              <Button
                onClick={exportToCSV}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2"
              >
                📥 Export CSV
              </Button>
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleToday}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 text-sm"
            >
              📅 Today
            </Button>
            <Button
              onClick={handleThisMonth}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 text-sm"
            >
              📆 This Month
            </Button>
          </div>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
            <p className="text-sm text-gray-600">Total Bills</p>
            <p className="text-3xl font-bold text-blue-600">{bills.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-3xl font-bold text-green-600">
              ₹{totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">⏳ Loading bills...</p>
          </div>
        )}

        {/* Bills Table */}
        {!isLoading && bills.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 border-b-2 border-gray-400">
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Bill No
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Customer Name
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Items
                  </th>
                  <th className="px-4 py-3 text-right font-bold text-gray-700">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Date & Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill, index) => (
                  <tr
                    key={bill.id}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition`}
                  >
                    <td
                      className="px-4 py-3 font-semibold text-blue-600 cursor-pointer hover:underline"
                      onClick={() => setSelectedBill(bill)}
                    >
                      #{bill.billNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {bill.customerName || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {bill.phoneNumber || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {bill.items?.length || 0}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-green-600">
                      ₹{bill.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(bill.timestamp).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && bills.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">📭 No bills found</p>
            <p className="text-sm text-gray-500 mt-2">
              Try adjusting your date filter
            </p>
          </div>
        )}
      </Card>

      {/* Bill Details Modal */}
      {selectedBill && (
        <BillDetailsModal
          bill={selectedBill}
          onClose={() => setSelectedBill(null)}
        />
      )}
    </div>
  );
}
