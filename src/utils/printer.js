/**
 * Utility function to generate printer commands for thermal printer
 * @param {Object} config - Configuration object
 * @param {Array} config.items - Items in the bill
 * @param {number} config.total - Total amount
 * @param {string} config.billNumber - Bill number
 * @param {string} config.customerName - Customer name
 * @param {string} config.phoneNumber - Phone number
 * @returns {string} Encoded printer data for RawBT
 */
export const generatePrinterData = ({
    items,
    total,
    billNumber = "N/A",
    customerName = "",
    phoneNumber = "",
}) => {
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
        let itemTotal = `₹${item.total.toFixed(2)}`.padStart(6) + "    ";

        data += `${indexNo} ${" "} ${name} ${price} x ${qty} = ${itemTotal}\n`;
        data += "\x1B\x21\x01\n";
        data += "\x1B\x21\x00";
    });

    data += "\x1B\x61\x01"; // Center align
    data += "\x1B\x21\x00";
    data += "------------------------------\n";
    data += "\x1B\x21\x10"; // Bold & double-size
    data += `Total: ₹${total.toFixed(2)}\n`;
    data += "\x1B\x21\x00"; // Reset font
    data += "------------------------------\n";
    data += "Thank You! 😊\n";
    data += "------------------------------\n\n";

    // Encode for RawBT
    return encodeURIComponent(data);
};

/**
 * Send print command to RawBT thermal printer
 * @param {string} encodedData - Encoded printer data
 */
export const printWithRawBT = (encodedData) => {
    window.location.href = `intent:${encodedData}#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end;`;
};
