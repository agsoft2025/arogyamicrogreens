import type { StaticImageData } from "next/image";

import microgreenDetails from "@/app/_data/microgreen-details.json";
import products from "@/app/_data/seeds-products.json";
import seedSinglePage from "@/app/_data/seed-single-page-structured.json";
import seedImg1 from "@/assests/mcseed1.png";
import seedImg2 from "@/assests/mcseed2.png";
import seedImg3 from "@/assests/mcseed3.png";
import seedImg4 from "@/assests/mcseed4.png";
import seedImg5 from "@/assests/mcseed5.png";
import seedImg6 from "@/assests/mcseed6.png";
import seedImg7 from "@/assests/mcseed7.png";
import seedImg8 from "@/assests/mcseed8.png";
import seedImg9 from "@/assests/mcseed9.png";
import seedImg10 from "@/assests/mcseed10.png";
import seedImg11 from "@/assests/mcseed11.png";
import seedImg12 from "@/assests/mcseed12.png";
import seedImg13 from "@/assests/mcseed13.png";
import seedImg14 from "@/assests/mcseed14.png";
import seedImg15 from "@/assests/mcseed15.png";
import seedImg16 from "@/assests/mcseed16.png";
import seedImg17 from "@/assests/mcseed17.png";
import seedImg18 from "@/assests/mcseed18.png";
import seedImg19 from "@/assests/mcseed19.png";
import seedImg20 from "@/assests/mcseed20.png";
import seedImg21 from "@/assests/mcseed21.png";
import seedImg22 from "@/assests/mcseed22.png";
import seedImg23 from "@/assests/mcseed23.png";
import seedImg24 from "@/assests/mcseed24.png";
import seedImg25 from "@/assests/mcseed25.png";
import seedImg26 from "@/assests/mcseed26.png";
import seedImg27 from "@/assests/mcseed27.png";
import seedImg28 from "@/assests/mcseed28.png";
import seedImg29 from "@/assests/mcseed29.png";
import seedImg30 from "@/assests/mcseed30.png";
import seedImg31 from "@/assests/mcseed31.png";
import seedImg32 from "@/assests/mcseed32.png";
import seedImg33 from "@/assests/mcseed33.png";
import seedImg34 from "@/assests/mcseed34.png";
import seedImg35 from "@/assests/mcseed35.png";
import seedImg36 from "@/assests/mcseed36.png";
import seedImg37 from "@/assests/mcseed37.png";
import seedImg38 from "@/assests/mcseed38.png";
import seedImg39 from "@/assests/mcseed39.png";
import seedImg40 from "@/assests/mcseed40.png";
import seedImg41 from "@/assests/mcseed41.png";
import seedImg42 from "@/assests/mcseed42.png";
import seedImg43 from "@/assests/mcseed43.png";
import seedImg44 from "@/assests/mcseed44.png";
import seedImg45 from "@/assests/mcseed45.png";
import seedImg46 from "@/assests/mcseed46.png";
import seedImg47 from "@/assests/mcseed47.png";
import seedImg48 from "@/assests/mcseed48.png";
import seedImg49 from "@/assests/mcseed49.png";
import seedImg50 from "@/assests/mcseed50.png";
import seedImg51 from "@/assests/mcseed51.png";
import seedImg52 from "@/assests/mcseed52.png";
import radishpinkseedview1 from "@/assests/radishpinkseedview1.png";
import radishpinkseedview2 from "@/assests/radishpinkseedview2.png";
import radishpurplesingleview from "@/assests/radishpurplesingleview.png";
import radishwhitesingleview from "@/assests/radishwhitesingleview.png";
import redcabbagesingleviewseed from "@/assests/redcabbagesingleviewseed.png";
import RedCarrotMicrogreensSeedsview from "@/assests/RedCarrotMicrogreensSeedsview.png";
import RedCarrotMicrogreensSeedsview1 from "@/assests/RedCarrotMicrogreensSeedsview1.png";
import redkalesingleview1 from "@/assests/redkalesingleview1.png";
import redkalesingleview2 from "@/assests/redkalesingleview2.png";
import RedLentilMasoorSingleView from "@/assests/RedLentil(Masoor)SingleView.png";
import RedLentilMasoorSingleView1 from "@/assests/RedLentil(Masoor)SingleView1.png";
import rocketmicrogreenseedview from "@/assests/rocketmicrogreenseedview.png";
import rocketmicrogreenseedview1 from "@/assests/rocketmicrogreenseedview1.png";
import sesameseedview from "@/assests/sesameseedview.png";
import sesameseedview1 from "@/assests/sesameseedview1.png";
import sorghumseedview from "@/assests/sorghumseedview.png";
import sorghumseedview1 from "@/assests/sorghumseedview1.png";
import spinachseedview from "@/assests/spinachseedview.png";
import spinachseedview1 from "@/assests/spinachseedview1.png";
import sunflowerseedview from "@/assests/sunflowerseedview.png";
import sunflowerseedview1 from "@/assests/sunflowerseedview1.png";
import swisschadseedview from "@/assests/swisschadseedview.png";
import swisschadseedview1 from "@/assests/swisschadseedview1.png";
import turnipseedview from "@/assests/turnipseedview.png";
import turnipseedview1 from "@/assests/turnipseedview1.png";
import wheatgrassseedview from "@/assests/wheatgrassseedview.png";
import wheatgrassseedview1 from "@/assests/wheatgrassseedview1.png";
import yellowcarrotseedsingleview from "@/assests/yellowcarrotseedsingleview.png";
import yellowcarrotseedsingleview1 from "@/assests/yellowcarrotseedsingleview1.png";
import alfalfaseedview from "@/assests/alfalfaseedview.png";
import alfalfaseedview1 from "@/assests/alfalfaseedview1.png";
import amranthusseedview from "@/assests/amranthusseedview.png";
import amranthusseedview1 from "@/assests/amranthusseedview1.png";

