import type { StaticImageData } from "next/image";

import products from "@/app/_data/microseeds-products.json";
import microgreenDetails from "@/app/_data/microgreen-details.json";
import seedImg1 from "@/assests/microgreen1.jpg";
import seedImg2 from "@/assests/microgreen2.jpg";
import seedImg3 from "@/assests/microgreen3.jpg";
import seedImg4 from "@/assests/microgreen4.jpg";
import seedImg5 from "@/assests/microgreen5.jpg";
import seedImg6 from "@/assests/microgreen6.png";
import seedImg7 from "@/assests/microgreen7.jpg";
import seedImg8 from "@/assests/microgreen8.jpg";
import seedImg9 from "@/assests/microgreen9.png";
import seedImg10 from "@/assests/microgreen10.jpg";
import seedImg11 from "@/assests/microgreen11.jpg";
import seedImg12 from "@/assests/microgreen12.png";
import seedImg13 from "@/assests/microgreen13.png";
import seedImg14 from "@/assests/microgreen14.jpg";
import seedImg15 from "@/assests/microgreen15.png";
import seedImg16 from "@/assests/microgreen16.jpg";
import seedImg17 from "@/assests/microgreen17.png";
import seedImg18 from "@/assests/microgreen18.jpg";
import seedImg19 from "@/assests/microgreen19.jpg";
import seedImg20 from "@/assests/microgreen20.png";
import seedImg21 from "@/assests/microgreen21.jpg";
import seedImg22 from "@/assests/microgreen22.jpg";
import seedImg23 from "@/assests/microgreen23.jpg";
import seedImg24 from "@/assests/microgreen24.jpg";
import growIcon from "@/assests/fertilizerfree.png";
import harvestIcon from "@/assests/pesticidefree.png";
import nonGmoIcon from "@/assests/non-gmo1.png";
import organicIcon from "@/assests/ro-water-01.png";
import Alfalfa1 from "@/assests/alfalfaview1.png";
import Alfalfa2 from "@/assests/alfalfaview2.png";
import Alfalfa3 from "@/assests/alfalfaview3.png";
import Alfalfa4 from "@/assests/alfalfaview4.png";
import Amaranthusview1 from "@/assests/Amaranthusview1.jpg";
import Amaranthusview2 from "@/assests/Amaranthusview2.jpg";
import Amaranthusview3 from "@/assests/Amaranthusview3.jpg";
import Basilview1 from "@/assests/Basilview1.jpg";
import Basilview2 from "@/assests/Basilview2.jpg";
import Basilview3 from "@/assests/Basilvie3.jpg";
import Beetrootview1 from "@/assests/Beetrootview1.jpg";
import Beetrootview2 from "@/assests/Beetrootview2.jpg";
import Beetrootview3 from "@/assests/Beetrootview3.jpg";
import Broccoliview1 from "@/assests/Broccoliview1.jpg";
import Broccoliview2 from "@/assests/Broccoliview2.jpg";
import Broccoliview3 from "@/assests/Broccoliview3.jpg";
import Carrotview from "@/assests/carrotview.png";
import ChineseCabbageview1 from "@/assests/ChineseCabbageview1.jpg";
import ChineseCabbageview2 from "@/assests/ChineseCabbageview2.jpg";
import ChineseCabbageview3 from "@/assests/ChineseCabbageview3.jpg";
import Cornview1 from "@/assests/Cornview1.jpg";
import Cornview2 from "@/assests/Cornview2.jpg";
import Cornview3 from "@/assests/Cornview3.jpg";
import fenugreekview from "@/assests/fenugreekview.png";
import GreenMustardview1 from "@/assests/GreenMustardview1.jpg";
import GreenMustardview2 from "@/assests/GreenMustardview2.jpg";
import GreenMustardview3 from "@/assests/GreenMustardview3.jpg";
import KaleMicrogreenview from "@/assests/KaleMicrogreenview.jpg";
import KaleMicrogreenview1 from "@/assests/KaleMicrogreenview1.jpg";
import Kohlrabiview from "@/assests/Kohlrabiview.png";
import pakchoiview from "@/assests/pakchoiview.png";
import Peasshootsview1 from "@/assests/Peasshootsview1.jpg";
import Peasshootsview2 from "@/assests/Peasshootsview2.jpg";
import Peasshootsview3 from "@/assests/Peasshootsview3.jpg";
import radishview from "@/assests/radishview.png";
import RadishPinkview from "@/assests/RadishPinkview.jpg";
import RadishPinkview1 from "@/assests/RadishPinkview1.jpg";
import RadishPinkview2 from "@/assests/RadishPinkview2.jpg";
import RadishPurpleview from "@/assests/radishpurpleview.png";
import RadishWhiteview1 from "@/assests/RadishWhiteview1.jpg";
import RadishWhiteview2 from "@/assests/RadishWhiteview2.jpg";
import RadishWhiteview3 from "@/assests/RadishWhiteview3.jpg";
import RedCabbageview1 from "@/assests/RedCabbageview1.jpg";
import RedCabbageview2 from "@/assests/RedCabbageview2.jpg";
import RedCabbageview3 from "@/assests/RedCabbageview3.jpg";
import redlentilview from "@/assests/redlentilview.png";
import RocketArugulaview1 from "@/assests/RocketArugulaview1.jpg";
import RocketArugulaview2 from "@/assests/RocketArugulaview2.jpg";
import RocketArugulaview3 from "@/assests/RocketArugulaview3.jpg";
import SpinachMicrogreenview1 from "@/assests/SpinachMicrogreenview1.jpg";
import SpinachMicrogreenview2 from "@/assests/SpinachMicrogreenview2.jpg";
import SpinachMicrogreenview3 from "@/assests/SpinachMicrogreenview3.jpg";
import SunflowerMicrogreenview1 from "@/assests/SunflowerMicrogreenview1.jpg";
import SunflowerMicrogreenview2 from "@/assests/SunflowerMicrogreenview2.jpg";
import SunflowerMicrogreenview3 from "@/assests/SunflowerMicrogreenview3.jpg";
import WheatgrassMicrogreenview1 from "@/assests/WheatgrassMicrogreenview1.jpg";
import WheatgrassMicrogreenview2 from "@/assests/WheatgrassMicrogreenview2.jpg";
import WheatgrassMicrogreenview3 from "@/assests/WheatgrassMicrogreenview3.jpg";

