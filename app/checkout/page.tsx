"use client";

export const dynamic = 'force-static';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/authStore";
import { useCart } from "@/store/cartStore";
import { useOrder } from "@/store/orderStore";
import { motion } from "framer-motion";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/animations/PageTransition";
import ShippingForm, {
  ShippingData,
  ShippingErrors,
} from "@/components/sections/checkout/ShippingForm";
import DeliveryMethod, {
  DeliveryOption,
} from "@/components/sections/checkout/DeliveryMethod";
import PaymentMethod, {
  PaymentOption,
} from "@/components/sections/checkout/PaymentMethod";
import CheckoutSummary, {
  SummaryItem,
} from "@/components/sections/checkout/CheckoutSummary";
import ChatFAB from "@/components/ui/ChatFAB";
import { getMyProfile, saveMyAddress, type SavedAddress } from "@/api/user.api";

/* ── Razorpay SDK ───────────────────────────────────────────────
   Declare the global so TypeScript doesn't complain.
   The actual SDK is loaded via a <script> tag on mount.          */
declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open(): void;
      on(event: string, handler: (response: unknown) => void): void;
    };
  }
}

/* ── Shipping validation ─────────────────────────────────────── */

function validateShipping(data: ShippingData): ShippingErrors {
  const errors: ShippingErrors = {};
  if (!data.fullName.trim()) errors.fullName = "Full name is required.";
  if (!data.phone.trim()) errors.phone = "Phone number is required.";
  else if (!/^[+\d\s\-()]{7,}$/.test(data.phone))
    errors.phone = "Enter a valid phone number.";
  if (!data.street.trim()) errors.street = "Street address is required.";
  if (!data.city.trim()) errors.city = "City is required.";
  if (!data.state.trim()) errors.state = "State is required.";
  if (!data.zip.trim()) errors.zip = "PIN code is required.";
  else if (!/^\d{4,10}$/.test(data.zip.replace(/\s/g, "")))
    errors.zip = "Enter a valid PIN code.";
  if (!data.country.trim()) errors.country = "Country is required.";
  return errors;
}

const EMPTY_SHIPPING: ShippingData = {
  fullName: "",
  phone: "",
  street: "",
  addressLine2: "",
  city: "",
  state: "",
  zip: "",
  country: "India",
};