type SeedRecord = {
  id: number;
  name: string;
  price: string;
  image: string;
};

type LinkedMicrogreenDetail = {
  scientificName?: string;
  flavorProfile?: string;
  growingTime?: string;
  difficulty?: string;
  description?: string[];
  culinaryUses?: string[];
  healthBenefits?: string[];
  gallery?: string[];
};

type SeedSinglePageDefaults = {
  packSizeLabel: string;
  bulkOrdersTitle: string;
  bulkOrdersText: string;
  scientificName: string;
  flavorProfile: string;
  growingTime: string;
  difficulty: string;
  description: string[];
  growingNotes: string[];
  bestFor: string[];
  healthHighlights: string[];
  growingParameters: string[];
  growingSteps: Array<{
    title: string;
    description: string;
  }>;
  infoSections: SeedInfoSection[];
};

export type SeedInfoSection = {
  title: string;
  description?: string;
  leadIn?: string;
  items?: string[];
  conclusion?: string;
};

type SeedSinglePageProductOverride = Partial<{
  baseName: string;
  packSizeLabel: string;
  bulkOrdersTitle: string;
  bulkOrdersText: string;
  scientificName: string;
  flavorProfile: string;
  growingTime: string;
  difficulty: string;
  description: string[];
  description1: string[];
  growingNotes: string[];
  bestFor: string[];
  healthHighlights: string[];
  infoSections: SeedInfoSection[];
  growingParameters: string[];
  growingSteps: Array<{
    title: string;
    description: string;
  }>;
  relatedProducts: string[];
  gallery: string[];
}>;

type SeedSinglePageData = {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  defaults: SeedSinglePageDefaults;
  products: Record<string, SeedSinglePageProductOverride>;
};

export type SeedProduct = SeedRecord & {
  slug: string;
  baseName: string;
  packSizeLabel: string;
  bulkOrdersTitle: string;
  bulkOrdersText: string;
  scientificName: string;
  flavorProfile: string;
  growingTime: string;
  difficulty: string;
  description: string[];
  description1: string[];
  growingNotes: string[];
  bestFor: string[];
  healthHighlights: string[];
  infoSections: SeedInfoSection[];
  growingParameters: string[];
  growingSteps: Array<{
    title: string;
    description: string;
  }>;
  relatedProducts: string[];
  gallery: string[];
};

