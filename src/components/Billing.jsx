import { useState, useRef } from "react";
import { Card, CardContent } from "./Card";
import { Input } from "./Input";
import { Button } from "./Button";
import { useEffect } from "react";
import { createBill, getNextBillNumber } from "../services/bill.service";
import { toast } from "react-toastify";
import CloseIcon from "../icons/CloseIcon";
import Search from "./Search";

export default function Billing() {
  const [items, setItems] = useState([]);
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [errors, setErrors] = useState({});
  const [deviceName, setDeviceName] = useState("");
  const [billNumber, setBillNumber] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);

  const printRef = useRef(null);
  const priceRef = useRef(null);

  useEffect(() => {
    const getDeviceName = () => {
      const ua = navigator.userAgent;
      if (/android/i.test(ua)) return "Android Device";
      if (/iPad|iPhone|iPod/.test(ua)) return "iOS Device";
      if (/Macintosh|MacIntel|MacPPC|Mac68K/.test(ua)) return "Mac";
      if (/Win/.test(ua)) return "Windows PC";
      if (/Linux/.test(ua)) return "Linux Machine";
      return "Unknown Device";
    };

    setDeviceName(getDeviceName());

    // Fetch next bill number from backend
    const fetchNextBillNumber = async () => {
      try {
        const nextNumber = await getNextBillNumber();
        setBillNumber(nextNumber);
      } catch (error) {
        console.error("Error fetching bill number:", error);
        toast.error("Failed to fetch bill number");
      }
    };
    fetchNextBillNumber();
  }, []);

  const validateItemInputs = () => {
    const newErrors = {};
    if (!price || parseFloat(price) <= 0)
      newErrors.price = "Enter a valid price.";
    if (!weight || parseFloat(weight) <= 0)
      newErrors.weight = "Enter a valid weight.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePhoneNumber = () => {
    const newErrors = {};
    if (!phoneNumber.match(/^\d{10}$/))
      newErrors.phoneNumber = "Enter a valid 10-digit phone number.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addItem = () => {
    if (!validateItemInputs()) return;
    if (!price || !weight) return;
    const total = parseFloat(price) * parseFloat(weight);
    setItems([
      ...items,
      { name: selectedItem?.label ?? "", price, weight, total },
    ]);
    setPrice("");
    setWeight("");
    setErrors({});
    setSelectedItem(null);

    // Auto-focus back to price input
    if (priceRef.current) {
      priceRef.current.focus();
    }
  };

  const finalTotal = items.reduce((sum, item) => sum + item.total, 0);

  const clearBill = () => {
    setItems([]);
    setPrice("");
    setWeight("");
    setPhoneNumber("");
    setCustomerName("");
    setErrors({});
  };

  // Main function that handles: Save → Print → WhatsApp (if phone provided)
  const handleSaveBill = async () => {
    // Validate before proceeding
    if (items.length === 0) {
      toast.error("Please add items to the bill");
      return;
    }

    // Validate phone number only if provided
    if (phoneNumber && !validatePhoneNumber()) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      // Step 1: Save bill to database
      const billData = {
        billNumber,
        items,
        total: finalTotal,
        phoneNumber: phoneNumber || null,
        customerName: customerName || null,
        timestamp: new Date().toISOString(),
      };

      const response = await createBill(billData);
      toast.success("Bill saved successfully!");

      // Step 2: Open WhatsApp FIRST (before print redirect)
      // This ensures WhatsApp opens even if print redirects
      const shouldSendWhatsApp = phoneNumber && phoneNumber.length === 10;
      if (shouldSendWhatsApp) {
        try {
          openWhatsApp();
        } catch (whatsappError) {
          console.error("WhatsApp error:", whatsappError);
          // No toast needed - WhatsApp is optional
        }
      }

      // Step 3: Get next bill number from response
      if (response && response.bill) {
        const nextNumber = response.bill.billNumber + 1;
        setBillNumber(nextNumber);
      }

      // Clear form
      clearBill();

      // Step 4: Print receipt via RawBT (LAST - because it redirects)
      // Small delay to allow WhatsApp to open first
      setTimeout(() => {
        try {
          printReceipt();
        } catch (printError) {
          console.error("Print error:", printError);
          toast.warning("Bill saved but print failed. Check RawBT connection.");
        }
      }, 300);
    } catch (error) {
      console.error("Error saving bill:", error);
      // Error toast is already shown by interceptor
    }
  };

  // Print receipt function
  const printReceipt = () => {
    let data = "\x1B\x40"; // Initialize printer
    data += "\x1B\x61\x01"; // Center align
    data += "\x1B\x21\x10"; // Bold, double-size
    data += "Uttam Masala\n\n";

    // Address and phone number
    data += "\x1B\x21\x01"; // Small bold text
    data += "Ahmedabad-Kalol Highway\n";
    data += "Shertha, Gandhinagar-382423\n";
    data += "M-98980 70258\n";

    data += "------------------------------\n";
    data += "\x1B\x21\x08"; // Slightly larger bold text
    data += `Bill No. ${billNumber} \n`;
    data += "\x1B\x21\x00";
    data += "------------------------------\n";
    data += `Date: ${new Date().toLocaleString()}\n`;
    data += "------------------------------\n";
    if (customerName) {
      data += `Name: ${customerName}\n`;
    }
    if (phoneNumber) {
      data += `Phone: ${phoneNumber}\n`;
    }
    if (customerName || phoneNumber) {
      data += "------------------------------\n";
    }

    data += "\x1B\x21\x08"; // Bold text for items
    data += "Items:\n\n";
    data += "\x1B\x21\x00"; // Reset text

    // Print each item
    items.forEach((item, index) => {
      let indexNo = `${index + 1}.`.padEnd(3);
      let name =
        item.name.length > 11
          ? item.name.slice(0, 11) + "."
          : item.name.padEnd(12);
      let price = `₹${item.price}`.padStart(4);
      let qty = `${item.weight} Kg`.padStart(7);
      let total = `₹${item.total.toFixed(2)}`.padStart(6) + "    ";

      data += `${indexNo} ${" "} ${name} ${price} x ${qty} = ${total}\n`;
      data += "\x1B\x21\x01\n";
      data += "\x1B\x21\x00";
    });

    data += "\x1B\x61\x01"; // Center align
    data += "\x1B\x21\x00";
    data += "------------------------------\n";
    data += "\x1B\x21\x10"; // Bold & double-size
    data += `Total: ₹${finalTotal.toFixed(2)}\n`;
    data += "\x1B\x21\x00"; // Reset font
    data += "------------------------------\n";
    data += "Thank You! 😊\n";
    data += "------------------------------\n\n";

    // Encode for RawBT
    let encodedData = encodeURIComponent(data);
    window.location.href = `intent:${encodedData}#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end;`;
  };

  // Open WhatsApp with bill details
  const openWhatsApp = () => {
    let message = `🧾 *Bill No: ${billNumber}*\n`;
    message += `📅 Date: ${new Date().toLocaleString()}\n`;
    if (customerName) {
      message += `👤 Name: ${customerName}\n`;
    }
    message += `\n*Items:*\n`;

    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   ${item.weight} Kg x ₹${item.price} = ₹${item.total.toFixed(
        2
      )}\n`;
    });

    message += `\n💰 *Total: ₹${finalTotal.toFixed(2)}*\n\n`;
    message += `Thank you for your business! 🙏`;

    const whatsappURL = `https://wa.me/+91${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappURL, "_blank");
  };

  const removeItem = (indexToRemove) => {
    setItems(items.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-6 px-2">
      <Card className="w-full p-3 max-w-md  bg-white shadow-lg rounded-2xl">
        <h2 className="text-xl font-bold text-center mb-4">Uttam Masala</h2>
        <p className="text-center font-semibold">Bill No: {billNumber}</p>
        <div className="flex flex-col">
          <Search
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
        </div>
        <div className="flex gap-2 mb-4">
          <div className="flex flex-col">
            <Input
              type="number"
              placeholder="Weight (Kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            {errors.weight && (
              <p className="text-red-500 text-sm">{errors.weight}</p>
            )}
          </div>

          <div className="flex flex-col">
            <Input
              ref={priceRef}
              type="number"
              placeholder="Price per Kg"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price}</p>
            )}
          </div>

          <Button onClick={addItem} disabled={!price || !weight}>
            Add
          </Button>
        </div>

        <div className="my-4">
          {items.map((item, index) => (
            <CardContent
              key={index}
              className="flex justify-between bg-gray-50 p-2 mb-2 rounded-lg"
            >
              <span>{item.name}</span>
              <span>
                {item.price} x {item.weight} Kg
              </span>
              <span className="font-bold">₹{item.total.toFixed(2)}</span>
              <div onClick={() => removeItem(index)}>
                <CloseIcon />
              </div>
            </CardContent>
          ))}
        </div>
        <div className="text-lg font-bold text-center mt-4">
          Final Total: ₹{finalTotal.toFixed(2)}
        </div>

        <div className="flex flex-col my-4">
          <Input
            placeholder="Customer Name (Optional)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          {errors.customerName && (
            <p className="text-red-500 text-sm">{errors.customerName}</p>
          )}
        </div>
        <div className="flex flex-col my-4">
          <Input
            type="number"
            placeholder="Phone Number (Optional - for WhatsApp)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
          )}
          {phoneNumber &&
            phoneNumber.length > 0 &&
            phoneNumber.length !== 10 && (
              <p className="text-yellow-600 text-sm mt-1">
                Phone number must be 10 digits for WhatsApp
              </p>
            )}
        </div>

        {/* Main Save Bill Button - Does everything */}
        <Button
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-3"
          onClick={handleSaveBill}
          disabled={items.length === 0}
        >
          {phoneNumber && phoneNumber.length === 10
            ? "💾 Save, Print & Send WhatsApp"
            : "💾 Save & Print Bill"}
        </Button>

        {/* Clear Bill Button */}
        <Button
          className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white"
          onClick={clearBill}
        >
          🗑️ Clear Bill
        </Button>
      </Card>

      {/* Printable Receipt Layout */}
      <div
        ref={printRef}
        className="hidden print:block print:fixed print:top-0 print:left-0 print:w-full print:h-full print:bg-white"
      >
        <div className="p-4 text-sm font-mono text-black w-[58mm] mx-auto">
          <h2 className="text-center text-lg font-bold">
            🛒Uttam Masala Billing Receipt
          </h2>
          <p className="text-center">------------------------------</p>
          <p className="text-center">Date: {new Date().toLocaleString()}</p>
          <p className="text-center">------------------------------</p>
          <p>
            <strong>Items:</strong>
          </p>
          {items.map((item, index) => (
            <p key={index}>
              {index + 1}. ₹{item.price} x {item.weight} Kg = ₹
              {item.total.toFixed(2)}
            </p>
          ))}
          <p>------------------------------</p>
          <p className="text-lg font-bold">Total: ₹{finalTotal.toFixed(2)}</p>
          <p>------------------------------</p>
          <p className="text-center">Thank You! 😊</p>
          <p className="text-center">------------------------------</p>
        </div>
      </div>
    </div>
  );
}