/* ── Page ────────────────────────────────────────────────────── */

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isRestoring } = useAuth();
  const { items: cartItems, syncing, clearCart } = useCart();
  const { createPaymentOrder, verifyPayment, createCodOrder } = useOrder();

  /* ── Razorpay SDK pre-load ── */
  const razorpayReady = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Already available (hot-reload, cached, or previous load)
    if (window.Razorpay) {
      razorpayReady.current = true;
      return;
    }
    // Avoid double-injecting
    if (document.getElementById("razorpay-sdk")) return;

    console.log("[Checkout] Preloading Razorpay SDK…");
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log("[Checkout] Razorpay SDK loaded successfully.");
      razorpayReady.current = true;
    };
    script.onerror = () => {
      console.error(
        "[Checkout] Failed to load Razorpay SDK from checkout.razorpay.com. " +
          "Check network connectivity, CSP headers, and ad-blocker settings."
      );
    };
    document.body.appendChild(script);
  }, []);

  /* ── Shipping state ── */
  const [shipping, setShipping] = useState<ShippingData>(EMPTY_SHIPPING);
  const [shippingErrors, setShippingErrors] = useState<ShippingErrors>({});
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [addressLoading, setAddressLoading] = useState(true);

  /* ── Delivery state ── */
  const [delivery, setDelivery] = useState<DeliveryOption>("standard");

  /* ── Payment state ── */
  const [paymentMethod, setPaymentMethod] = useState<PaymentOption>("razorpay");

  /* ── Processing state ── */
  const [isProcessing, setIsProcessing] = useState(false);

  /* ── Auth guard — wait for session restore before redirecting ── */
  useEffect(() => {
    if (isRestoring) return; // session check still in flight — don't redirect yet
    if (!isAuthenticated) {
      console.log("[Checkout] Not authenticated, redirecting to /cart");
      router.replace("/cart");
    }
  }, [isAuthenticated, isRestoring, router]);

  /* ── Load saved addresses on mount ── */
  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      try {
        const profile = await getMyProfile();
        const addresses = profile.data.savedAddresses ?? [];
        setSavedAddresses(addresses);

        // Pre-fill with the default (or first) saved address
        if (addresses.length > 0) {
          const defaultAddr =
            addresses.find((a) => a.isDefault) ?? addresses[0];
          setShipping({
            fullName: defaultAddr.fullName,
            phone: defaultAddr.phone,
            street: defaultAddr.addressLine1,
            addressLine2: defaultAddr.addressLine2 ?? "",
            city: defaultAddr.city,
            state: defaultAddr.state,
            zip: defaultAddr.postalCode,
            country: defaultAddr.country,
          });
        }
      } catch {
        // If profile fetch fails (e.g. network), just leave form empty
      } finally {
        setAddressLoading(false);
      }
    })();
  }, [isAuthenticated]);

  /* ── Early returns (after all hooks) ── */

  // Show spinner while session is being restored
  if (isRestoring) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf4]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 rounded-full border-4 border-[#e3e3dd] border-t-[#386b00]"
        />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (syncing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf4]">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-10 h-10 rounded-full border-4 border-[#e3e3dd] border-t-[#386b00]"
          />
          <p className="text-sm text-[#727973] font-[var(--font-work-sans)]">
            Preparing your cart…
          </p>
        </div>
      </div>
    );
  }

  const shippingCost = delivery === "express" ? 999 : 0;

  const summaryItems: SummaryItem[] = cartItems.map((item) => ({
    id: item.productId,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    image: item.image,
  }));

  /* ── Handlers ── */
  const handleShippingChange = (field: keyof ShippingData, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
    if (shippingErrors[field as keyof ShippingErrors]) {
      setShippingErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSelectSaved = (addr: SavedAddress) => {
    setShipping({
      fullName: addr.fullName,
      phone: addr.phone,
      street: addr.addressLine1,
      addressLine2: addr.addressLine2 ?? "",
      city: addr.city,
      state: addr.state,
      zip: addr.postalCode,
      country: addr.country,
    });
    setShippingErrors({});
  };

  /* ── Place order ── */
  const handlePlaceOrder = async () => {
    /* 1. Validate shipping */
    const sErrs = validateShipping(shipping);
    if (Object.keys(sErrs).length > 0) {
      setShippingErrors(sErrs);
      document
        .getElementById("shipping-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    console.log("[Checkout] handlePlaceOrder triggered, paymentMethod:", paymentMethod);
    setIsProcessing(true);

    try {
      /* 2. Build address */
      const addressData = {
        fullName: shipping.fullName.trim(),
        phone: shipping.phone.trim(),
        addressLine1: shipping.street.trim(),
        addressLine2: shipping.addressLine2.trim() || undefined,
        city: shipping.city.trim(),
        state: shipping.state.trim(),
        postalCode: shipping.zip.trim(),
        country: shipping.country.trim() || "India",
      };

      /* 3. Save new address silently (non-blocking) */
      const alreadySaved = savedAddresses.some(
        (a) =>
          a.addressLine1 === addressData.addressLine1 &&
          a.city === addressData.city &&
          a.postalCode === addressData.postalCode
      );
      if (!alreadySaved) {
        try {
          const result = await saveMyAddress({
            ...addressData,
            isDefault: savedAddresses.length === 0,
          });
          setSavedAddresses(result.data.savedAddresses ?? []);
        } catch {
          // Non-fatal — continue even if save fails
        }
      }

      /* ── Razorpay online payment ── */
      if (paymentMethod === "razorpay") {
        /* 4a. Create Razorpay order on backend */
        console.log("[Checkout] Calling createPaymentOrder…");
        const paymentOrder = await createPaymentOrder({
          paymentMethod: "RAZORPAY",
          shippingAddress: addressData,
          billingAddress: addressData,
        });
        console.log("[Checkout] Payment order received:", {
          razorpayOrderId: paymentOrder.razorpayOrderId,
          amount: paymentOrder.amount,
          currency: paymentOrder.currency,
          keyPresent: Boolean(paymentOrder.key),
        });

        /* 4b. Verify the SDK is ready */
        if (!window.Razorpay) {
          throw new Error(
            "Razorpay payment system is not ready. " +
              "Please refresh the page and ensure checkout.razorpay.com is reachable."
          );
        }

        /* 4c. Open Razorpay modal */
        console.log("[Checkout] Opening Razorpay modal…");
        const rzp = new window.Razorpay({
          key: paymentOrder.key,
          amount: paymentOrder.amount,
          currency: paymentOrder.currency,
          name: paymentOrder.orderName,
          description: paymentOrder.description,
          order_id: paymentOrder.razorpayOrderId,
          prefill: paymentOrder.prefill,
          notes: paymentOrder.notes,
          theme: { color: "#386b00" },

          handler: async (response: unknown) => {
            /* Payment captured — verify signature with backend */
            const r = response as {
              razorpay_order_id: string;
              razorpay_payment_id: string;
              razorpay_signature: string;
            };
            console.log("[Checkout] Payment captured, verifying signature…");
            try {
              await verifyPayment({
                razorpayOrderId: r.razorpay_order_id,
                razorpayPaymentId: r.razorpay_payment_id,
                razorpaySignature: r.razorpay_signature,
              });
              console.log("[Checkout] Payment verified — clearing cart…");
              try {
                await clearCart();
                console.log("[Checkout] Cart cleared successfully.");
              } catch (clearErr) {
                // Non-fatal: cart will re-sync on next session; don't block navigation
                console.error("[Checkout] Cart clear failed (non-fatal):", clearErr);
              }
              router.push("/checkout/success");
            } catch (verifyErr: unknown) {
              const msg =
                verifyErr instanceof Error
                  ? verifyErr.message
                  : (verifyErr as { message?: string })?.message;
              console.error("[Checkout] Payment verification failed:", verifyErr);
              alert(
                msg ||
                  "Payment received but verification failed. Please contact support with your payment ID."
              );
              setIsProcessing(false);
            }
          },

          modal: {
            ondismiss: () => {
              console.log("[Checkout] Razorpay modal closed by user");
              setIsProcessing(false);
            },
          },
        });

        rzp.on("payment.failed", (response: unknown) => {
          const r = response as { error?: { description?: string; code?: string } };
          console.error("[Checkout] Razorpay payment.failed:", r.error);
          alert(
            r.error?.description ||
              "Payment failed. Please try a different payment method."
          );
          setIsProcessing(false);
        });

        rzp.open();
        console.log("[Checkout] rzp.open() called — modal should be visible");

        /* NOTE: setIsProcessing(false) is intentionally NOT called here.
           It is called inside handler (on success → navigate) / ondismiss /
           payment.failed. The button stays in "Processing" state while the
           Razorpay modal is open.                                           */

      } else {
        /* ── COD flow ── */
        console.log("[Checkout] Creating COD order…");
        await createCodOrder({
          shippingAddress: addressData,
          billingAddress: addressData,
        });
        console.log("[Checkout] COD order created \u2014 clearing cart\u2026");
        try {
          await clearCart();
          console.log("[Checkout] Cart cleared successfully.");
        } catch (clearErr) {
          console.error("[Checkout] Cart clear failed (non-fatal):", clearErr);
        }
        router.push("/checkout/success");
      }
    } catch (error: unknown) {
      const err = error as { message?: string };
      console.error("[Checkout] Order placement failed:", error);
      alert(err?.message || "Failed to place order. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <PageTransition>
        <main className="min-h-screen bg-[#fafaf4]">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-10 md:py-14">
            {/* Page title */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
              className="font-[var(--font-libre-caslon)] text-[36px] md:text-[44px] font-bold text-[#032616] mb-8"
            >
              Checkout
            </motion.h1>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* \u2500\u2500 Left column: forms \u2500\u2500 */}
              <div className="flex-[1.5] min-w-0 flex flex-col gap-8">
                <div id="shipping-section">
                  {addressLoading ? (
                    <div
                      className="bg-white rounded-xl p-6 border border-[#c1c8c1]/30 animate-pulse space-y-4"
                      style={{ boxShadow: "0 4px 12px rgba(3,38,22,0.10)" }}
                    >
                      <div className="h-7 w-48 bg-[#e3e3dd] rounded" />
                      <div className="grid grid-cols-2 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="h-12 bg-[#e3e3dd] rounded-lg" />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <ShippingForm
                      data={shipping}
                      errors={shippingErrors}
                      onChange={handleShippingChange}
                      savedAddresses={savedAddresses}
                      onSelectSaved={handleSelectSaved}
                    />
                  )}
                </div>

                <DeliveryMethod selected={delivery} onChange={setDelivery} />

                <div id="payment-section">
                  <PaymentMethod
                    selected={paymentMethod}
                    onSelect={setPaymentMethod}
                  />
                </div>
              </div>

              {/* Right column: summary */}
              <div className="w-full lg:w-[380px] shrink-0">
                <CheckoutSummary
                  items={summaryItems}
                  shippingCost={shippingCost}
                  onPlaceOrder={handlePlaceOrder}
                  isProcessing={isProcessing}
                />
              </div>
            </div>
          </div>
        </main>
      </PageTransition>
      <Footer />
      <ChatFAB />
    </>
  );
}
