"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { BsInstagram, BsYoutube } from "react-icons/bs";

export default function ContactPage() {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        message,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Message sent successfully!");
    } else {
      alert("Failed to send message");
    }
  };

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
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-2xl shadow-lg"
          >
            <div className="space-y-4">

              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <textarea
                placeholder="Message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <button className="w-full bg-primary text-white py-3 rounded-lg hover:opacity-90 transition" type="submit">
                Submit
              </button>

            </div>
          </motion.form>

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
            <a
              href="mailto:agrinestmicrogreens@gmail.com"
              className="flex items-start gap-3 hover:text-primary transition"
            >
              <Mail className="text-primary" />
              <p>agrinestmicrogreens@gmail.com</p>
            </a>

            {/* Calls */}
            <div className="flex items-start gap-3">
              <Phone className="text-primary mt-1" />
              <a
                href="tel:+910000000000"
                className="flex items-center gap-2 hover:text-primary transition"
              >
                +91 00000 00000
              </a>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="text-primary mt-1" />
              <a
                href="tel:+910000000000"
                className="flex items-center gap-2 hover:text-primary transition"
              >
                +91 00000 00000
              </a>
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
