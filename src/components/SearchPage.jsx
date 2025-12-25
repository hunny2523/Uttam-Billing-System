import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBills } from "../services/bill.service";
import { toast } from "react-toastify";
import {
  generatePrinterData,
  printWithRawBT,
  printWithBrowserDialog,
} from "../utils/printer";

export default function SearchPage() {
  const [billNumber, setBillNumber] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchParams, setSearchParams] = useState(null);

  const {
    data: response,
    isLoading,
    isPreviousData,
  } = useQuery({
    queryKey: ["bills", searchParams],
    queryFn: async () => {
      if (!searchParams) return { bills: [] };
      const result = await getBills(searchParams);
      return result;
    },
    enabled: searchParams !== null,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  const results = response?.bills || [];

  const handleSearch = () => {
    const params = {};
    let hasFilter = false;

    // Build params object with all provided filters
    if (billNumber.trim()) {
      params.billNumber = parseInt(billNumber.trim(), 10);
      hasFilter = true;
    }

    if (phoneNumber.trim()) {
      params.phoneNumber = phoneNumber.trim();
      hasFilter = true;
    }

    if (selectedDate) {
      const selected = new Date(selectedDate);
      const start = new Date(selected.setHours(0, 0, 0, 0));
      const end = new Date(selected.setHours(23, 59, 59, 999));
      params.startDate = start.toISOString();
      params.endDate = end.toISOString();
      hasFilter = true;
    }

    if (hasFilter) {
      setSearchParams(params);
    } else {
      toast.error("Please enter at least one search criteria");
    }
  };

  // Print with Thermal Printer (RawBT)
  const handleThermalPrint = (bill) => {
    try {
      const encodedData = generatePrinterData({
        items: bill.items || [],
        total: bill.total,
        billNumber: bill.billNumber,
        customerName: bill.customerName,
        phoneNumber: bill.phoneNumber,
      });
      printWithRawBT(encodedData);
      toast.success("Sent to thermal printer!");
    } catch (error) {
      console.error("Print error:", error);
      toast.error("Failed to print");
    }
  };

  // Print with POS Printer (Browser Dialog)
  const handlePOSPrint = (bill) => {
    try {
      printWithBrowserDialog({
        items: bill.items || [],
        total: bill.total,
        billNumber: bill.billNumber,
        customerName: bill.customerName,
        phoneNumber: bill.phoneNumber,
      });
    } catch (error) {
      console.error("POS Print error:", error);
      toast.error("Failed to open print dialog");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Search Bills</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Bill Number</label>
        <input
          type="text"
          value={billNumber}
          onChange={(e) => setBillNumber(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Enter bill number"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Phone Number</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Enter phone number"
        />
      </div>

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading ? "Searching..." : "Search"}
      </button>

      {/* Show Results */}
      <div className="mt-6">
        {results.length > 0 ? (
          <div>
            <h3 className="text-lg font-semibold mb-2">Results:</h3>
            {results.map((bill) => (
              <div
                key={bill.id}
                className="border p-4 mb-4 rounded bg-gray-50 shadow-sm"
              >
                <div className="mb-2">
                  <p>
                    <strong>📄 Bill No:</strong> {bill.billNumber}
                  </p>
                  <p>
                    <strong>🧑 Customer:</strong> {bill.customerName || "N/A"}
                  </p>
                  <p>
                    <strong>📞 Phone:</strong> {bill.phoneNumber || "N/A"}
                  </p>
                  <p>
                    <strong>📅 Date:</strong>{" "}
                    {new Date(bill.timestamp).toLocaleString()}
                  </p>
                  <p>
                    <strong>💰 Total:</strong> ₹{bill.total}
                  </p>
                </div>

                <div className="mt-2">
                  <strong>🛒 Items:</strong>
                  <table className="w-full text-sm mt-2 border border-collapse">
                    <thead>
                      <tr className="bg-gray-200 text-left">
                        <th className="border px-2 py-1">#</th>
                        <th className="border px-2 py-1">Name</th>
                        <th className="border px-2 py-1">Price</th>
                        <th className="border px-2 py-1">Weight</th>
                        <th className="border px-2 py-1">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bill.items?.map((item, index) => (
                        <tr key={index}>
                          <td className="border px-2 py-1">{index + 1}</td>
                          <td className="border px-2 py-1">{item.name}</td>
                          <td className="border px-2 py-1">₹{item.price}</td>
                          <td className="border px-2 py-1">{item.weight} Kg</td>
                          <td className="border px-2 py-1">₹{item.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Print Buttons */}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleThermalPrint(bill)}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                  >
                    🖨️ Thermal Printer
                  </button>
                  <button
                    onClick={() => handlePOSPrint(bill)}
                    className="flex-1 px-3 py-2 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition"
                  >
                    🖨️ POS Printer 2
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : isLoading ? (
          <p className="mt-4 text-gray-500">Searching...</p>
        ) : (
          <p className="mt-4 text-gray-500">No results yet</p>
        )}
      </div>
    </div>
  );
}
