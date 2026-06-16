import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Companions from "@/components/sections/Companions";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Pricing from "@/components/sections/Pricing";
import HowItWorks from "@/components/sections/HowItWorks";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";
import FloatingBookNow from "@/components/FloatingBookNow";

export const metadata: Metadata = {
  title: "Elite Kolkata Companionship Services | Elegant & Discreet",
  description: "Discover elite companions in Kolkata at Bengal Beauties. We offer discreet, high-end companionship for galas, travel, and private events. Book your date today.",
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Companions />
        <About />
        <Services />
        <Pricing />
        <HowItWorks />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
      <FloatingBookNow />
    </>
  );
}
