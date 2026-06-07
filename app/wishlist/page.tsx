import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WishlistGrid from "@/components/sections/wishlist/WishlistGrid";
import ChatFAB from "@/components/ui/ChatFAB";
import PageTransition from "@/components/animations/PageTransition";
import WishlistHeader from "@/components/sections/wishlist/WishlistHeader";

export const metadata = {
  title: "Your Wishlist | AgriNest",
  description:
    "Manage your favorite organic microgreens and artisanal products. Move them to your cart when you're ready.",
};

export default function WishlistPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <PageTransition>
        <main className="min-h-screen bg-[#fafaf4]">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-12 md:py-16">
            <WishlistHeader />
            <WishlistGrid />
          </div>
        </main>
      </PageTransition>
      <Footer />
      <ChatFAB />
    </>
  );
}
