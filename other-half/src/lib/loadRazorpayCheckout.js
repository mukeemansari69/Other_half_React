const RAZORPAY_SCRIPT_ID = "razorpay-checkout-script";
const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

export const loadRazorpayCheckout = () =>
  new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Razorpay checkout can only run in the browser."));
      return;
    }

    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    const existingScript = document.getElementById(RAZORPAY_SCRIPT_ID);

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.Razorpay), {
        once: true,
      });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Razorpay checkout could not be loaded.")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.id = RAZORPAY_SCRIPT_ID;
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () =>
      reject(new Error("Razorpay checkout could not be loaded."));
    document.body.appendChild(script);
  });
