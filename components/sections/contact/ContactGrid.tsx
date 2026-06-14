"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import { AgriNestSocialRow } from "@/components/ui/SocialIcons";
import { contactApi } from "@/api/contact.api";

type FormState = "idle" | "loading" | "success" | "error";

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

function validate(name: string, email: string, message: string): FormErrors {
  const errs: FormErrors = {};
  if (!name.trim()) errs.name = "Full name is required.";
  if (!email.trim()) errs.email = "Email address is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errs.email = "Please enter a valid email.";
  if (!message.trim()) errs.message = "Message cannot be empty.";
  return errs;
}

function InputField({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-bold text-[11px] tracking-widest uppercase text-[#424843] mb-2 font-[var(--font-work-sans)]"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-[#fafaf4] border rounded-lg px-4 py-3.5 text-[#1a1c19] text-sm outline-none transition-all font-[var(--font-work-sans)] placeholder:text-[#727973] focus:border-[#386b00] focus:ring-2 focus:ring-[#386b00]/20 ${
          error ? "border-[#ba1a1a] ring-2 ring-[#ba1a1a]/20" : "border-[#c1c8c1]"
        }`}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 text-[11px] text-[#ba1a1a] font-[var(--font-work-sans)]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}


export default function ContactGrid() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [formState, setFormState] = useState<FormState>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(name, email, message);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setFormState("loading");

    try {
      await contactApi.send({ name, email, subject, message });
      setFormState("success");
      setName(""); setEmail(""); setSubject("General Inquiry"); setMessage("");
      setTimeout(() => setFormState("idle"), 4000);
    } catch {
      setFormState("error");
    }
  };

  return (
    <section className="max-w-[1280px] mx-auto px-5 md:px-16 py-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Contact Form (7 cols) */}
        <FadeIn direction="left" className="lg:col-span-7">
          <div
            className="bg-white p-8 md:p-10 rounded-xl border border-[#e3e3dd]"
            style={{ boxShadow: "0 4px 16px rgba(27,60,42,0.09)" }}
          >
            <h2 className="font-[var(--font-libre-caslon)] text-2xl font-bold text-[#032616] mb-8">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Full Name"
                  id="name"
                  placeholder="Adithya Sharma"
                  value={name}
                  onChange={setName}
                  error={errors.name}
                />
                <InputField
                  label="Email Address"
                  id="email"
                  type="email"
                  placeholder="adithya@example.com"
                  value={email}
                  onChange={setEmail}
                  error={errors.email}
                />
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="block font-bold text-[11px] tracking-widest uppercase text-[#424843] mb-2 font-[var(--font-work-sans)]"
                >
                  Subject
                </label>
                <div className="relative">
                  <select
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full appearance-none bg-[#fafaf4] border border-[#c1c8c1] rounded-lg px-4 py-3.5 text-[#1a1c19] text-sm outline-none focus:border-[#386b00] focus:ring-2 focus:ring-[#386b00]/20 transition-all font-[var(--font-work-sans)] cursor-pointer"
                  >
                    <option>General Inquiry</option>
                    <option>Subscription Help</option>
                    <option>Workshop Information</option>
                    <option>Wholesale Opportunities</option>
                    <option>Delivery Issue</option>
                  </select>
                  <svg
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#424843] pointer-events-none"
                    fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block font-bold text-[11px] tracking-widest uppercase text-[#424843] mb-2 font-[var(--font-work-sans)]"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="How can we help you today?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full bg-[#fafaf4] border rounded-lg px-4 py-3.5 text-[#1a1c19] text-sm outline-none resize-none transition-all font-[var(--font-work-sans)] placeholder:text-[#727973] focus:border-[#386b00] focus:ring-2 focus:ring-[#386b00]/20 ${
                    errors.message ? "border-[#ba1a1a] ring-2 ring-[#ba1a1a]/20" : "border-[#c1c8c1]"
                  }`}
                />
                <AnimatePresence>
                  {errors.message && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-1.5 text-[11px] text-[#ba1a1a] font-[var(--font-work-sans)]"
                    >
                      {errors.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit button */}
              <motion.button
                type="submit"
                whileHover={formState === "idle" || formState === "error" ? { scale: 1.01 } : {}}
                whileTap={formState === "idle" || formState === "error" ? { scale: 0.98 } : {}}
                disabled={formState === "loading" || formState === "success"}
                className={`w-full py-4 rounded-lg font-bold text-[11px] tracking-widest uppercase font-[var(--font-work-sans)] flex items-center justify-center gap-2 transition-colors ${
                  formState === "success"
                    ? "bg-[#386b00] text-white"
                    : formState === "loading"
                    ? "bg-[#032616]/70 text-white cursor-wait"
                    : "bg-[#032616] text-white hover:bg-[#386b00]"
                }`}
              >
                {formState === "loading" && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                  </svg>
                )}
                {formState === "success" && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                )}
                {formState === "loading"
                  ? "Sending..."
                  : formState === "success"
                  ? "Message Sent!"
                  : (
                    <>
                      Send Message
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m22 2-7 20-4-9-9-4 20-7z" />
                      </svg>
                    </>
                  )}
              </motion.button>

              {/* Error banner */}
              <AnimatePresence>
                {formState === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-[#ba1a1a] text-center font-[var(--font-work-sans)]"
                  >
                    Failed to send your message. Please try again.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </div>
        </FadeIn>

        {/* Right Sidebar (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* Support Hub */}
          <FadeIn direction="right" delay={0.1} className="flex-1">
            <div className="h-full bg-[#1b3c2a] text-white p-8 rounded-xl" style={{ boxShadow: "0 4px 16px rgba(27,60,42,0.2)" }}>
              <h3 className="font-[var(--font-libre-caslon)] text-2xl font-bold mb-7">Support Hub</h3>
              <div className="space-y-6">

                {/* Email */}
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }} className="flex items-start gap-4">
                  <div className="bg-[#386b00] p-3 rounded-lg shrink-0" aria-hidden="true">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-[10px] tracking-widest uppercase opacity-60 font-[var(--font-work-sans)] mb-0.5">
                      Email Us
                    </p>
                    <a
                      href="mailto:agrinestmicrogreens@gmail.com"
                      className="font-[var(--font-work-sans)] text-base hover:text-[#a5f95b] transition-colors"
                    >
                      agrinestmicrogreens@gmail.com
                    </a>
                  </div>
                </motion.div>

                {/* Phone */}
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }} className="flex items-start gap-4">
                  <div className="bg-[#386b00] p-3 rounded-lg shrink-0" aria-hidden="true">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17v-.08z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-[10px] tracking-widest uppercase opacity-60 font-[var(--font-work-sans)] mb-0.5">
                      Call Us
                    </p>
                    <a href="tel:+918500395821" className="font-[var(--font-work-sans)] text-base hover:text-[#a5f95b] transition-colors block">
                      +91 8500395821
                    </a>
                    <a href="tel:+918500395831" className="font-[var(--font-work-sans)] text-base hover:text-[#a5f95b] transition-colors block">
                      +91 8500395831
                    </a>
                  </div>
                </motion.div>

                {/* Address */}
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }} className="flex items-start gap-4">
                  <div className="bg-[#386b00] p-3 rounded-lg shrink-0" aria-hidden="true">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-[10px] tracking-widest uppercase opacity-60 font-[var(--font-work-sans)] mb-0.5">
                      Visit Us
                    </p>
                    <address className="font-[var(--font-work-sans)] text-sm not-italic leading-relaxed opacity-90">
                      Plot No 359, Gokul Plots,<br />
                      KPHB 9th Phase,<br />
                      Hyderabad, Telangana – 500085,<br />
                      India
                    </address>
                  </div>
                </motion.div>

              </div>

              {/* Social Media */}
              <div className="mt-8 pt-7 border-t border-white/20">
                <p className="font-bold text-[10px] tracking-widest uppercase opacity-60 font-[var(--font-work-sans)] mb-4">
                  Follow Us
                </p>
                <AgriNestSocialRow variant="dark" iconSize={20} />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
