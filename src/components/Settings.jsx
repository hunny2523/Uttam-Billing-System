import { useState, useEffect } from "react";
import { Button } from "./Button";
import PasswordManagement from "./PasswordManagement";
import { isAdmin } from "../services/auth.service";
import { Card } from "./Card";

const PRINTER_TYPES = {
  POS: "pos",
  THERMAL: "thermal",
};

const Settings = () => {
  // Detect if device is mobile
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // Set default printer based on device type
  const defaultPrinter = isMobile ? PRINTER_TYPES.THERMAL : PRINTER_TYPES.POS;

  const [selectedPrinter, setSelectedPrinter] = useState(defaultPrinter);
  const [isSaved, setIsSaved] = useState(false);
  const userIsAdmin = isAdmin();

  useEffect(() => {
    // Load saved printer preference, or use device-specific default
    const savedPrinter = localStorage.getItem("printerType") || defaultPrinter;
    setSelectedPrinter(savedPrinter);
  }, [defaultPrinter]);

  const handleSave = () => {
    localStorage.setItem("printerType", selectedPrinter);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>

          <div className="space-y-6">
            {/* Printer Settings Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Printer Settings</h2>

              <div className="space-y-3">
                {/* POS Printer Option */}
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="printer"
                    value={PRINTER_TYPES.POS}
                    checked={selectedPrinter === PRINTER_TYPES.POS}
                    onChange={(e) => setSelectedPrinter(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="ml-3">
                    <div className="font-medium">POS Printer</div>
                    <div className="text-sm text-gray-500">
                      Use browser print dialog for POS system{" "}
                      {!isMobile && "(Default for Desktop)"}
                    </div>
                  </div>
                </label>

                {/* Thermal Printer Option */}
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="printer"
                    value={PRINTER_TYPES.THERMAL}
                    checked={selectedPrinter === PRINTER_TYPES.THERMAL}
                    onChange={(e) => setSelectedPrinter(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="ml-3">
                    <div className="font-medium">Bluetooth Thermal Printer</div>
                    <div className="text-sm text-gray-500">
                      Use RawBT mobile thermal printer{" "}
                      {isMobile && "(Default for Mobile)"}
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4">
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save Settings
              </Button>

              {isSaved && (
                <span className="text-green-600 font-medium">
                  ✓ Settings saved successfully!
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Password Management Section - Admin Only */}
      {userIsAdmin && (
        <div className="mt-6">
          <Card>
            <div className="p-6">
              <PasswordManagement />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Settings;
