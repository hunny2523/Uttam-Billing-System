export const sendWhatsApp = (items) => {
    if (items.length === 0) return;

    let message = "🧾 *Your Bill* \n";
    items.forEach((item, index) => {
        message += `${index + 1}. ₹${item.price} x ${item.weight} Kg = ₹${item.total.toFixed(2)}\n`;
    });
    message += `\n💰 *Total: ₹${finalTotal.toFixed(2)}*`;

    const phoneNumber = "91XXXXXXXXXX"; // Replace with customer number
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
};
