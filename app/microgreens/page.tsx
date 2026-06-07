import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MicrogreensHero from "@/components/sections/microgreens/MicrogreensHero";
import MicroCollection from "@/components/sections/microgreens/MicroCollection";
import SubscribeCTA from "@/components/sections/microgreens/SubscribeCTA";
import ChatFAB from "@/components/ui/ChatFAB";
import PageTransition from "@/components/animations/PageTransition";

export const metadata = {
  title: "MicroGreens Collection | AgriNest",
  description:
    "Explore our freshly harvested microgreen varieties. Nutrient-dense, chemical-free, delivered the same day.",
};

export default function MicrogreensPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <PageTransition>
        <main>
          <MicrogreensHero />
          <MicroCollection />
          <SubscribeCTA />
        </main>
      </PageTransition>
      <Footer />
      <ChatFAB />
    </>
  );
}
