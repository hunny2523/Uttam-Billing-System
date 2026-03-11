import { useEffect, useState, useCallback } from "react";
import { BUSINESS_CONFIG } from "../config/business";
import { getColorScheme } from "../utils/colors";

export default function PriceList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get color scheme based on theme color
  const colors = getColorScheme(BUSINESS_CONFIG.themeColor);

  // Determine logo based on business name
  const businessLogo = BUSINESS_CONFIG.name?.toLowerCase().includes("cp spices")
    ? "/cp-spices.png"
    : "/uttam-masala.png";

  const fetchItems = useCallback(async () => {
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
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Refetch when page becomes visible (user switches back to tab or navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchItems();
      }
    };

    // Refetch when page gains focus
    const handleFocus = () => {
      fetchItems();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchItems]);

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
    <div
      className={`min-h-screen bg-gradient-to-br ${colors.bgGradient} py-4 md:py-8 px-3 md:px-6`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Elegant Header Section */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6 md:mb-8">
          {/* Header Top with Gradient */}
          <div
            className={`bg-gradient-to-r ${colors.gradient} px-6 py-4 md:py-6 text-white relative overflow-hidden`}
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>

            <div className="relative z-10">
              {/* Business Logo and Name in Row */}
              <div className="flex items-center justify-center gap-3 md:gap-4 mb-3">
                <img
                  src={businessLogo}
                  alt={BUSINESS_CONFIG.name}
                  className="h-12 w-12 md:h-16 md:w-16 object-contain rounded-lg bg-white/10 p-2 backdrop-blur-sm shadow-lg flex-shrink-0"
                />
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                  {BUSINESS_CONFIG.name}
                </h1>
              </div>

              <div className="flex items-center justify-center text-white/90">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-sm md:text-base text-center">
                  {BUSINESS_CONFIG.address}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information Cards */}
          <div className="px-4 md:px-6 py-5 md:py-6 bg-gradient-to-b from-gray-50 to-white">
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {(BUSINESS_CONFIG.contacts || []).map((contact, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 px-4 md:px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 border ${colors.border} border-opacity-20`}
                >
                  <div className="text-left flex-1">
                    <p className="text-xs text-gray-500 font-medium">
                      {contact.name}
                    </p>
                    <p
                      className={`text-sm md:text-base font-bold ${colors.text}`}
                    >
                      {contact.phone}
                    </p>
                  </div>

                  {/* Call Button */}
                  <a
                    href={`tel:${contact.phone}`}
                    className={`p-2 ${colors.categoryBg} bg-gradient-to-r rounded-lg hover:opacity-80 transition-opacity`}
                    title="Call"
                  >
                    <svg
                      className={`w-4 h-4 ${colors.text}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </a>

                  {/* WhatsApp Button */}
                  <a
                    href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi, I would like to inquire about your products.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                    title="WhatsApp"
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Price List Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div
            className={`bg-gradient-to-r ${colors.gradient} text-white py-4 px-6`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center">
              Price List (per kg)
            </h2>
          </div>

          <div className="p-4 md:p-6 space-y-6">
            {categories.map((category, idx) => (
              <div
                key={idx}
                className="border-b border-gray-200 last:border-0 pb-6 last:pb-0"
              >
                {/* Category Header */}
                <div
                  className={`bg-gradient-to-r ${colors.categoryBg} px-4 py-2 mb-3 rounded-lg border-l-4 ${colors.border}`}
                >
                  <h3
                    className={`text-lg md:text-xl font-bold ${colors.darkText}`}
                  >
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
                      className={`flex justify-between items-center py-2 border-b border-gray-100 ${colors.hover} px-2 transition-colors`}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 text-sm md:text-base">
                          {item.labelEnglish}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600">
                          {item.labelGujarati}
                        </div>
                      </div>
                      <div
                        className={`font-bold ${colors.text} text-base md:text-lg ml-4 whitespace-nowrap`}
                      >
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
        <div className="mt-6 text-center print:hidden">
          <button
            onClick={() => window.print()}
            className={`${colors.button} text-white font-semibold py-3 md:py-4 px-8 md:px-10 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 mx-auto text-sm md:text-base`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print Price List
          </button>
        </div>
      </div>

      {/* Enhanced Print Styles */}
      <style>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          /* Optimize for print */
          .shadow-lg, .shadow-xl, .shadow-2xl {
            box-shadow: none !important;
          }
        }
        
        /* Smooth scrolling for mobile */
        @media (max-width: 768px) {
          html {
            scroll-behavior: smooth;
          }
        }
      `}</style>
    </div>
  );
}
