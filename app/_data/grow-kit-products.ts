import type { StaticImageData } from "next/image";

import scaleDetailImage from "@/assests/alistonweighting1.png";
import scaleInfoImage from "@/assests/alistonweighting2.png";
import scaleInfoImage3 from "@/assests/alistonweighting3.png";
import pressureSprayerImage from "@/assests/kit5.png";
import cocopeatImage from "@/assests/kit3.png";
import trayImage from "@/assests/kit1.png";
import handSprayerImage from "@/assests/kit2.png";
import phMeterImage from "@/assests/kit3.png";
import phMeterImage1 from "@/assests/kit6.png";
import trayMeterImage from "@/assests/kit4.png";
import spray1 from "@/assests/A2Agrospray1.png";
import spray2 from "@/assests/A2Agrospray2.png";
import IFFCO1 from "@/assests/IFFCO1.png";
import IFFCO2 from "@/assests/IFFCO2.png";
import IFFCO3 from "@/assests/IFFCO3.png";
import tray1 from "@/assests/Tray1.png";
import tray2 from "@/assests/Tray2.png";
import tray3 from "@/assests/Tray3.png";
import orileySpray1 from "@/assests/OrileyWaterSpray1.png";
import orileySpray2 from "@/assests/OrileyWaterSpray2.png";
import orileySpray3 from "@/assests/OrileyWaterSpray3.png";
import phmtr1 from "@/assests/phmtr1.png";
import phmtr2 from "@/assests/phmtr2.png";
import phmtr3 from "@/assests/phmtr3.png";

export type GrowKitProduct = {
  slug: string;
  name: string;
  price: number;
  image: StaticImageData;
  gallery: StaticImageData[];
  shortDescription: string;
  description: string;
  highlights: string[];
  featureDetails?: {
    title: string;
    items: Array<{
      heading?: string;
      description: string;
    }>;
  };
  usageSteps?: string[];
};

