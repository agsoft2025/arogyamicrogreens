import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/app/_components/animations/fade-in";
import blogHeroImage from "@/assests/mg-header-01.jpg";
import microgreenRecipeImage from "@/assests/Alfalfa-Microgreen-3-300x300.jpg";

type Recipe = {
  id: number;
  title: string;
  date: string;
  description: string;
  image: any;
  slug: string;
};

type BlogPost = {
  id: number;
  title: string;
  date: string;
  description: string;
  image: any;
  slug: string;
};

const recipes: Recipe[] = [
  {
    id: 1,
    title: "10 Easy Indian Recipes Using Microgreens",
    date: "Mar 22, 2020",
    description: "Microgreens are one of the simplest ways to upgrade everyday Indian meals with powerful nutrition. These young edible greens are packed with vitamins, antioxidants, and essential minerals, making them a great addition to a healthy diet. Unlike traditional vegetables,...",
    image: microgreenRecipeImage,
    slug: "easy-indian-microgreens-recipes"
  },
  // Add more recipes as needed
];

const blogPosts: BlogPost[] = [
  // Add blog posts as needed
];

export default function BlogAndRecipesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-10 md:pt-15">
        <div className="mx-auto w-full max-w-5xl px-6">
          <h1 className="text-4xl font-bold text-[#142331]">Blogs & Recipes</h1>
          <p className="mt-4 text-base text-[#142331]/80">From everyday recipes to growing guides and seasonal picks, simple, practical ideas and tips for you to use.</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-[#f5f5f3] py-8 md:py-10">
        <div className="mx-auto w-full max-w-5xl px-6">

          {/* Recipes Section */}
          <div className="mb-16">
            <h2 className="mb-8 font-serif text-3xl font-bold text-[#142331]">
              Recipes
            </h2>

            {recipes.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {recipes.map((recipe, index) => (
                  <FadeIn key={recipe.id} delay={0.08 * (index + 1)} distance={18}>
                    <article className="group cursor-pointer">
                      <div className="overflow-hidden rounded-lg bg-white">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={recipe.image}
                            alt={recipe.title}
                            fill
                            placeholder="blur"
                            sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 1024px) calc((100vw - 80px) / 2), 400px"
                            className="object-cover transition duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-6">
                          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-[#69ad38] mb-2">
                            {recipe.date}
                          </p>
                          <h3 className="mb-3 text-lg font-bold leading-tight text-[#363636] group-hover:text-[#69ad38] transition-colors">
                            {recipe.title}
                          </h3>
                          <p className="text-sm leading-6 text-gray-600 line-clamp-9">
                            {recipe.description}
                          </p>
                        </div>
                      </div>
                    </article>
                  </FadeIn>
                ))}
                <div>
                  <h1 className="font-bold mb-2">No Results Found</h1>
                  <p>The page you requested could not be found. Try refining your search, or use the navigation above to locate the post.</p>
                </div>
                 <div>
                  <h1 className="font-bold mb-2">No Results Found</h1>
                  <p>The page you requested could not be found. Try refining your search, or use the navigation above to locate the post.</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500">No Results Found</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
