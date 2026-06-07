import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductsHero from "@/components/sections/products/ProductsHero";
import FilterSidebar from "@/components/sections/products/FilterSidebar";
import ProductsGrid from "@/components/sections/products/ProductsGrid";
import ChatFAB from "@/components/ui/ChatFAB";
import PageTransition from "@/components/animations/PageTransition";

export const metadata = {
  title: "Products | AgriNest",
  description:
    "Shop our complete collection of nutrient-dense microgreens, heirloom seeds, and growing kits.",
};

export default function ProductsPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <PageTransition>
        <main>
          <ProductsHero />
          <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-12 flex flex-col md:flex-row gap-8">
            <FilterSidebar />
            <ProductsGrid />
          </div>
        </main>
      </PageTransition>
      <Footer />
      <ChatFAB />
    </>
  );
}
