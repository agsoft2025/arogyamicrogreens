"use client";

import Image from "next/image";
import { useState } from "react";

import { FadeIn } from "@/app/_components/animations/fade-in";
import storiesHeroImage from "@/assests/mg-header-01.jpg";
import { AiOutlineYoutube } from "react-icons/ai";

const videoContent = [
  {
    id: 1,
    title: "Growing Microgreens at Home: Complete Guide",
    description: "Learn how to grow fresh, nutritious microgreens right in your kitchen. This comprehensive guide covers everything from seed selection to harvest.",
    videoId: "wutAomSgPAI",
    channel: "Microgreens Guide",
    duration: "37.33",
    thumbnail: storiesHeroImage
  },
  {
    id: 2,
    title: "Srinivasulu Dhanala | MicroGreens de Manikonda | Excellence in Sustainable Microgreen Farming",
    description: "Interview with Srinivasulu Dhanala about his successful microgreen farming business in Manikonda, showcasing sustainable practices and business insights.",
    date: "March 30, 2026 | English",
    channel: "PrestigeSphere PR",
    videoId: "CqORDtPhkzE",
    duration: "8:32",
    thumbnail: storiesHeroImage
  },
  {
    id: 3,
    title: "ICICI Bank 🏦 Job Quit Farming 🌱 | Microgreens Business in Hyderabad",
    description: "Success story of an ICICI Bank employee who quit their job to start a profitable microgreens business in Hyderabad, sharing their journey and tips.",
    date: "March 23, 2026 | English",
    channel: "Agrotill",
    videoId: "037-ctH7Eys",
    duration: "15:20",
    thumbnail: storiesHeroImage
  }
];

const shortsContent = [
  {
    id: 1,
    title: "Whats on Your Plate? | Ep.1",
    description: "March 25, 2026 | English",
    videoId: "rtfmSTyZo9k",
    channel: "MGM Hyd",
    duration: "0:58",
    thumbnail: storiesHeroImage
  },
  {
    id: 2,
    title: "Whats on Your Plate? | Ep.2",
    description: "March 28, 2026 | English",
    videoId: "rkOGGvWkaSA",
    channel: "MGM Hyd",
    duration: "1:15",
    thumbnail: storiesHeroImage
  },
  {
    id: 3,
    title: "Customer Stories",
    description: "March 18, 2026 | English",
    videoId: "YJhY0HyKjjk",
    channel: "MGM Hyd",
    duration: "0:45",
    thumbnail: storiesHeroImage
  },
  {
    id: 4,
    title: "Jyoti Khera and Ashu Hora",
    description: "March 10, 2026 | English",
    videoId: "AG-Teipnirw",
    channel: "MGM Hyd",
    duration: "1:20",
    thumbnail: storiesHeroImage
  },
  {
    id: 5,
    title: "Jyoti Khera",
    description: "March 02, 2026 | English",
    videoId: "eXOMU1TO1oY",
    channel: "MGM Hyd",
    duration: "1:35",
    thumbnail: storiesHeroImage
  },
  {
    id: 6,
    title: "MGM Starter Workshop",
    description: "Feb 27, 2026 | English",
    videoId: "3Erngx0Cc4g",
    channel: "MGM Hyd",
    duration: "1:10",
    thumbnail: storiesHeroImage
  },
  {
    id: 7,
    title: "Health benefits of microgreens",
    description: "Feb 10, 2026 | Telugu",
    videoId: "G8pt5MkX0iU",
    channel: "MGM Hyd",
    duration: "0:52",
    thumbnail: storiesHeroImage
  },
  {
    id: 8,
    title: "Non Veg v/s Veg and Micorgreens",
    description: "Feb 10, 2026 | Telugu",
    videoId: "tZn6IV3KANE",
    channel: "MGM Hyd",
    duration: "1:03",
    thumbnail: storiesHeroImage
  },
  {
    id: 9,
    title: "Food helps Skin & Hair | Microgreens",
    description: "Feb 10, 2026 | Telugu",
    videoId: "qj1w4a3F3aQ",
    channel: "MGM Hyd",
    duration: "0:48",
    thumbnail: storiesHeroImage
  }
];

function VideoCard({ video, onPlay }: { video: typeof videoContent[0]; onPlay: (video: typeof videoContent[0]) => void }) {
  const getYouTubeEmbedUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const getYouTubeThumbnailUrl = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  return (
    <FadeIn delay={0.08 * video.id} distance={18}>
      <article className="group cursor-pointer" onClick={() => onPlay(video)}>
        <div className="overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300">
          {/* Video Thumbnail with Play Button */}
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={getYouTubeThumbnailUrl(video.videoId)}
              alt={video.title}
              fill
              sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 1024px) calc((100vw - 80px) / 2), 400px"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:bg-black/30" />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-300 group-hover:scale-110">
                <svg className="h-6 w-6 text-[#69ad38] ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* Duration Badge */}
            <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded">
              {video.duration}
            </div>
          </div>

          {/* Video Info */}
          <div className="p-6">
            <h3 className="mb-3 text-lg font-bold leading-tight text-[#363636] group-hover:text-[#69ad38] transition-colors">
              {video.title}
            </h3>
            <p className="text-sm leading-6 text-gray-600 line-clamp-3">
              {video.description}
            </p>
            <p className="flex items-center gap-2"><AiOutlineYoutube  /> {video?.channel}</p>
            <button 
              className="mt-4 inline-flex items-center text-sm font-extrabold uppercase tracking-[0.05em] text-[#69ad38] transition hover:text-[#5e9d31]"
              onClick={(e) => {
                e.stopPropagation();
                onPlay(video);
              }}
            >
              Watch Now
              <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </article>
    </FadeIn>
  );
}

