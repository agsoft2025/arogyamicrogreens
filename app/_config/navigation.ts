export type NavigationItem = {
  href: string;
  label: string;
  children?: NavigationItem[];
};

export const primaryNavigation: NavigationItem[] = [
  { href: "/", label: "HOME" },
  { href: "/microgreen", label: "MICROGREEN" },
  { href: "/subscription", label: "SUBSCRIPTION PLANS" },
  { href: "/product", label: "PRODUCTS" },
  { href: "/contact-us", label: "CONTACT US" },
  // { href: "/seeds", label: "SEEDS" },
  // { href: "/grow-kit", label: "GROW KIT" },
  // {
  //   href: "/fresh-insights",
  //   label: "FRESH INSIGHTS",
  //   children: [
  //     { href: "/blog-and-recipes", label: "BLOG & RECIPES" },
  //     { href: "/stories-and-insights", label: "STORIES & INSIGHTS" },
  //     { href: "/news-media", label: "NEWS & MEDIA" },
  //   ],
  // },
];