export const seedImages: Record<string, StaticImageData> = {
  "seed-1": seedImg1,
  "seed-2": seedImg2,
  "seed-3": seedImg3,
  "seed-4": seedImg4,
  "seed-5": seedImg5,
  "seed-6": seedImg6,
  "seed-7": seedImg7,
  "seed-8": seedImg8,
  "seed-9": seedImg9,
  "seed-10": seedImg10,
  "seed-11": seedImg11,
  "seed-12": seedImg12,
  "seed-13": seedImg13,
  "seed-14": seedImg14,
  "seed-15": seedImg15,
  "seed-16": seedImg16,
  "seed-17": seedImg17,
  "seed-18": seedImg18,
  "seed-19": seedImg19,
  "seed-20": seedImg20,
  "seed-21": seedImg21,
  "seed-22": seedImg22,
  "seed-23": seedImg23,
  "seed-24": seedImg24,
  "seed-25": seedImg25,
  "seed-26": seedImg26,
  "seed-27": seedImg27,
  "seed-28": seedImg28,
  "seed-29": seedImg29,
  "seed-30": seedImg30,
  "seed-31": seedImg31,
  "seed-32": seedImg32,
  "seed-33": seedImg33,
  "seed-34": seedImg34,
  "seed-35": seedImg35,
  "seed-36": seedImg36,
  "seed-37": seedImg37,
  "seed-38": seedImg38,
  "seed-39": seedImg39,
  "seed-40": seedImg40,
  "seed-41": seedImg41,
  "seed-42": seedImg42,
  "seed-43": seedImg43,
  "seed-44": seedImg44,
  "seed-45": seedImg45,
  "seed-46": seedImg46,
  "seed-47": seedImg47,
  "seed-48": seedImg48,
  "seed-49": seedImg49,
  "seed-50": seedImg50,
  "seed-51": seedImg51,
  "seed-52": seedImg52,
  "radishpinkseedview1": radishpinkseedview1,
  "radishpinkseedview2": radishpinkseedview2,
  "radishpurplesingleview": radishpurplesingleview,
  "radishwhitesingleview": radishwhitesingleview,
  "redcabbagesingleviewseed": redcabbagesingleviewseed,
  "RedCarrotMicrogreensSeedsview": RedCarrotMicrogreensSeedsview,
  "RedCarrotMicrogreensSeedsview1": RedCarrotMicrogreensSeedsview1,
  "redkalesingleview1": redkalesingleview1,
  "redkalesingleview2": redkalesingleview2,
  "RedLentil(Masoor)SingleView": RedLentilMasoorSingleView,
  "RedLentil(Masoor)SingleView1": RedLentilMasoorSingleView1,
  "rocketmicrogreenseedview": rocketmicrogreenseedview,
  "rocketmicrogreenseedview1": rocketmicrogreenseedview1,
  "sesameseedview": sesameseedview,
  "sesameseedview1": sesameseedview1,
  "sorghumseedview": sorghumseedview,
  "sorghumseedview1": sorghumseedview1,
  "spinachseedview": spinachseedview,
  "spinachseedview1": spinachseedview1,
  "sunflowerseedview": sunflowerseedview,
  "sunflowerseedview1": sunflowerseedview1,
  "swisschadseedview": swisschadseedview,
  "swisschadseedview1": swisschadseedview1,
  "turnipseedview": turnipseedview,
  "turnipseedview1": turnipseedview1,
  "wheatgrassseedview": wheatgrassseedview,
  "wheatgrassseedview1": wheatgrassseedview1,
  "yellowcarrotseedsingleview": yellowcarrotseedsingleview,
  "yellowcarrotseedsingleview1": yellowcarrotseedsingleview1,
  "alfalfaseedview": alfalfaseedview,
  "alfalfaseedview1": alfalfaseedview1,
  "amranthusseedview": amranthusseedview,
  "amranthusseedview1": amranthusseedview1
};

