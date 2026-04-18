import { BRAND_NAME, PAYMENT_PROVIDER } from "../../shared/storefrontConfig.js";
import { apiRequest } from "./api.js";
import { loadRazorpayCheckout } from "./loadRazorpayCheckout.js";

export const toCheckoutItemPayload = (item) => ({
  id: item.id,
  productId: item.productId,
  name: item.name,
  description: item.description,
  image: item.image,
  unitPrice: item.unitPrice,
  quantity: item.quantity,
  purchaseType: item.purchaseType,
  planId: item.planId,
  planLabel: item.planLabel,
  deliveryLabel: item.deliveryLabel,
  deliveryCadence: item.deliveryCadence,
  billingIntervalUnit: item.billingIntervalUnit,
  billingIntervalCount: item.billingIntervalCount,
  sizeId: item.sizeId,
  sizeLabel: item.sizeLabel,
  sizeWeight: item.sizeWeight,
});

export const startRazorpayCheckout = async ({
  token,
  user,
  items,
  deliveryAddress = null,
}) => {
  const order = await apiRequest("/payments/create-order", {
    method: "POST",
    token,
    body: {
      email: user?.email || "",
      customerName: user?.name || "",
      deliveryAddress,
      items: items.map(toCheckoutItemPayload),
    },
  });

  const Razorpay = await loadRazorpayCheckout();

  if (!Razorpay) {
    throw new Error(`${PAYMENT_PROVIDER} checkout could not be loaded.`);
  }

  return new Promise((resolve, reject) => {
    const checkout = new Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.gatewayOrderId,
      name: BRAND_NAME,
      description: `Order ${order.orderNumber}`,
      image: "/Home/images/PetPlus-Logo.png",
      prefill: {
        name:
          order.deliveryAddress?.fullName ||
          deliveryAddress?.fullName ||
          user?.name ||
          order.customerName ||
          "",
        email: user?.email || order.customerEmail || "",
        contact:
          order.customerPhone ||
          deliveryAddress?.phone ||
          user?.phone ||
          "",
      },
      notes: {
        localOrderId: order.orderId,
        orderNumber: order.orderNumber,
        deliveryCity: order.deliveryAddress?.city || "",
        deliveryPostalCode: order.deliveryAddress?.postalCode || "",
      },
      theme: {
        color: "#0F4A12",
      },
      modal: {
        ondismiss: () => {
          const error = new Error(
            "Payment was cancelled. You can restart checkout whenever you are ready."
          );
          error.code = "PAYMENT_CANCELLED";
          reject(error);
        },
      },
      handler: async (payment) => {
        try {
          const verification = await apiRequest(
            "/payments/razorpay/verify-payment",
            {
              method: "POST",
              token,
              body: {
                orderId: order.orderId,
                razorpayOrderId: payment.razorpay_order_id,
                razorpayPaymentId: payment.razorpay_payment_id,
                razorpaySignature: payment.razorpay_signature,
              },
            }
          );

          resolve({
            order,
            payment,
            verification,
          });
        } catch (error) {
          reject(error);
        }
      },
    });

    checkout.on("payment.failed", (event) => {
      const error = new Error(
        event?.error?.description ||
          "Payment could not be completed. Please try again."
      );
      error.code = "PAYMENT_FAILED";
      reject(error);
    });

    checkout.open();
  });
};
