import { BUSINESS_CONFIG } from '../config/business';

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
    data += `${BUSINESS_CONFIG.name}\n\n`;

    // Address and phone number
    data += "\x1B\x21\x01"; // Small bold text
    data += `${BUSINESS_CONFIG.address}\n`;
    data += `${BUSINESS_CONFIG.phone}\n`;

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

/**
 * Generate ESC/POS commands for Posiflex PP7600 POS printer
 * @param {Object} config - Configuration object
 * @param {Array} config.items - Items in the bill
 * @param {number} config.total - Total amount
 * @param {string} config.billNumber - Bill number
 * @param {string} config.customerName - Customer name
 * @param {string} config.phoneNumber - Phone number
 * @returns {Uint8Array} ESC/POS command bytes
 */
export const generatePOSPrinterData = ({
    items,
    total,
    billNumber = "N/A",
    customerName = "",
    phoneNumber = "",
}) => {
    const ESC = 0x1B;
    const GS = 0x1D;

    const commands = [];

    // Initialize printer
    commands.push(ESC, 0x40);

    // Center align
    commands.push(ESC, 0x61, 0x01);

    // Bold & double size for business name
    commands.push(ESC, 0x21, 0x30);
    commands.push(...textToBytes(`${BUSINESS_CONFIG.name}\n\n`));

    // Reset to normal, center
    commands.push(ESC, 0x21, 0x00);
    commands.push(...textToBytes(`${BUSINESS_CONFIG.address}\n`));
    commands.push(...textToBytes(`${BUSINESS_CONFIG.phone}\n`));
    commands.push(...textToBytes(`${BUSINESS_CONFIG.website}\n\n`));

    // Line separator
    commands.push(...textToBytes("".padEnd(42, "-") + "\n"));

    // Left align for bill details
    commands.push(ESC, 0x61, 0x00);
    commands.push(ESC, 0x21, 0x08); // Bold
    commands.push(...textToBytes(`Bill No: ${billNumber}\n`));
    commands.push(ESC, 0x21, 0x00); // Normal
    commands.push(...textToBytes(`Date: ${new Date().toLocaleString('en-IN')}\n`));

    if (customerName) {
        commands.push(...textToBytes(`Customer: ${customerName}\n`));
    }
    if (phoneNumber) {
        commands.push(...textToBytes(`Phone: ${phoneNumber}\n`));
    }

    commands.push(...textToBytes("".padEnd(42, "-") + "\n"));

    // Items header
    commands.push(ESC, 0x21, 0x08); // Bold
    commands.push(...textToBytes("Item          Price  Qty     Amount\n"));
    commands.push(ESC, 0x21, 0x00); // Normal
    commands.push(...textToBytes("".padEnd(42, "-") + "\n"));

    // Print items
    items.forEach((item) => {
        const name = item.name.length > 12 ? item.name.slice(0, 12) : item.name.padEnd(12);
        const price = `₹${item.price}`.padStart(6);
        const qty = `${item.weight}Kg`.padStart(6);
        const amount = `₹${item.total.toFixed(2)}`.padStart(8);

        commands.push(...textToBytes(`${name} ${price} ${qty} ${amount}\n`));
    });

    commands.push(...textToBytes("".padEnd(42, "-") + "\n"));

    // Total - Bold & larger
    commands.push(ESC, 0x21, 0x18); // Bold & double height
    commands.push(ESC, 0x61, 0x02); // Right align
    commands.push(...textToBytes(`TOTAL: ₹${total.toFixed(2)}\n`));
    commands.push(ESC, 0x21, 0x00); // Reset

    commands.push(ESC, 0x61, 0x01); // Center
    commands.push(...textToBytes("".padEnd(42, "-") + "\n"));
    commands.push(...textToBytes("Thank You! Visit Again\n"));
    commands.push(...textToBytes(`${BUSINESS_CONFIG.name}\n\n\n`));

    // Cut paper (partial cut)
    commands.push(GS, 0x56, 0x01);

    return new Uint8Array(commands);
};

/**
 * Convert text string to byte array
 * @param {string} text - Text to convert
 * @returns {Array} Byte array
 */
function textToBytes(text) {
    const encoder = new TextEncoder();
    return Array.from(encoder.encode(text));
}

/**
 * Print to Posiflex PP7600 via Web Bluetooth or USB
 * @param {Uint8Array} data - ESC/POS command bytes
 */
export const printWithPOSPrinter = async (data) => {
    try {
        // Check if Web Bluetooth is available
        if (!navigator.bluetooth) {
            // Fallback to creating a download link for USB printing
            const blob = new Blob([data], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'print-job.prn';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            throw new Error('Web Bluetooth not supported. Print file downloaded. Send to printer via USB.');
        }

        // Request Bluetooth device
        const device = await navigator.bluetooth.requestDevice({
            filters: [
                { services: ['000018f0-0000-1000-8000-00805f9b34fb'] }, // Bluetooth printer service
            ],
            optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb']
        });

        const server = await device.gatt.connect();
        const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
        const characteristic = await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');

        // Send data in chunks (max 512 bytes per write for some devices)
        const chunkSize = 512;
        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            await characteristic.writeValue(chunk);
        }

        return { success: true, message: 'Printed successfully!' };
    } catch (error) {
        console.error('POS Print Error:', error);
        throw error;
    }
};
