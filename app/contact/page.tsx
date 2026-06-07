import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactHero from "@/components/sections/contact/ContactHero";
import ContactGrid from "@/components/sections/contact/ContactGrid";
import FAQSection from "@/components/sections/contact/FAQSection";
import ChatFAB from "@/components/ui/ChatFAB";
import PageTransition from "@/components/animations/PageTransition";

export const metadata = {
  title: "Contact Us | AgriNest",
  description:
    "Have a question about our microgreens, subscriptions, or workshops? Get in touch with the AgriNest team.",
};

export default function ContactPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <PageTransition>
        <main>
          <ContactHero />
          <ContactGrid />
          <FAQSection />
        </main>
      </PageTransition>
      <Footer />
      <ChatFAB />
    </>
  );
}
