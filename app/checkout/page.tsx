"use client";

import { useState, useEffect } from "react";
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
  CardData,
  CardErrors,
} from "@/components/sections/checkout/PaymentMethod";
import CheckoutSummary, {
  SummaryItem,
} from "@/components/sections/checkout/CheckoutSummary";
import ChatFAB from "@/components/ui/ChatFAB";

/* ── Validation helpers ─────────────────────────────────────── */
function validateShipping(data: ShippingData): ShippingErrors {
  const errors: ShippingErrors = {};
  if (!data.fullName.trim()) errors.fullName = "Full name is required.";
  if (!data.phone.trim()) errors.phone = "Phone number is required.";
  else if (!/^[+\d\s\-()]{7,}$/.test(data.phone))
    errors.phone = "Enter a valid phone number.";
  if (!data.street.trim()) errors.street = "Street address is required.";
  if (!data.city.trim()) errors.city = "City / State is required.";
  if (!data.zip.trim()) errors.zip = "Zip code is required.";
  else if (!/^\d{4,10}$/.test(data.zip.replace(/\s/g, "")))
    errors.zip = "Enter a valid zip code.";
  return errors;
}

function validateCard(data: CardData): CardErrors {
  const errors: CardErrors = {};
  const stripped = data.number.replace(/\s/g, "");
  if (stripped.length < 16) errors.number = "Enter a valid 16-digit card number.";
  if (!/^\d{2}\s?\/\s?\d{2}$/.test(data.expiry))
    errors.expiry = "Enter expiry as MM / YY.";
  if (data.cvv.length < 3) errors.cvv = "CVV must be 3-4 digits.";
  return errors;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { items: cartItems, syncing } = useCart();
  const { createPaymentOrder, verifyPayment, createCodOrder, preview } = useOrder();

  /* ── All hooks must come before any early returns ── */

  /* ── Shipping state ── */
  const [shipping, setShipping] = useState<ShippingData>({
    fullName: "Julianna Veldon",
    phone: "+1 (555) 000-1234",
    street: "482 Green Harvest Lane, Organic Valley",
    city: "Portland, OR",
    zip: "97201",
  });
  const [shippingErrors, setShippingErrors] = useState<ShippingErrors>({});

  /* ── Delivery state ── */
  const [delivery, setDelivery] = useState<DeliveryOption>("standard");

  /* ── Payment state ── */
  const [paymentMethod, setPaymentMethod] = useState<PaymentOption>("card");
  const [cardData, setCardData] = useState<CardData>({
    number: "",
    expiry: "",
    cvv: "",
  });
  const [cardErrors, setCardErrors] = useState<CardErrors>({});

  /* ── Processing state ── */
  const [isProcessing, setIsProcessing] = useState(false);

  /* ── Auth guard (after all hooks) ── */
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/cart");
    }
  }, [isAuthenticated, router]);

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

  /* ── Map cart items to checkout summary format ── */
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
    if (shippingErrors[field]) {
      setShippingErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCardChange = (field: keyof CardData, value: string) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
    if (cardErrors[field]) {
      setCardErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePlaceOrder = async () => {
    /* Validate shipping */
    const sErrs = validateShipping(shipping);
    if (Object.keys(sErrs).length > 0) {
      setShippingErrors(sErrs);
      document.getElementById("shipping-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    /* Validate card if selected */
    if (paymentMethod === "card") {
      const cErrs = validateCard(cardData);
      if (Object.keys(cErrs).length > 0) {
        setCardErrors(cErrs);
        document.getElementById("payment-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    /* Process order */
    setIsProcessing(true);

    try {
      // Prepare address data
      const addressData = {
        fullName: shipping.fullName,
        phone: shipping.phone,
        addressLine1: shipping.street,
        addressLine2: "",
        city: shipping.city,
        state: "Oregon",
        postalCode: shipping.zip,
        country: "USA",
      };

      if (paymentMethod === "card") {
        // Razorpay payment flow
        const paymentOrder = await createPaymentOrder({
          paymentMethod: "RAZORPAY",
          shippingAddress: addressData,
          billingAddress: addressData,
        });

        // Load Razorpay script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
          const options = {
            key: paymentOrder.key,
            amount: paymentOrder.amount,
            currency: paymentOrder.currency,
            name: paymentOrder.orderName,
            description: paymentOrder.description,
            order_id: paymentOrder.razorpayOrderId,
            prefill: paymentOrder.prefill,
            notes: paymentOrder.notes,
            theme: {
              color: "#386b00",
            },
            handler: async (response: any) => {
              try {
                // Verify payment
                await verifyPayment({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                });
                router.push("/checkout/success");
              } catch (error: any) {
                console.error("Payment verification failed:", error);
                alert("Payment verification failed. Please try again.");
              } finally {
                setIsProcessing(false);
              }
            },
            modal: {
              ondismiss: () => {
                setIsProcessing(false);
              },
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      } else {
        // COD flow
        await createCodOrder({
          shippingAddress: addressData,
          billingAddress: addressData,
        });
        router.push("/checkout/success");
      }
    } catch (error: any) {
      console.error("Order placement failed:", error);
      alert(error.message || "Failed to place order. Please try again.");
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
              {/* ── Left column: forms ── */}
              <div className="flex-[1.5] min-w-0 flex flex-col gap-8">
                <div id="shipping-section">
                  <ShippingForm
                    data={shipping}
                    errors={shippingErrors}
                    onChange={handleShippingChange}
                  />
                </div>

                <DeliveryMethod
                  selected={delivery}
                  onChange={setDelivery}
                />

                <div id="payment-section">
                  <PaymentMethod
                    selected={paymentMethod}
                    cardData={cardData}
                    cardErrors={cardErrors}
                    onSelect={setPaymentMethod}
                    onCardChange={handleCardChange}
                  />
                </div>
              </div>

              {/* ── Right column: summary ── */}
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
