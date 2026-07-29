export const dynamic = 'force-static';

import { Suspense } from "react";
import type { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SearchResults from "@/components/sections/search/SearchResults";
import PageTransition from "@/components/animations/PageTransition";
import ChatFAB from "@/components/ui/ChatFAB";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim();
  return {
    title: query
      ? `Search Results for "${query}" | AgriNest`
      : "Search Products | AgriNest",
    description: query
      ? `Explore AgriNest products matching "${query}". Fresh microgreens and organic products delivered to your door.`
      : "Search our full collection of fresh microgreens and organic products at AgriNest.",
  };
}

function SearchSkeleton() {
  return (
    <section className="px-5 md:px-16 py-16 max-w-[1280px] mx-auto">
      <div className="mb-10 space-y-3">
        <div className="h-4 w-32 bg-[#e3e3dd] rounded animate-pulse" />
        <div className="h-10 w-80 bg-[#e3e3dd] rounded animate-pulse" />
        <div className="h-4 w-48 bg-[#e3e3dd] rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-[#e3e3dd] overflow-hidden animate-pulse"
          >
            <div className="aspect-square bg-[#e3e3dd]" />
            <div className="p-5 space-y-3">
              <div className="h-5 bg-[#e3e3dd] rounded w-3/4" />
              <div className="h-4 bg-[#e3e3dd] rounded w-full" />
              <div className="h-4 bg-[#e3e3dd] rounded w-2/3" />
              <div className="h-10 bg-[#e3e3dd] rounded mt-4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function SearchPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <PageTransition>
        <main>
          <Suspense fallback={<SearchSkeleton />}>
            <SearchResults />
          </Suspense>
        </main>
      </PageTransition>
      <Footer />
      <ChatFAB />
    </>
  );
}
