import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BUSINESS_CONFIG } from "./config/business.js";

// Update document title dynamically
document.title = `${BUSINESS_CONFIG.fullName} - Price List`;

// Update meta tags dynamically
const updateMetaTags = () => {
  const appUrl = window.location.origin;
  const title = `${BUSINESS_CONFIG.fullName} - Price List`;
  const description = `Browse our complete product catalog and current prices - ${BUSINESS_CONFIG.fullName}`;

  // Update basic meta description
  let metaDesc = document.querySelector("meta[name='description']");
  if (metaDesc) {
    metaDesc.setAttribute("content", description);
  }

  // Update apple mobile web app title
  let appleTitle = document.querySelector(
    "meta[name='apple-mobile-web-app-title']",
  );
  if (appleTitle) {
    appleTitle.setAttribute("content", BUSINESS_CONFIG.fullName);
  }

  // Update Open Graph tags
  const ogTags = [
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: appUrl },
  ];

  ogTags.forEach(({ property, content }) => {
    let tag = document.querySelector(`meta[property='${property}']`);
    if (tag) {
      tag.setAttribute("content", content);
    }
  });

  // Update Twitter tags
  const twitterTags = [
    { property: "twitter:title", content: title },
    { property: "twitter:description", content: description },
    { property: "twitter:url", content: appUrl },
  ];

  twitterTags.forEach(({ property, content }) => {
    let tag = document.querySelector(`meta[property='${property}']`);
    if (tag) {
      tag.setAttribute("content", content);
    }
  });
};

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

  // Update og:image and twitter:image
  const updateImageTag = (selector) => {
    let tag = document.querySelector(selector);
    if (tag) {
      tag.setAttribute("content", `${window.location.origin}${iconPath}`);
    }
  };

  updateImageTag("meta[property='og:image']");
  updateImageTag("meta[property='twitter:image']");
};

updateMetaTags();
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
