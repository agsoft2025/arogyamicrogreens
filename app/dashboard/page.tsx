import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/animations/PageTransition";
import ChatFAB from "@/components/ui/ChatFAB";
import DashboardHeader from "@/components/sections/dashboard/DashboardHeader";
import CurrentOrderTracker from "@/components/sections/dashboard/CurrentOrderTracker";
import RecentOrders from "@/components/sections/dashboard/RecentOrders";
import SubscriptionPanel from "@/components/sections/dashboard/SubscriptionPanel";
import QuickActions from "@/components/sections/dashboard/QuickActions";

export const metadata = {
  title: "Dashboard | AgriNest",
  description:
    "Track your farm-fresh microgreens orders and manage your garden-to-table experience.",
};

export default function DashboardPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <PageTransition>
        <main className="min-h-screen bg-[#fafaf4]">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-10 md:py-14">
            {/* Welcome header */}
            <DashboardHeader />

            {/* Current Order — full width */}
            <div className="mb-6">
              <CurrentOrderTracker />
            </div>

            {/* Recent Orders (8 cols) + Subscriptions (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              <div className="lg:col-span-8">
                <RecentOrders />
              </div>
              <div className="lg:col-span-4">
                <SubscriptionPanel />
              </div>
            </div>

            {/* Quick Actions */}
            <QuickActions />
          </div>
        </main>
      </PageTransition>
      <Footer />
      <ChatFAB />
    </>
  );
}
