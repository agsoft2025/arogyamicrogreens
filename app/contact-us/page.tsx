"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { BsInstagram, BsYoutube } from "react-icons/bs";

export default function ContactPage() {
  return (
    <section className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Get In Touch
          </h1>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Please enter the details of your request. A member of your support
            staff will respond as soon as possible.
          </p>
        </motion.div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-10 mt-14">

          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-2xl shadow-lg"
          >
            <div className="space-y-4">

              <input
                type="text"
                placeholder="Name"
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                type="text"
                placeholder="Phone Number"
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <textarea
                placeholder="Message"
                rows={5}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <button className="w-full bg-primary text-white py-3 rounded-lg hover:opacity-90 transition">
                Submit
              </button>

            </div>
          </motion.div>

          {/* CONTACT INFO */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-2xl shadow-lg space-y-6"
          >

            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="text-primary" />
              <p>Hyderabad, Telangana</p>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail className="text-primary" />
              <p>support@microgreens.com</p>
            </div>

            {/* Calls */}
            <div className="flex items-start gap-3">
              <Phone className="text-primary" />
              <div>
                <p>+91 98765 43210</p>
                <p>+91 87654 32109</p>
              </div>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-semibold mb-3">Follow Us</h3>

              <div className="flex gap-4">

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/mgmhyd"
                  target="_blank"
                  className="text-pink-500 hover:scale-110 transition"
                >
                  <BsInstagram size={28} />
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@mgmhyd"
                  target="_blank"
                  className="text-red-500 hover:scale-110 transition"
                >
                  <BsYoutube size={28} />
                </a>

              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}