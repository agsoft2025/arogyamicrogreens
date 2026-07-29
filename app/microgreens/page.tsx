export const dynamic = 'force-static';

import { Suspense } from "react";
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

/* Skeleton shown while MicroCollection resolves useSearchParams */
function CollectionSkeleton() {
  return (
    <section className="px-5 md:px-16 py-24 max-w-[1280px] mx-auto">
      <div className="mb-12 space-y-2">
        <div className="h-10 w-72 bg-[#e3e3dd] rounded animate-pulse" />
        <div className="h-4 w-56 bg-[#e3e3dd] rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#e3e3dd] overflow-hidden animate-pulse">
            <div className="aspect-square bg-[#e3e3dd]" />
            <div className="p-5 space-y-3">
              <div className="h-5 bg-[#e3e3dd] rounded w-3/4" />
              <div className="h-4 bg-[#e3e3dd] rounded w-full" />
              <div className="h-10 bg-[#e3e3dd] rounded mt-4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function MicrogreensPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <PageTransition>
        <main>
          <MicrogreensHero />
          <Suspense fallback={<CollectionSkeleton />}>
            <MicroCollection />
          </Suspense>
          <SubscribeCTA />
        </main>
      </PageTransition>
      <Footer />
      <ChatFAB />
    </>
  );
}
