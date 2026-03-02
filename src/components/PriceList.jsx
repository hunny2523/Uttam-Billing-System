import { useEffect, useState } from "react";
import { BUSINESS_CONFIG } from "../config/business";

export default function PriceList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiBaseUrl}/items/public`);

      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }

      const data = await response.json();
      setItems(data.items || []);
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("Unable to load price list. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || "Other";
    if (!acc[category]) {
      acc[category] = {
        categoryEnglish: category,
        categoryGujarati: item.categoryGujarati || "અન્ય",
        items: [],
      };
    }
    acc[category].items.push(item);
    return acc;
  }, {});

  // Convert to array and sort by category name
  const categories = Object.values(groupedItems);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading price list...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-t-4 border-red-600">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-red-700 mb-2">
            {BUSINESS_CONFIG.name}
          </h1>
          <div className="text-center text-gray-700 space-y-1">
            <p className="text-sm md:text-base">{BUSINESS_CONFIG.address}</p>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <p className="text-sm md:text-base font-semibold">
                Dilip Patel:{" "}
                <span className="text-blue-600">{BUSINESS_CONFIG.phone}</span>
              </p>
              <p className="text-sm md:text-base font-semibold">
                Asha Patel: <span className="text-blue-600">9409408456</span>
              </p>
            </div>
          </div>
        </div>

        {/* Price List Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center">
              Price List
            </h2>
          </div>

          <div className="p-4 md:p-6 space-y-6">
            {categories.map((category, idx) => (
              <div
                key={idx}
                className="border-b border-gray-200 last:border-0 pb-6 last:pb-0"
              >
                {/* Category Header */}
                <div className="bg-gradient-to-r from-orange-100 to-red-50 px-4 py-2 mb-3 rounded-lg border-l-4 border-red-600">
                  <h3 className="text-lg md:text-xl font-bold text-red-800">
                    {category.categoryEnglish}
                  </h3>
                  <p className="text-sm md:text-base text-gray-700">
                    {category.categoryGujarati}
                  </p>
                </div>

                {/* Items in Two Columns */}
                <div className="grid md:grid-cols-2 gap-x-4 gap-y-1">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2 border-b border-gray-100 hover:bg-orange-50 px-2 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 text-sm md:text-base">
                          {item.labelEnglish}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600">
                          {item.labelGujarati}
                        </div>
                      </div>
                      <div className="font-bold text-red-700 text-base md:text-lg ml-4 whitespace-nowrap">
                        ₹{item.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 py-3 px-6 text-center text-sm text-gray-600 border-t">
            <p>Prices are subject to change without notice</p>
          </div>
        </div>

        {/* Print Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => window.print()}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors print:hidden"
          >
            🖨️ Print Price List
          </button>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
