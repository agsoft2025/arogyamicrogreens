"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

/* ── Sample cart items passed to checkout ──────────────────── */
const DEFAULT_ITEMS: SummaryItem[] = [
  {
    id: "gourmet-mix",
    name: "Gourmet Micro Mix",
    quantity: 2,
    price: 12.0,
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLvC22NA1goRvJW71JaUpgVyUvo97noiLIad3EK7P47w15iVEtt84GNtBLOpk8374hbWM9iZJWInC3lMSF6cAp9xPf2wbbjRACBuyLaK4wkk9O22BBWBksMZO1fm9Y7P3byezBRVF0l0eZ-QhCI5Qvlvb-YPl1HxlhizPW7vX1tC9q3Qew-INB8Z7WZeaItNQ4tUNZHNQIhEuhIZwovytSVBqFnERyCaJhbYLbZoeopHhsfEUnsqjqDF9JE",
  },
  {
    id: "wheatgrass-kit",
    name: "Wheatgrass Vitality Kit",
    quantity: 1,
    price: 18.5,
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLvxVL-OmSx83t8sF6VUZ-osAboQLjusViw3nYPiAe1dXwwl1TkQREsv3qkmiBf3ZGguunsusgR_9UNqSZ5BxYB6PydLAx7Oc64uZ2J9kHn_yoRF80u8wngdhP9OhCAfu56Kg0elgD6m11ObyEZbPaAAi496xTsjkopppbYmtVQ310Gdp2V5WOPne-haXRmDEKhWQGFJuJ0sTr1wwOhAC1gN7Of5N93N9N2o2FvLSAjf265q95F7z_4Dkpc",
  },
];

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

  const shippingCost = delivery === "express" ? 12 : 0;

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

  const handlePlaceOrder = () => {
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

    /* Simulate processing */
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      router.push("/checkout/success");
    }, 2000);
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
                  items={DEFAULT_ITEMS}
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
