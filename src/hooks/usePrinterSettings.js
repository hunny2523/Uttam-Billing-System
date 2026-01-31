import { useState, useEffect } from 'react';

const PRINTER_TYPES = {
    POS: 'pos',
    THERMAL: 'thermal'
};

export const usePrinterSettings = () => {
    // Detect if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Set default printer based on device type
    const defaultPrinter = isMobile ? PRINTER_TYPES.THERMAL : PRINTER_TYPES.POS;

    const [printerType, setPrinterType] = useState(defaultPrinter);

    useEffect(() => {
        // Load saved printer preference, or use device-specific default
        const savedPrinter = localStorage.getItem('printerType') || defaultPrinter;
        setPrinterType(savedPrinter);

        // Listen for storage changes (if updated in another tab/component)
        const handleStorageChange = (e) => {
            if (e.key === 'printerType') {
                setPrinterType(e.newValue || defaultPrinter);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [defaultPrinter]);

    return {
        printerType,
        isPOSPrinter: printerType === PRINTER_TYPES.POS,
        isThermalPrinter: printerType === PRINTER_TYPES.THERMAL
    };
};

export { PRINTER_TYPES };