const seedSinglePageData = seedSinglePage as SeedSinglePageData;
const seedSinglePageDefaults = seedSinglePageData.defaults;
export const seedFaqs = seedSinglePageData.faqs;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripSeedSuffix(name: string) {
  return name.replace(/\s+Microgreens Seeds$/i, "").trim();
}

function normalizeProductName(value: string) {
  return value.replace(/Ã¢â‚¬â„¢/g, "'");
}

function getLinkedMicrogreenDetail(seedName: string): LinkedMicrogreenDetail | null {
  const linkedSlug = slugify(normalizeProductName(seedName).replace(/\s+Seeds$/i, ""));
  const details =
    microgreenDetails.microgreens[
      linkedSlug as keyof typeof microgreenDetails.microgreens
    ];

  return details ?? null;
}

function getRelatedSeedNames(items: SeedRecord[], currentIndex: number) {
  return items
    .filter((_, index) => index !== currentIndex)
    .slice(currentIndex + 1, currentIndex + 5)
    .concat(items.slice(0, Math.max(0, currentIndex + 5 - items.length)))
    .slice(0, 4)
    .map((item) => item.name);
}

function fillTemplate(template: string, replacements: Record<string, string>) {
  return Object.entries(replacements).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template,
  );
}

function buildDefaultInfoSections(
  baseName: string,
  flavorProfile: string,
  bestFor: string[],
  healthHighlights: string[],
): SeedInfoSection[] {
  return [
    {
      title: "Flavor Profile",
      description: `${baseName} microgreens have ${flavorProfile.toLowerCase()}.`,
      leadIn: "They work especially well in:",
      items: bestFor.slice(0, 4),
    },
    {
      title: "Nutritional Highlights",
      description: `${baseName} microgreens offer a nutrient-dense harvest with useful everyday wellness benefits.`,
      items: healthHighlights.slice(0, 4),
    },
    {
      title: "Yield Information",
      description:
        "Yield can vary based on sowing density, tray size, airflow, and harvest stage.",
      items: [
        "Use even seed coverage for a dense canopy",
        "Maintain steady moisture for uniform germination",
        "Harvest on time for the best fresh weight",
      ],
    },
    {
      title: "Ideal Growing Conditions",
      items: [
        "Temperature: 18°C - 26°C",
        "Light: Indirect sunlight or grow lights",
        "Humidity: Moderate airflow",
      ],
    },
  ];
}

function buildDefaultGrowingParameters(baseName: string, growingTime: string): string[] {
  const soakingRequired = baseName.toLowerCase().includes('lentil') || 
                         baseName.toLowerCase().includes('pea') || 
                         baseName.toLowerCase().includes('sunflower') ||
                         baseName.toLowerCase().includes('mung');
  
  return [
    `Seed Soaking: ${soakingRequired ? '4-8 hours' : 'Not Required'}`,
    "Germination Time: 2-3 days",
    "Blackout Period: 2-3 days",
    `Harvest Time: ${growingTime}`,
    "Watering: Light misting 1-2 times daily"
  ];
}

function buildDefaultGrowingSteps(baseName: string, growingTime: string): Array<{title: string, description: string}> {
  return [
    {
      title: "Prepare the tray:",
      description: "Fill a shallow tray with cocopeat or another growing medium and level the surface evenly."
    },
    {
      title: "Sow the seeds:",
      description: `Evenly sprinkle ${baseName} seeds across the tray without overcrowding.`
    },
    {
      title: "Mist gently:",
      description: "Lightly mist the tray to keep the growing medium evenly moist."
    },
    {
      title: "Blackout phase:",
      description: "Cover the tray and keep it in a dark place for 2-3 days to allow seeds to germinate."
    },
    {
      title: "Move to light:",
      description: "Once sprouts appear, remove the cover and place the tray under indirect sunlight or grow lights."
    },
    {
      title: "Maintain moisture:",
      description: "Lightly mist the tray once or twice daily to keep the medium moist."
    },
    {
      title: "Ensure airflow:",
      description: "Keep the tray in a well-ventilated area to support healthy growth."
    },
    {
      title: "Harvest:",
      description: `Harvest in ${growingTime} when microgreens reach 2-3 inches in height.`
    }
  ];
}

