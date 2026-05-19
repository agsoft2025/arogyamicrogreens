import Image from "next/image";
import tray from "@/assests/Tray Image.webp";
import badges from "@/assests/Badges banner.png"

const MicrogreenTray = () => {
    return (
        <section className="grid md:grid-cols-1 items-center gap-12 pb-20 max-w-6xl mx-auto px-6 text-center">

            {/* Content */}

            <h1 className="mt-4 text-4xl md:text-2xl font-bold leading-tight text-gray-500">
                <span className="text-primary">Microgreens</span> contain up to <span className="text-primary">40x</span> more nutrients than mature vegetables — tiny greens with <span className="text-primary">powerful health benefits</span>
            </h1>

            {/* Image */}
            <div className="relative h-125 overflow-hidden rounded-4xl shadow-2xl group">
                <Image
                    src={tray}
                    alt="Microgreen Tray"
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            </div>

            <div className="relative h-105 overflow-hidden rounded-4xl shadow-2xl group">
                <Image
                    src={badges}
                    alt="Microgreen Tray"
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                />  
            </div>

        </section>
    );
};

export default MicrogreenTray;