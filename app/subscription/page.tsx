import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SubscriptionHero from "@/components/sections/subscription/SubscriptionHero";
import PricingCards from "@/components/sections/subscription/PricingCards";
import HowItWorks from "@/components/sections/subscription/HowItWorks";
import SubscriptionCTA from "@/components/sections/subscription/SubscriptionCTA";
import ChatFAB from "@/components/ui/ChatFAB";
import PageTransition from "@/components/animations/PageTransition";

export const metadata = {
  title: "Subscription Plans | AgriNest",
  description:
    "Choose your microgreen subscription plan. Weekly, monthly, or family packs — always fresh, always organic.",
};

export default function SubscriptionPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <PageTransition>
        <main>
          <SubscriptionHero />
          <PricingCards />
          <HowItWorks />
          <SubscriptionCTA />
        </main>
      </PageTransition>
      <Footer />
      <ChatFAB />
    </>
  );
}
