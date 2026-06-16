import type { Metadata } from "next";
import Navbar from "@/components/kolkata-call-girl/Navbar";
import Hero from "@/components/kolkata-call-girl/Hero";
import Companions from "@/components/kolkata-call-girl/Companions";
import About from "@/components/kolkata-call-girl/About";
import Services from "@/components/kolkata-call-girl/Services";
import Pricing from "@/components/kolkata-call-girl/Pricing";
import HowItWorks from "@/components/kolkata-call-girl/HowItWorks";
import Testimonials from "@/components/kolkata-call-girl/Testimonials";
import FAQ from "@/components/kolkata-call-girl/FAQ";
import Footer from "@/components/kolkata-call-girl/Footer";
import FloatingBookNow from "@/components/kolkata-call-girl/FloatingBookNow";

export const metadata: Metadata = {
  title: "Kolkata Escorts & Call Girl | Premium Companionship | Bengal Beauties",
  description: "Discover premium Kolkata escorts and elegant call girls at Bengal Beauties. We offer discreet, high-end companionship for dinner dates, events, and travel.",
};

export default function KolkataCallGirl() {
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