export const growKitProducts: GrowKitProduct[] = [
  {
    slug: "aliston-atom-weighing-scale-sf-400",
    name: "Aliston Atom Weighing Scale (SF-400)",
    price: 215,
    image: trayImage,
    gallery: [trayImage, scaleDetailImage, scaleInfoImage, scaleInfoImage3],
    shortDescription:
      "Measure right. Grow better. This digital weighing scale helps you portion seeds accurately and maintain repeatable sowing results.",
    description:
      "A compact digital scale built for everyday microgreen prep. Use it to weigh seeds, nutrients, and small batches with better consistency before every grow cycle.",
    highlights: [
      "Accurate measurement for repeatable seed portions",
      "Compact design that fits neatly into your grow setup",
      "Consistent results for sowing, feeding, and prep work",
    ],
    featureDetails: {
      title: "Key Features:",
      items: [
        {
          heading: "High precision digital measurement:",
          description:
            "Equipped with advanced sensors for quick and accurate measurements, to make your healthy recipes deliciously perfect.",
        },
        {
          heading: "Ideal for seed/microgreens portioning:",
          description:
            "Versatile measurement range, measures in grams/oz with a broad range of 1 - 10000 g, accommodating a wide variety of ingredients for all your culinary needs.",
        },
        {
          heading: "Compact and easy to store:",
          description:
            "Whether you're measuring portions for a diet, tracking calories, or prepping meals, this weighing scale for kitchen is your go-to weight machine for food and all other kitchen tasks.",
        },
        {
          heading: "TARE Functionality:",
          description:
            "Easily calculate the net weight of ingredients by subtracting empty bowl or the container weight. Touch the TARE button to reset the scale back to zero and weigh ingredients by adding it in to the same container.",
        },
      ],
    },
    usageSteps: [
      "Turn on the scale",
      "Place container and tare",
      "Add seeds as required",
      "Measure accurately",
      "Use recommended quantities",
      "Clean after use",
      "Avoid moisture exposure",
      "Store safely",
    ],
  },
  {
    slug: "a2agro-water-spray-bottle-5-litres-pressure-sprayer",
    name: "A2Agro Water Spray Bottle (5 Litres - Pressure Sprayer)",
    price: 999,
    image: pressureSprayerImage,
    gallery: [pressureSprayerImage, spray1, spray2],
    shortDescription:
      "A pressure sprayer for evenly misting trays, cocopeat, and seedlings.",
    description:
      "A larger spray bottle designed for steady watering across multiple trays while keeping moisture distribution controlled.",
    highlights: [
      "Large 5 litre capacity",
      "Even pressure-based misting",
      "Useful for home and small batch grow setups",
    ],
    featureDetails: {
      title: "Key Features:",
      items: [
        {
          description:
            "5L large capacity tank- ideal for multiple trays",
        },
        {
          description:
            "Multi-purpose sprayer suitable for misting, watering, and other gardening use with consistent coverage",
        },
        {
          description:
            "Built-in safety valve prevents over-pressurisation while ensuring steady spray output",
        },
        {
          description:
            "Constructed with high-quality materials featuring corrosion-resistant components and leak-proof seals",
        },
      ],
    },
    usageSteps: [
      "Fill tank with water",
      "Pump to build pressure",
      "Adjust nozzle as needed",
      "Spray evenly across trays",
      "Avoid over-saturation",
      "Release pressure after use",
      "Clean regularly",
      "Store safely",
    ],
  },
  {
    slug: "iffco-urban-garden-horti-coir-cocopeat-block-5kg",
    name: "IFFCO Urban Garden Horti Coir Cocopeat Block (5kg)",
    price: 359,
    image: cocopeatImage,
    gallery: [cocopeatImage, IFFCO1, IFFCO2, IFFCO3],
    shortDescription:
      "Compressed cocopeat block for creating a clean, moisture-retentive growing base.",
    description:
      "A grow medium that expands when hydrated and provides a stable base for healthy germination and root support.",
    highlights: [
      "Good moisture retention",
      "Clean and easy to store",
      "Suitable for tray-based microgreen growing",
    ],
    featureDetails: {
      title: "Key Features:",
      items: [
        {
          description:
            "100% organic and natural.",
        },
        {
          description:
            "Pre-Washed for low EC.",
        },
        {
          description:
            "High expansion rate creating large volume.",
        },
        {
          description:
            "High water holding capacity, reducing watering frequency.",
        },
        {
          description:
            "enhances drainage and aeration, promotes stronger root growth and plant life.",
        },
        {
          description:
            "Renewable resource and environmental friendly",
        },
      ],
    },
    usageSteps: [
      "Break apart the required amount.",
      "Allow the dry cocopeat to sit for 10-15 mins till it becomes loose.",
      "The loose cocopeat is ready for use",
    ],
  },
  {
    slug: "microgreen-growing-tray-with-drain-holes",
    name: "Microgreen Growing Tray With Drain Holes",
    price: 249,
    image: trayMeterImage,
    gallery: [trayMeterImage, tray1, tray2, tray3],
    shortDescription:
      "Durable tray with drainage support for more controlled watering.",
    description:
      "A practical growing tray that supports airflow and drainage while keeping your microgreen setup simple and stackable.",
    highlights: [
      "Supports cleaner watering cycles",
      "Easy to stack and handle",
      "Built for repeated grow use",
    ],
    featureDetails: {
      title: "Key Features:",
      items: [
        {
          description:
            "Durable plastic construction",
        },
        {
          description:
            "Drain holes for better water management",
        },
        {
          description:
            "Stackable design for storage",
        },
        {
          description:
            "Easy to clean and reuse",
        },
      ],
    },
    usageSteps: [
      "Place cocopeat in tray with holes",
      "Add water to expand medium",
      "Level evenly",
      "Sprinkle seeds uniformly",
      "Mist lightly",
      "Cover for germination",
      "Remove cover after sprouting",
      "Water from bottom tray",
    ],
  },
  {
    slug: "hand-pressure-spray-bottle-for-home-gardens",
    name: "Hand Pressure Spray Bottle For Home Gardens",
    price: 449,
    image: handSprayerImage,
    gallery: [handSprayerImage, orileySpray1, orileySpray2, orileySpray3],
    shortDescription:
      "Compact hand sprayer for misting microgreens and keeping seedlings hydrated.",
    description:
      "A smaller hand-pressure sprayer that works well for home growers who want quick control during germination and early growth.",
    highlights: [
      "Easy manual spraying",
      "Good for compact home setups",
      "Helps prevent overwatering",
    ],
    featureDetails: {
      title: "Key Features:",
      items: [
        {
          description:
            "Adjustable fine mist nozzle for even watering",
        },


        {
          description:
            "Lightweight & easy to use",
        },
        {
          description:
            "Ideal for daily microgreens care",
        },
        {
          description:
            "Leak-Resistant Seal",
        },
        {
          description:
            "Ergonimic Design",
        },
        {
          description:
            "Withstand the rigors of everyday use",
        },
        {
          description:
            "Versatile use- misting, watering etc…",
        }
      ],
    },
    usageSteps: [
      "Fill bottle with clean water",
      "Adjust nozzle for mist spray",
      "Spray evenly across tray surface",
      "Avoid overwatering",
      "Use 1–2 times daily as needed",
      "Maintain consistent moisture",
      "Clean nozzle regularly",
      "Store in dry place after use",
    ],
  },

  {
    slug: "digital-ph-meter-for-hydroponic-growing",
    name: "Digital PH Meter For Hydroponic Growing",
    price: 699,
    image: phMeterImage1,
    gallery: [phMeterImage1, phmtr1, phmtr2, phmtr3],
    shortDescription:
      "A digital meter for checking pH balance in water-based growing systems.",
    description:
      "Useful for growers who want more control over nutrient water conditions and stable hydroponic performance.",
    highlights: [
      "Quick digital readings",
      "Supports pH monitoring",
      "Useful for hydroponic maintenance",
    ],
    featureDetails: {
      title: "Key Features:",
      items: [
        {
          heading: "High accuracy pH readings:",
          description:
            "Only takes a few seconds to show accurate and stable reading.",
        },
        {
          heading: "Digital display for easy use:",
          description:
            "Press CAL for 5 seconds to enter the calibration mode, select the powers corresponding to 6.86/4/9.18 to complete the calibration.The pH value of any solution can be tested by just immersing the probe of the pH meter.",
        },
        {
          heading: "Compact and portable:",
          description:
            "pH meter could be used to test drinking water, swimming pools, pH balance in aquarium, RO system, spa or hydroponics.",
        },
        {
          heading: "Improves nutrient efficiency:",
          description:
            "bring you healthy drinking water, fruit juice, chili sauce, seasoning sauce.At the same time, if you have aquatic pets, the pH tester is also a perfect tool to ensure the safety of the pet’s water source.",
        },
        {
          heading: "Automatic Temperature Compensation:",
          description:
            "Adjusts to Water Temperatures and Water Quality.",
        },
      ],
    },
    usageSteps: [
      "Turn on the pH meter",
      "Dip probe into water sample",
      "Wait for stable reading",
      "Note pH level",
      "Adjust water if required",
      "Clean probe after use",
      "Store properly",
      "Calibrate periodically",
    ],
  },
];

export function getGrowKitProduct(slug: string) {
  return growKitProducts.find((product) => product.slug === slug);
}

export function formatInrPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(price);
}