function ShortsCard({ short, onPlay }: { short: typeof shortsContent[0]; onPlay: (short: typeof shortsContent[0]) => void }) {
  const getYouTubeEmbedUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const getYouTubeThumbnailUrl = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  return (
    <FadeIn delay={0.08 * short.id} distance={18}>
      <article className="group cursor-pointer" onClick={() => onPlay(short)}>
        <div className="overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300">
          {/* Shorts Thumbnail with Play Button - Vertical Aspect */}
          <div className="relative aspect-[9/16] overflow-hidden">
            <Image
              src={getYouTubeThumbnailUrl(short.videoId)}
              alt={short.title}
              fill
              sizes="(max-width: 640px) 200px, (max-width: 1024px) 250px, 300px"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:bg-black/30" />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-300 group-hover:scale-110">
                <svg className="h-5 w-5 text-[#69ad38] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* Duration Badge */}
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
              {short.duration}
            </div>

            {/* Shorts Badge */}
            <div className="absolute top-2 left-2">
              <span className="inline-block px-2 py-1 text-xs font-bold uppercase tracking-[0.05em] text-white bg-red-600 rounded">
                SHORTS
              </span>
            </div>
          </div>

          {/* Shorts Info */}
          <div className="p-4">
            <h3 className="mb-2 text-sm font-bold leading-tight text-[#363636] group-hover:text-[#69ad38] transition-colors line-clamp-2">
              {short.title}
            </h3>
            <p className="text-xs leading-5 text-gray-600 line-clamp-2 mb-2">
              {short.description}
            </p>
            <p className="flex items-center gap-1 text-xs text-gray-500">
              <AiOutlineYoutube className="text-xs" /> {short.channel}
            </p>
          </div>
        </div>
      </article>
    </FadeIn>
  );
}

export default function StoriesAndInsightsPage() {
  const [selectedVideo, setSelectedVideo] = useState<typeof videoContent[0] | typeof shortsContent[0] | null>(null);

  const openVideoModal = (video: typeof videoContent[0] | typeof shortsContent[0]) => {
    setSelectedVideo(video);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  return (
    <>
      {/* Hero Section */}
      <section>
        <div className="relative mx-auto flex w-full max-w-5xl items-center px-6 pb-5">
          <FadeIn className="max-w-2xl">
            <h1 className="mt-5 text-5xl font-bold leading-tight text-black md:text-[54px]">
              Stories & Insights
            </h1>
            <p className="mt-4 text-sm font-semibold uppercase leading-7 tracking-[0.12em] text-black/80">
              Short, easy-to-follow videos covering microgreens basics, daily habits, and real-life use.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Video Content */}
      <section className="bg-[#f5f5f3] py-16 md:py-20">
        <div className="mx-auto w-full max-w-5xl px-6">

          {/* Featured Video */}
          <div className="mb-12">
            <FadeIn>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/wutAomSgPAI"
                    title="Growing Microgreens at Home: Complete Guide"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-[0.05em] text-white bg-[#69ad38] rounded-full">
                      Featured Video
                    </span>
                    <span className="text-sm text-gray-500">12:45</span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#363636] mb-3">
                    Growing Microgreens at Home: Complete Guide
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Learn how to grow fresh, nutritious microgreens right in your kitchen. This comprehensive guide covers everything from seed selection to harvest, perfect for beginners and experienced growers alike.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Video Grid */}
          <div className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-[#142331] mb-8">
              More Videos
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {videoContent.slice(1).map((video) => (
                <VideoCard key={video.id} video={video} onPlay={openVideoModal} />
              ))}
            </div>
          </div>

          {/* Shorts Section */}
          <div className="mb-8">
            <h2 className="font-serif text-3xl font-bold text-[#142331] mb-8">
              YouTube Shorts
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {shortsContent.map((short) => (
                <ShortsCard key={short.id} short={short} onPlay={openVideoModal} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={closeVideoModal}
        >
          <div 
            className="relative w-full max-w-4xl bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeVideoModal}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-800 hover:bg-white transition-colors"
              aria-label="Close video"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Player */}
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            {/* Video Info */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-[#363636] mb-3">
                {selectedVideo.title}
              </h2>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-sm text-gray-500">{selectedVideo.duration}</span>
                {selectedVideo.channel && (
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <AiOutlineYoutube /> {selectedVideo.channel}
                  </p>
                )}
              </div>
              <p className="text-gray-600 leading-relaxed">
                {selectedVideo.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}