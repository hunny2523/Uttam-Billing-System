import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BUSINESS_CONFIG } from "./config/business.js";

// Update document title dynamically
document.title = `${BUSINESS_CONFIG.fullName} - Billing System`;

// Update favicon and app icons based on business name
const updateFavicons = () => {
  const isCPSpices = BUSINESS_CONFIG.name?.toLowerCase().includes("cp spices");
  const iconPath = isCPSpices ? "/cp-spices.png" : "/uttam-masala.png";

  // Update regular favicon
  let favicon = document.querySelector("link[rel='icon']");
  if (favicon) {
    favicon.href = iconPath;
  } else {
    favicon = document.createElement("link");
    favicon.rel = "icon";
    favicon.href = iconPath;
    document.head.appendChild(favicon);
  }

  // Update apple-touch-icon
  let appleTouchIcon = document.querySelector("link[rel='apple-touch-icon']");
  if (appleTouchIcon) {
    appleTouchIcon.href = iconPath;
  }
};

updateFavicons();

// Register Service Worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute

        // Listen for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New service worker available
              toast.info("App update available! Please refresh.", {
                position: "top-right",
                autoClose: false,
                closeButton: true,
              });
            }
          });
        });
      })
      .catch((error) => {
        console.log("Service Worker registration failed:", error);
      });
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  </StrictMode>,
);
