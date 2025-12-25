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
 * Print to POS system via network/IP
 * @param {Object} billData - Bill data to print
 * @param {string} printerIP - IP address of POS printer (e.g., "192.168.1.100:9100")
 */
export const printToNetworkPOS = async (billData, printerIP) => {
    try {
        const posData = generatePOSPrinterData(billData);

        // Send to your print server endpoint
        const response = await fetch(`http://${printerIP}/print`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
            },
            body: posData
        });

        if (!response.ok) {
            throw new Error('Network print failed');
        }

        return { success: true };
    } catch (error) {
        console.error('Network print error:', error);
        throw error;
    }
};

/**
 * Print using browser's native print dialog (formatted for receipt printer)
 * Works with any printer connected to the POS system
 */
export const printWithBrowserDialog = (billData) => {
    const { items, total, billNumber, customerName, phoneNumber } = billData;

    // Create print window
    const printWindow = window.open('', '', 'width=700,height=600');

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Bill ${billNumber}</title>
            <style>
                @media print {
                    @page {
                        size: 76.2mm auto;
                        margin: 0;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        color-adjust: exact;
                    }
                    * {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
                body {
                    font-family: 'Courier New', monospace;
                    font-size: 8px;
                    font-weight: 600;
                    width: 58mm;
                    margin: 0;
                    padding: 0.5mm;
                    box-sizing: border-box;
                    color: #000000;
                    background: white;
                    word-wrap: break-word;
                }
                .center { 
                    text-align: center;
                    word-wrap: break-word;
                }
                .bold { 
                    font-weight: 800;
                    color: #000000;
                }
                .large { 
                    font-size: 13px;
                    font-weight: 800;
                }
                .line { 
                    border-top: 2px dashed #000; 
                    margin: 2px 0; 
                }
                .info-line {
                    margin: 2px 0;
                    word-wrap: break-word;
                    white-space: normal;
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse;
                    table-layout: fixed;
                    color: #000000;
                }
                thead td {
                    font-weight: 800;
                    padding: 2px 1px;
                }
                td { 
                    padding: 2px 1px;
                    overflow: hidden;
                    font-weight: 600;
                    color: #000000;
                    word-wrap: break-word;
                    white-space: normal;
                }
                td:nth-child(1) { width: 40%; text-align: left; } /* Item name - wider */
                td:nth-child(2) { width: 20%; text-align: center; } /* Qty */
                td:nth-child(3) { width: 20%; text-align: right; } /* Rate */
                td:nth-child(4) { width: 20%; text-align: right; } /* Amount */
                .right { text-align: right; }
                .total-row {
                    margin-top: 4px;
                    display: flex;
                    justify-content: space-between;
                    font-size: 13px;
                    font-weight: 800;
                    color: #000000;
                }
                strong {
                    font-weight: 800;
                    color: #000000;
                }
            </style>
        </head>
        <body>
            <div class="center bold large">${BUSINESS_CONFIG.name}</div>
            <div class="center">${BUSINESS_CONFIG.address}</div>
            <div class="center">${BUSINESS_CONFIG.phone}</div>
            <div class="center">${BUSINESS_CONFIG.website}</div>
            <div class="line"></div>
            
            <div class="info-line"><strong>Bill No:</strong> ${billNumber}</div>
            <div class="info-line"><strong>Date:</strong> ${new Date().toLocaleString('en-IN')}</div>
            ${customerName ? `<div class="info-line"><strong>Customer:</strong> ${customerName}</div>` : ''}
            ${phoneNumber ? `<div class="info-line"><strong>Phone:</strong> ${phoneNumber}</div>` : ''}
            <div class="line"></div>
            
            <table>
                <thead>
                    <tr>
                        <td>Item</td>
                        <td>Qty</td>
                        <td>Rate</td>
                        <td>Amt</td>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.weight}Kg</td>
                            <td>₹${item.price}</td>
                            <td>₹${item.total.toFixed(0)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="line"></div>
            
            <div class="total-row">
                <span>TOTAL:</span>
                <span>₹${total.toFixed(0)}</span>
            </div>
            <div class="line"></div>
            
            <div class="center">Thank You! Visit Again</div>
            <div class="center">${BUSINESS_CONFIG.name}</div>
            <br><br>
        </body>
        </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Auto-print when page loads
    printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        // Auto-close after printing
        setTimeout(() => {
            printWindow.close();
        }, 500);
    };
};
