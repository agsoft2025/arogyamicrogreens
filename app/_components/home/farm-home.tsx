import { BsArrowRight } from "react-icons/bs";
import growImg from "@/assests/grow-1-01.png";
import harvestImg from "@/assests/harvest-01.png";
import packImg from "@/assests/pack-f-01.png";
import deliverImg from "@/assests/deliver-logo-01.png";

const card = [
    {
        id:1,
        title: "GROW",
        img: growImg,
    },
    {
        id:2,
        title: "HARVEST",
        img: harvestImg,
    },
    {
        id:3,
        title: "PACK",
        img: packImg,
    },
    {
        id:4,
        title: "DELIVER",
        img: deliverImg,
    }
]

export function FarmHome() {
  return (
    <div className="py-20 md:py-24 max-w-6xl mx-auto">
      <h1 className="text-xl text-[#71ac43] font-bold text-center pb-10">
        Farm <span className="inline-block align-middle"><BsArrowRight /></span> Home
      </h1>
      <h2 className="text-4xl font-bold text-center pb-2">How it works</h2>
      <p className="text-center pb-10">We harvest microgreens only after your order is placed, ensuring maximum freshness and nutrition.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {card.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg">
            <img src={item.img.src} alt={item.title} className="w-full h-auto" />
            <h3 className="text-xl font-bold text-center">{item.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}