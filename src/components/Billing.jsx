import { useState } from "react";
import { Card, CardContent } from "./Card";
import { Input } from "./Input";
import { Button } from "./Button";

export default function Billing() {
  const [items, setItems] = useState([]);
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const addItem = () => {
    if (!price || !weight) return;
    const total = parseFloat(price) * parseFloat(weight);
    setItems([...items, { price, weight, total }]);
    setPrice("");
    setWeight("");
  };

  const finalTotal = items.reduce((sum, item) => sum + item.total, 0);

  const sendWhatsApp = () => {
    if (!phoneNumber || items.length === 0) return;

    let message = "🧾 *Your Bill* \n";
    items.forEach((item, index) => {
      message += `${index + 1}. ₹${item.price} x ${
        item.weight
      } Kg = ₹${item.total.toFixed(2)}\n`;
    });
    message += `\n💰 *Total: ₹${finalTotal.toFixed(2)}*`;

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-md p-6 bg-white shadow-lg rounded-2xl">
        <h2 className="text-xl font-bold text-center mb-4">Billing App</h2>
        <div className="flex gap-2 mb-4">
          <Input
            type="number"
            placeholder="Price per Kg"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Weight (Kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <Button onClick={addItem}>Add</Button>
        </div>
        <Input
          type="text"
          placeholder="Customer Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="mb-4"
        />
        <div>
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
        <Button className="mt-4 w-full" onClick={() => window.print()}>
          Print Bill
        </Button>
        <Button
          className="mt-2 w-full bg-green-600 hover:bg-green-700"
          onClick={sendWhatsApp}
        >
          Send via WhatsApp
        </Button>
      </Card>
    </div>
  );
}
