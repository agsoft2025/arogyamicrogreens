"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Logo from "../assests/Logo.png";

import {
    MapPin,
    Phone,
    Mail,
    Building2,
    MessageCircle,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { ImInstagram } from "react-icons/im";
import { BsYoutube } from "react-icons/bs";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-primary text-white mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 items-center gap-10">

                {/* Logo Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center overflow-hidden">
                        <Image
                            src={Logo}
                            alt="logo"
                            width={100}
                            height={100}
                            className="object-contain"
                        />
                    </div>
                </motion.div>

                {/* Menu */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Menu</h3>

                    <ul className="space-y-3 text-gray-300">
                        <li className="hover:text-white transition">
                            <Link href="/">Home</Link>
                        </li>

                        <li className="hover:text-white transition">
                            <Link href="/subscription-plan">Subscription Plan</Link>
                        </li>

                        <li className="hover:text-white transition">
                            <Link href="/microgreen">Microgreen</Link>
                        </li>

                        <li className="hover:text-white transition">
                            <Link href="/products">Products</Link>
                        </li>

                        <li className="hover:text-white transition">
                            <Link href="/contact-us">Contact Us</Link>
                        </li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">
                        Get In Touch
                    </h3>

                    <div className="space-y-4 text-gray-300">

                        <div className="flex items-start gap-3">
                            <MapPin size={20} className="mt-1 shrink-0" />
                            <p>Chennai, Tamil Nadu</p>
                        </div>

                        <div className="flex items-start gap-3">
                            <Phone size={20} className="mt-1 shrink-0" />
                            <div>
                                <p>+91 0000000000</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <FaWhatsapp className="text-xl mt-1 shrink-0" />
                            <div>
                                <p>+91 0000000000</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Mail size={20} className="mt-1 shrink-0" />
                            <p>agrinest@microgreens@gmail.com</p>
                        </div>

                        <div className="flex items-start gap-3">
                            <Building2 size={20} className="mt-1 shrink-0" />
                            <p>
                                5th Floor, Plot No:359,
                                Gokul Plots, KPHB 9th Phase,
                                Hyderabad - 500085
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            {/* Social links */}
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 pb-6 px-6">

                {/* Instagram */}
                <a
                    href="https://www.instagram.com/mgmhyd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white/10 border border-white/10
    flex items-center justify-center text-white text-xl
    hover:bg-linear-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600
    hover:scale-110 transition-all duration-300"
                >
                    <ImInstagram />
                </a>

                {/* YouTube */}
                <a
                    href="https://www.youtube.com/@mgmhyd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white/10 border border-white/10 
    flex items-center justify-center text-white text-xl
    hover:bg-red-600 hover:scale-110 transition-all duration-300"
                >
                    <BsYoutube />
                </a>

            </div>

            {/* Bottom */}
            <div className="border-t border-white/10 py-4 text-center text-gray-400 text-sm">
                © 2026 Agrinest. All rights reserved.
            </div>
        </footer>
    );
}