export const seedProducts: SeedProduct[] = (products as SeedRecord[]).map(
  (product, index, allProducts) => {
    const normalizedName = normalizeProductName(product.name);
    const linkedDetail = getLinkedMicrogreenDetail(normalizedName);
    const slug = slugify(normalizedName);
    const baseName = stripSeedSuffix(normalizedName);
    const override = seedSinglePageData.products[slug];
    const effectiveBaseName = override?.baseName ?? baseName;
    const growingTime =
      override?.growingTime ??
      linkedDetail?.growingTime ??
      seedSinglePageDefaults.growingTime;
    const growingTimeNote =
      linkedDetail?.growingTime ??
      override?.growingTime ??
      "about 7-14 days";
    const flavorProfile =
      override?.flavorProfile ??
      linkedDetail?.flavorProfile ??
      seedSinglePageDefaults.flavorProfile;
    const bestFor =
      override?.bestFor ??
      linkedDetail?.culinaryUses?.slice(0, 4) ??
      seedSinglePageDefaults.bestFor;
    const healthHighlights =
      override?.healthHighlights ??
      linkedDetail?.healthBenefits?.slice(0, 4) ??
      seedSinglePageDefaults.healthHighlights;

    return {
      ...product,
      name: normalizedName,
      slug,
      baseName: effectiveBaseName,
      packSizeLabel:
        override?.packSizeLabel ?? seedSinglePageDefaults.packSizeLabel,
      bulkOrdersTitle:
        override?.bulkOrdersTitle ?? seedSinglePageDefaults.bulkOrdersTitle,
      bulkOrdersText:
        override?.bulkOrdersText ?? seedSinglePageDefaults.bulkOrdersText,
      scientificName:
        override?.scientificName ??
        linkedDetail?.scientificName ??
        seedSinglePageDefaults.scientificName,
      flavorProfile,
      growingTime,
      difficulty:
        override?.difficulty ??
        linkedDetail?.difficulty ??
        seedSinglePageDefaults.difficulty,
      description:
        override?.description ??
        linkedDetail?.description ??
        seedSinglePageDefaults.description.map((item) =>
          fillTemplate(item, { baseName: effectiveBaseName }),
        ),
      description1: override?.description1 ?? [],
      growingNotes:
        override?.growingNotes ??
        seedSinglePageDefaults.growingNotes.map((item) =>
          fillTemplate(item, {
            baseName: effectiveBaseName,
            growingTimeNote,
          }),
        ),
      bestFor,
      healthHighlights,
      infoSections:
        override?.infoSections ??
        buildDefaultInfoSections(
          effectiveBaseName,
          flavorProfile,
          bestFor,
          healthHighlights,
        ),
      growingParameters:
        override?.growingParameters ??
        seedSinglePageDefaults.growingParameters.map((param) =>
          fillTemplate(param, { baseName: effectiveBaseName, growingTime }),
        ),
      growingSteps:
        override?.growingSteps ??
        buildDefaultGrowingSteps(effectiveBaseName, growingTime),
      relatedProducts:
        override?.relatedProducts ?? getRelatedSeedNames(allProducts, index),
      gallery:
        override?.gallery ??
        [product.image, linkedDetail?.gallery?.[0]]
          .filter((value): value is string => Boolean(value))
          .filter((value, galleryIndex, galleryItems) =>
            galleryItems.indexOf(value) === galleryIndex,
          ),
    };
  },
);

export function getSeedProduct(slug: string) {
  return seedProducts.find((product) => product.slug === slug);
}

export function formatSeedPrice(price: string) {
  return `\u20b9${price}`;
}
