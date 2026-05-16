"use client";

import { motion } from "framer-motion";
import { microgreens } from "@/data/microgreens";
import Image from "next/image";
import { highlightWords } from "@/data/highlightwords";

export default function MicrogreenPage() {

    const highlightText = (text: string) => {
        const regex = new RegExp(`(${highlightWords.join("|")})`, "gi");

        return text.split(regex).map((part, i) =>
            highlightWords.includes(part) ? (
                <span key={i} className="font-bold text-black">
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold text-center text-primary"
                >
                    Microgreens Collection
                </motion.h1>

                <p className="text-center text-gray-600 mt-4">
                    Explore our nutrient-rich microgreens and their health benefits
                </p>

                {/* Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {microgreens.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
                        >

                            {/* Image */}
                            <div className="relative h-52 w-full">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover hover:scale-110 transition duration-500"
                                />
                            </div>

                            {/* Title */}
                            <div className="p-5">
                                <h2 className="text-xl font-bold text-primary mb-3">
                                    {item.title}
                                </h2>

                                {/* Benefits */}
                                <div className="space-y-2">
                                    {item.benefits.map((benefit, i) => (
                                        <p key={i} className="text-sm text-gray-600">
                                            • {highlightText(benefit)}
                                        </p>
                                    ))}
                                </div>
                            </div>

                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}