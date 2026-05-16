import React from 'react'
import { FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn, FaWhatsapp, FaMapPin, FaMapMarkerAlt } from "react-icons/fa";

const socials = [
    { name: "instagram", icon: FaInstagram, route: "https://www.instagram.com/mgmhyd" },
    { name: "facebook", icon: FaFacebookF, route: "https://www.facebook.com/mgmhyd" }
];

const Page = () => {
    return (
        <div className='max-w-7xl m-auto py-10'>
            <div>
                <h1 className='text-2xl font-bold'>GET IN TOUCH</h1>
                <p className='py-2 max-w-5xl'>Please enter the details of your request. A member of our support staff will respond as soon as possible.</p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-[60%_40%] gap-20 items-center'>

                {/* Contact Form */}
                <div>
                    <form className='flex flex-col gap-5'>
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="w-full rounded-xl border border-[#d9e6db] bg-white px-4 py-3 outline-none focus:border-primary"
                        />

                        <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full rounded-xl border border-[#d9e6db] bg-white px-4 py-3 outline-none focus:border-primary"
                        />

                        <input
                            type="tel"
                            placeholder="Phone Number"
                            className="w-full rounded-xl border border-[#d9e6db] bg-white px-4 py-3 outline-none focus:border-primary"
                        />

                        <textarea
                            rows={6}
                            placeholder="Your Message"
                            className="w-full rounded-xl border border-[#d9e6db] bg-white px-4 py-3 outline-none focus:border-primary resize-none"
                        />

                        <button
                            type="submit"
                            className="w-fit rounded-xl bg-primary px-8 py-3 font-semibold text-black transition hover:scale-105"
                        >
                            Send Message
                        </button>
                    </form>
                </div>

                {/* Contact Info */}
                <div>
                    <div className='flex flex-col text-xl gap-2'>
                        <p>
                            <span className='font-bold'>Address:</span> Hyderabad
                        </p>

                        <p>
                            <span className='font-bold'>Email:</span> example@gmail.com
                        </p>

                        <p>
                            <span className='font-bold'>Call Us:</span> +91 9876543210
                        </p>

                        <p>
                            <span className='font-bold'>Support:</span> +91 9876543210
                        </p>
                    </div>

                    <h1 className='text-2xl font-bold mt-10'>Follow Us</h1>

                    <div className='flex gap-3 mt-4'>
                        {socials.map((social) => {
                            const Icon = social.icon;

                            return (
                                <a
                                    key={social.name}
                                    href={social.route}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.name}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ccc]/30 text-[#1d2d19] transition hover:bg-white hover:scale-110"
                                >
                                    <Icon size={18} color="#000" />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page