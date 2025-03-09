import { useState, useRef } from "react";
import { Card, CardContent } from "./Card";
import { Input } from "./Input";
import { Button } from "./Button";
import { useEffect } from "react";
import { db } from "../../firebaseconfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function Billing() {
  const [items, setItems] = useState([]);
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [deviceName, setDeviceName] = useState("");

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
    setItems([...items, { price, weight, total }]);
    setPrice("");
    setWeight("");
    setErrors({});

    // Auto-focus back to price input
    if (priceRef.current) {
      priceRef.current.focus();
    }
  };

  const finalTotal = items.reduce((sum, item) => sum + item.total, 0);

  const sendWhatsApp = async () => {
    if (!validatePhoneNumber() || items.length === 0) return;

    let message = "🧾 *Your Bill* \n";
    items.forEach((item, index) => {
      message += `${index + 1}. ₹${item.price} x ${
        item.weight
      } Kg = ₹${item.total.toFixed(2)}\n`;
    });
    message += `\n💰 *Total: ₹${finalTotal.toFixed(2)}*`;

    const whatsappURL = `https://wa.me/+91${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappURL, "_blank");
    await saveBillToDB();
  };

  const clearBill = () => {
    setItems([]);
    setPrice("");
    setWeight("");
    setPhoneNumber("");
    setErrors({});
  };

  const colRef = collection(db, "bills");

  useEffect(() => {
    const getBills = async () => {
      const data = await getDocs(colRef);
      console.log(data);
    };
    getBills();
  }, []);

  const saveBillToDB = async () => {
    if (items.length === 0) return;

    try {
      const billData = {
        items,
        total: finalTotal,
        phoneNumber,
        deviceName,
        timestamp: new Date(),
      };
      const colRef = collection(db, "bills");
      const docRef = await addDoc(colRef, billData);
      alert("Bill saved successfully!");
    } catch (error) {
      console.error("Error saving bill:", error);
    }
  };

  const printReceipt = async () => {
    if (items.length === 0) return;
    window.print();
    await saveBillToDB();
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-6 px-2">
      <Card className="w-full max-w-md p-6 bg-white shadow-lg rounded-2xl">
        <h2 className="text-xl font-bold text-center mb-4">Uttam Masala</h2>
        <div className="flex gap-2 mb-4">
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
              <span>
                {item.price} x {item.weight} Kg
              </span>
              <span className="font-bold">₹{item.total.toFixed(2)}</span>
            </CardContent>
          ))}
        </div>
        <div className="text-lg font-bold text-center mt-4">
          Final Total: ₹{finalTotal.toFixed(2)}
        </div>

        <div className="flex flex-col my-4">
          <Input
            type="number"
            placeholder="Customer Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
          )}
        </div>
        <Button
          className="mt-2 w-full bg-green-600 hover:bg-green-700"
          onClick={sendWhatsApp}
          disabled={!phoneNumber || phoneNumber.length !== 10}
        >
          Send via WhatsApp
        </Button>
        <Button
          className="mt-4 w-full"
          onClick={printReceipt}
          disabled={items.length === 0}
        >
          Print Bill
        </Button>
        <Button
          className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white"
          onClick={clearBill}
        >
          Clear Bill
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
