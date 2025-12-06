import { Button } from "./Button";
import CloseIcon from "../icons/CloseIcon";

export default function BillDetailsModal({ bill, onClose }) {
  if (!bill) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold">Bill Details #{bill.billNumber}</h3>
          <button
            onClick={onClose}
            className="hover:bg-blue-500 p-2 rounded transition"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Bill Info */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Customer Name</p>
              <p className="text-lg font-semibold text-gray-900">
                {bill.customerName || "—"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Phone Number</p>
              <p className="text-lg font-semibold text-gray-900">
                {bill.phoneNumber || "—"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Date & Time</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(bill.timestamp).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{bill.total.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-4">
            <h4 className="text-lg font-bold mb-3 text-gray-900">
              Items ({bill.items?.length || 0})
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-700">
                      #
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-700">
                      Item Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right font-bold text-gray-700">
                      Price/Kg
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right font-bold text-gray-700">
                      Weight (Kg)
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right font-bold text-gray-700">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bill.items?.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-900 font-medium">
                        {item.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right text-gray-700">
                        ₹{parseFloat(item.price).toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right text-gray-700">
                        {parseFloat(item.weight).toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right font-bold text-green-600">
                        ₹{parseFloat(item.total).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-bold">
                    <td
                      colSpan="4"
                      className="border border-gray-300 px-4 py-3 text-right text-gray-900"
                    >
                      Grand Total:
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right text-green-600 text-lg">
                      ₹{bill.total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end mt-6">
            <Button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
