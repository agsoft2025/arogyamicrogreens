"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { BsInstagram, BsYoutube } from "react-icons/bs";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ease = [0.22, 1, 0.36, 1] as const;

  const fieldClass =
    "w-full rounded-2xl border border-emerald-800/28 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm outline-none transition placeholder:text-stone-400 hover:border-emerald-700/45 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/16";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f7fbf0] py-10 md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(52,211,153,0.22),transparent_30%),radial-gradient(circle_at_88%_12%,rgba(190,242,100,0.26),transparent_30%),linear-gradient(180deg,#f7fee7_0%,#fbfcf8_48%,#ecfdf5_100%)]" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.1] [background-image:linear-gradient(rgba(22,101,52,0.24)_1px,transparent_1px),linear-gradient(90deg,rgba(22,101,52,0.24)_1px,transparent_1px)] [background-size:72px_72px]"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="text-4xl font-semibold tracking-tight text-emerald-950 md:text-6xl">
            Get In Touch
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-stone-600 md:text-lg">
            Please enter the details of your request. A member of your support
            staff will respond as soon as possible.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease }}
            className="relative overflow-hidden rounded-[2rem] border border-emerald-950/8 bg-white p-6 shadow-[0_24px_80px_rgba(22,101,52,0.12)] sm:p-8"
          >
            <div className="absolute inset-x-0 top-0 h-2 bg-linear-to-r from-emerald-600 via-lime-500 to-emerald-700" />
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-lime-200/34 blur-xl" />

            <div className="relative space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={fieldClass}
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={fieldClass}
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass}
              />

              <textarea
                placeholder="Message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`${fieldClass} resize-none`}
              />

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(22,101,52,0.22)] transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                type="submit"
                disabled={isSubmitting}
              >
                <Send size={18} />
                {isSubmitting ? "Submitting..." : "Submit"}
              </motion.button>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.14, ease }}
            className="relative overflow-hidden rounded-[2rem] border border-emerald-800/28 bg-white/82 p-6 text-emerald-950 shadow-[0_24px_80px_rgba(22,101,52,0.12)] sm:p-8"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_0%,rgba(190,242,100,0.28),transparent_34%),linear-gradient(135deg,rgba(236,253,245,0.76),rgba(255,255,255,0.62))]" />

            <div className="relative space-y-5 text-sm leading-6 text-stone-650">
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-800/24 bg-white/84 p-4 shadow-sm">
                <MapPin className="mt-1 shrink-0 text-emerald-700" />
                <p>Hyderabad, Telangana</p>
              </div>

              <a
                href="mailto:agrinestmicrogreens@gmail.com"
                className="flex items-start gap-3 rounded-2xl border border-emerald-800/24 bg-white/84 p-4 shadow-sm transition hover:border-emerald-700/40 hover:bg-white hover:text-emerald-800"
              >
                <Mail className="mt-1 shrink-0 text-emerald-700" />
                <p className="break-words">agrinestmicrogreens@gmail.com</p>
              </a>

              <div className="flex items-start gap-3 rounded-2xl border border-emerald-800/24 bg-white/84 p-4 shadow-sm">
                <Phone className="mt-1 shrink-0 text-emerald-700" />
                <a
                  href="tel:+910000000000"
                  className="transition hover:text-emerald-800"
                >
                  +91 00000 00000
                </a>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-emerald-800/24 bg-white/84 p-4 shadow-sm">
                <Phone className="mt-1 shrink-0 text-emerald-700" />
                <a
                  href="tel:+910000000000"
                  className="transition hover:text-emerald-800"
                >
                  +91 00000 00000
                </a>
              </div>

              <div className="rounded-2xl border border-emerald-800/24 bg-white/84 p-4 shadow-sm">
                <h3 className="font-semibold text-emerald-950">Follow Us</h3>

                <div className="mt-4 flex gap-3">
                  <motion.a
                    href="https://www.instagram.com/mgmhyd"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -4, scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-pink-500 shadow-sm transition hover:bg-linear-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600 hover:text-white"
                    aria-label="Instagram"
                  >
                    <BsInstagram size={22} />
                  </motion.a>

                  <motion.a
                    href="https://www.youtube.com/@mgmhyd"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -4, scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-red-500 shadow-sm transition hover:bg-red-600 hover:text-white"
                    aria-label="YouTube"
                  >
                    <BsYoutube size={22} />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
