export type NavigationItem = {
  href: string;
  label: string;
};

export const primaryNavigation: NavigationItem[] = [
  { href: "/subscription", label: "SUBSCRIPTION PLANS" },
  { href: "/microgreen", label: "MICROGREEN" },
  { href: "/seeds", label: "SEEDS" },
  { href: "/grow-kit", label: "GROW KIT" },
  { href: "/fresh-insights", label: "FRESH INSIGHTS" },
];
