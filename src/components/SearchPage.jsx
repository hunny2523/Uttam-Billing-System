import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function SearchPage() {
  const [billNumber, setBillNumber] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setResults([]);

    try {
      const billsRef = collection(db, "bills");
      let q;

      if (billNumber.trim()) {
        // Convert to number, since Firestore stores billNumber as a number
        const billNum = parseInt(billNumber.trim(), 10);
        q = query(billsRef, where("billNumber", "==", billNum));
      } else if (selectedDate) {
        // Convert selected date to a range using Timestamps
        const selected = new Date(selectedDate);
        const start = new Date(selected.setHours(0, 0, 0, 0));
        const end = new Date(selected.setHours(23, 59, 59, 999));

        q = query(
          billsRef,
          where("date", ">=", Timestamp.fromDate(start)),
          where("date", "<=", Timestamp.fromDate(end))
        );
      } else {
        alert("Please enter a bill number or select a date");
        return;
      }

      const querySnapshot = await getDocs(q);
      const bills = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResults(bills);
    } catch (err) {
      console.error("Error searching bills:", err);
      alert("Error fetching data");
    } finally {
      setLoading(false);
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

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
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
                    {bill.timeStamp?.toDate().toLocaleString()}
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
              </div>
            ))}
          </div>
        ) : loading ? null : (
          <p className="mt-4 text-gray-500">No results yet</p>
        )}
      </div>
    </div>
  );
}
