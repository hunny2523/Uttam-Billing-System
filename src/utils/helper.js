import { BUSINESS_CONFIG } from '../config/business';

/**
 * Creates a beautifully formatted WhatsApp message template for bills
 * @param {Object} params - The message parameters
 * @param {Array} params.items - Array of bill items
 * @param {number} params.total - Total amount
 * @param {string} params.billNumber - Bill number
 * @param {string} params.customerName - Customer name (optional)
 * @returns {string} Formatted WhatsApp message
 */
export const createSimpleWhatsAppBillMessage = ({
    items,
    total,
    billNumber,
    customerName
}) => {
    const lines = [];

    // Business Name
    lines.push(`*${BUSINESS_CONFIG.fullName}*`);
    lines.push(`${BUSINESS_CONFIG.address}`);
    lines.push(`📞 ${BUSINESS_CONFIG.phone}`);
    lines.push('');

    lines.push('----------------------------');
    lines.push('');

    if (customerName) {
        lines.push(`👤 Customer: *${customerName}*`);
        lines.push('');
    }

    lines.push(`🧾 Bill No: *${billNumber}*`);
    lines.push('');
    lines.push('*Items:*');
    lines.push('');

    items.forEach((item, index) => {
        const itemName = item.name || item.labelEnglish || '-';
        const weight = item.weight || 0;
        const price = item.price || 0;
        const itemTotal = item.total || 0;

        lines.push(
            `${index + 1}. ${itemName} - ${weight}kg × ₹${price} = ₹${itemTotal.toFixed(2)}`
        );
    });

    lines.push('');
    lines.push('----------------------------');
    lines.push('');
    lines.push(`💰 *Total: ₹${total.toFixed(2)}*`);
    lines.push('');
    lines.push('🙏 Thank you for your business!');
    lines.push('CP Spices 🌶️');

    return lines.join('\n');
};

/**
 * Legacy sendWhatsApp function (kept for compatibility)
 * @deprecated Use createWhatsAppBillMessage instead
 */
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
