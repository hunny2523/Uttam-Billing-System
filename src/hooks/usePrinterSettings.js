import { useState, useEffect } from 'react';

const PRINTER_TYPES = {
    POS: 'pos',
    THERMAL: 'thermal'
};

export const usePrinterSettings = () => {
    const [printerType, setPrinterType] = useState(PRINTER_TYPES.POS);

    useEffect(() => {
        // Load saved printer preference
        const savedPrinter = localStorage.getItem('printerType') || PRINTER_TYPES.POS;
        setPrinterType(savedPrinter);

        // Listen for storage changes (if updated in another tab/component)
        const handleStorageChange = (e) => {
            if (e.key === 'printerType') {
                setPrinterType(e.newValue || PRINTER_TYPES.POS);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return {
        printerType,
        isPOSPrinter: printerType === PRINTER_TYPES.POS,
        isThermalPrinter: printerType === PRINTER_TYPES.THERMAL
    };
};

export { PRINTER_TYPES };
