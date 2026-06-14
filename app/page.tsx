import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedMicrogreens from "@/components/sections/FeaturedMicrogreens";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import BestSelling from "@/components/sections/BestSelling";
import SubscriptionPlans from "@/components/sections/SubscriptionPlans";
import ChatFAB from "@/components/ui/ChatFAB";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedMicrogreens />
        <WhyChooseUs />
        <BestSelling />
        <SubscriptionPlans />
      </main>
      <Footer />
      <ChatFAB />
    </>
  );
}
