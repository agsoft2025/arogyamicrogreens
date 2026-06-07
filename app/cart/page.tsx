import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartItemsList from "@/components/sections/cart/CartItemsList";
import CartHeader from "@/components/sections/cart/CartHeader";
import ChatFAB from "@/components/ui/ChatFAB";
import PageTransition from "@/components/animations/PageTransition";

export const metadata = {
  title: "Your Cart | AgriNest",
  description:
    "Review your harvest. Manage cart items, apply promo codes, and proceed to secure checkout.",
};

export default function CartPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <PageTransition>
        <main className="min-h-screen bg-[#fafaf4]">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-10 md:py-14">
            <CartHeader />
            <CartItemsList />
          </div>
        </main>
      </PageTransition>
      <Footer />
      <ChatFAB />
    </>
  );
}
