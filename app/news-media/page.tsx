import Image from "next/image";

import { FadeIn } from "@/app/_components/animations/fade-in";
import newsHeroImage from "@/assests/mg-header-01.jpg";
import zeeMgmImage from "@/assests/zee-mgm.avif";
import fleximapsVisitImage from "@/assests/fleximaps-visit.png";
import saniaMgmImage from "@/assests/sania-mgm.jpg";
import hwNewsImage from "@/assests/HW-news.webp";
import highNewsImage from "@/assests/high-news.jpeg";
import microgreensNewsImage from "@/assests/Microgreens-De-Manikonda-How-a-Hyderabad-Entrepreneur-Is-Redefining-Urban-Nutrition.png";
import { MdOutlineDateRange, MdOutlineVideoCameraBack } from "react-icons/md";
import Link from "next/link";

const newsItems = [
  {
    id: 1,
    title: "Icons of Progress, Passion, and Professional Excellence",
    date: "April 2024",
    description: "MGM grows over 25 varieties of nutrient-dense microgreens without the use of soil or any chemical additives. The company only harvests its microgreens based on confirmed orders to guarantee their freshness.",
    image: zeeMgmImage,
    slug: "arogyamicrogreens-hyderabad-leading-supplier",
    channel: "Zee News India",
    readMore: true,
    channelLink: "https://zeenews.india.com/consumer-connect/icons-of-progress-passion-and-professional-excellence-3032529.html"
  },
  {
    id: 2,
    title: "MicroGreens de Manikonda – Fresh Organic Microgreens Farm in Manikonda, Hyderabad",
    date: "March 2024",
    description: " While researching healthier food options, Srinivasulu discovered microgreens, tiny edible seedlings harvested at the early growth stage of vegetables and herbs. Despite their small size, microgreens are known for their high concentration of vitamins, minerals, and antioxidants, often significantly higher than mature vegetables.",
    image: fleximapsVisitImage,
    slug: "microgreens-revolution-indian-cuisine",
    channel: "Flexi Maps",
    readMore: true,
    channelLink: "https://fleximaps.in/microgreens-de-manikonda-fresh-organic-microgreens-farm-in-manikonda-hyderabad"
  },
  {
    id: 3,
    title: "Saina Nehwal Graces Evolving South India Business Excellence Awards 2026 in Bengaluru",
    date: "February 2026",
    description: "Olympic medalist and former world no. 1 Saina Nehwal presented the Evolving South India Business Excellence Awards 2026 to Srinivasulu Dhanala, and MGM Hyderabad bagged the Excellence in Sustainable Microgreen Farming category.",
    image: saniaMgmImage,
    slug: "saina-nehwal-evolving-south-india-business-excellence-awards-2026",
    channel: "Read On",
    channelLink: "https://theprint.in/ani-press-releases/saina-nehwal-graces-evolving-south-india-business-excellence-awards-2026-in-bengaluru/2866201/",
    readMore: false,
    extra: "Business Standard | Tribune India | The Print | ANI NEWS"
  },
  {
    id: 4,
    title: "MicroGreens de Manikonda clinches national recognition for quality and sustainability",
    date: "February 2026",
    description: "MicroGreens de Manikonda was earlier celebrated as the Best Microgreens Producer of the Year at the Global Leadership Awards 2025, recognition that helped raise awareness about microgreens as a mainstream urban-nutrition solution.",
    image: hwNewsImage,
    slug: "local-farming-sustainable-methods",
    readMore: true,
    channel: "The Hindustan Wires",
    channelLink: "https://thehindustanwires.com/microgreens-de-manikonda-clinches-national-recognition-for-quality-and-sustainability/"
  },
  {
    id: 5,
    title: "Leadership Beyond Boundaries: India’s Visionaries Driving Multi-Sector Transformation",
    date: "January 2026",
    description: "One of India’s largest controlled indoor microgreen farms, expanding from 80 square feet to 2,700 square feet within a short span. Operating in a soil-free and chemical-free environment, MGM cultivates over 25 varieties of nutrient-rich microgreens, harvesting strictly against confirmed orders to ensure peak freshness and nutritional integrity.",
    image: highNewsImage,
    slug: "restaurant-partnerships-hyderabad-chefs",
    readMore: false,
    channel: "READ ON",
    extra: "The Tribune | The Week | The Wire | The PR Newswire | Oye Filmy",
    channelLink: "https://www.prnewswire.com/in/news-releases/leadership-beyond-boundaries-indias-visionaries-driving-multi-sector-transformation-302652449.html"
  },
  {
    id: 6,
    title: "Microgreens De Manikonda: How a Hyderabad Entrepreneur Is Redefining Urban Nutrition",
    date: "November 2025",
    description: "One of MGM’s strongest differences is a simple practice: the farm does not store microgreens. They are harvested only when an order comes in. This approach preserves both flavor and nutritional value, and it has become one of the main reasons people prefer MGM over others.",
    image: microgreensNewsImage,
    slug: "microgreens-delivery-innovation",
    readMore: false,
    channel: "READ ON",
    extra: "Entrepreneur Saga | RNI Business | The Indian Bulletin | Deccan Business | Wow Entrepreneurs | Money Mania"
  }
];


export default function NewsMediaPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-10 md:py-14 max-w-5xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-[#142331]">News & Media</h1>
        <p>From founder stories to industry recognition, right from the source.</p>
      </section>

      {/* News Content */}
      <section className="bg-[#f5f5f3] py-16 md:py-20">
        <div className="mx-auto w-full max-w-5xl px-6">

          {/* News Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {newsItems.map((item, index) => (
              <FadeIn key={item.id} delay={0.08 * (index + 1)} distance={18}>
                <article className="group cursor-pointer">
                  <div className="overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        placeholder="blur"
                        sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 1024px) calc((100vw - 80px) / 2), 400px"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-[#69ad38]">
                          <MdOutlineDateRange className="inline-block mr-1" /> {item.date}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-[#69ad38]">
                          <MdOutlineVideoCameraBack className="inline-block mr-1" /> {item.channel}
                        </p>
                      </div>
                      <h3 className="mb-3 text-lg font-bold leading-tight text-[#363636] group-hover:text-[#69ad38] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-6 text-gray-600">
                        {item.description}
                      </p>
                      <Link href={item.channelLink || "#"} target="_blank">
                        <button className={`mt-4 inline-flex items-center text-sm font-extrabold uppercase tracking-[0.05em] ${item.readMore ? 'text-[#69ad38]' : 'text-black'} transition hover:text-[#5e9d31]`}>
                         {item.readMore ? "Read More" : item.extra}
                          <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4-4m4 4H9" />
                          </svg>
                        </button>
                      </Link> 
                    </div>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