type ProductSeed = {
  id: number;
  name: string;
  price: string;
  image: string;
};

type MicrogreenDetail = {
  name: string;
  scientificName: string;
  flavorProfile: string;
  texture: string;
  color: string;
  nutrition: string;
  growingTime: string;
  difficulty: string;
  description: string[];
  about: string[];
  culinaryUses: string[];
  healthBenefits: string[];
  storage: string;
  gallery: string[];
  relatedProducts: string[];
};

export type MicrogreenProduct = ProductSeed & {
  slug: string;
  description: string[];
  gallery: string[];
  details: MicrogreenDetail;
  about?: string[];
};

export const microgreenImages: Record<string, StaticImageData> = {
"alfalfa1": Alfalfa1,
"alfalfa2": Alfalfa2,
"alfalfa3": Alfalfa3,
"alfalfa4": Alfalfa4,
"Amaranthusview1": Amaranthusview1,
"Amaranthusview2": Amaranthusview2,
"Amaranthusview3": Amaranthusview3,
"Basilview1": Basilview1,
"Basilview2": Basilview2,
"Basilview3": Basilview3,
"Beetrootview1": Beetrootview1,
"Beetrootview2": Beetrootview2,
"Beetrootview3": Beetrootview3,
"Broccoliview1": Broccoliview1,
"Broccoliview2": Broccoliview2,
"Broccoliview3": Broccoliview3,
"Carrotview": Carrotview,
"ChineseCabbageview1": ChineseCabbageview1,
"ChineseCabbageview2": ChineseCabbageview2,
"ChineseCabbageview3": ChineseCabbageview3,
"Cornview1": Cornview1,
"Cornview2": Cornview2,
"Cornview3": Cornview3,
"fenugreekview": fenugreekview,
"GreenMustardview1": GreenMustardview1,
"GreenMustardview2": GreenMustardview2,
"GreenMustardview3": GreenMustardview3,
"KaleMicrogreenview": KaleMicrogreenview,
"KaleMicrogreenview1": KaleMicrogreenview1,
"Kohlrabiview": Kohlrabiview,
"pakchoiview": pakchoiview,
"Peasshootsview1": Peasshootsview1,
"Peasshootsview2": Peasshootsview2,
"Peasshootsview3": Peasshootsview3,
"radishview": radishview,
"RadishPinkview": RadishPinkview,
"RadishPinkview1": RadishPinkview1,
"RadishPinkview2": RadishPinkview2,
"radishpurpleview": RadishPurpleview,
"RadishWhiteview1": RadishWhiteview1,
"RadishWhiteview2": RadishWhiteview2,
"RadishWhiteview3": RadishWhiteview3,
"RedCabbageview1": RedCabbageview1,
"RedCabbageview2": RedCabbageview2,
"RedCabbageview3": RedCabbageview3,
"redlentilview": redlentilview,
"RocketArugulaview1": RocketArugulaview1,
"RocketArugulaview2": RocketArugulaview2,
"RocketArugulaview3": RocketArugulaview3,
"SpinachMicrogreenview1": SpinachMicrogreenview1,
"SpinachMicrogreenview2": SpinachMicrogreenview2,
"SpinachMicrogreenview3": SpinachMicrogreenview3,
"SunflowerMicrogreenview1": SunflowerMicrogreenview1,
"SunflowerMicrogreenview2": SunflowerMicrogreenview2,
"SunflowerMicrogreenview3": SunflowerMicrogreenview3, 
"WheatgrassMicrogreenview1": WheatgrassMicrogreenview1,
"WheatgrassMicrogreenview2": WheatgrassMicrogreenview2,
"WheatgrassMicrogreenview3": WheatgrassMicrogreenview3,

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
};

export const microgreenCertifications = [
  {
    label: "Non GMO Seeds",
    image: nonGmoIcon,
  },
  {
    label: "No Fertilizers",
    image: growIcon,
  },
  {
    label: "No Pesticides",
    image: harvestIcon,
  },
  {
    label: "RO Water Grown",
    image: organicIcon,
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getMicrogreenDetails(productName: string): MicrogreenDetail {
  const slug = slugify(productName);
  const details = microgreenDetails.microgreens[slug as keyof typeof microgreenDetails.microgreens];
  
  if (!details) {
    throw new Error(`No details found for microgreen: ${productName} (${slug})`);
  }
  
  return details;
}

export const microgreenProducts: MicrogreenProduct[] = (
  products as ProductSeed[]
).map((product) => {
  const details = getMicrogreenDetails(product.name);
  
  return {
    ...product,
    slug: slugify(product.name),
    description: details.description,
    gallery: details.gallery,
    details: details,
  };
});

export function getMicrogreenProduct(slug: string) {
  return microgreenProducts.find((product) => product.slug === slug);
}

export function formatMicrogreenPrice(price: string) {
  return `\u20b9${price}`;
}
