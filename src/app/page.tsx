import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Companions from "@/components/sections/Companions";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Pricing from "@/components/sections/Pricing";
import HowItWorks from "@/components/sections/HowItWorks";
import Testimonials from "@/components/sections/Testimonials";
import Footer from "@/components/sections/Footer";
import FloatingBookNow from "@/components/FloatingBookNow";

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
      </main>
      <Footer />
      <FloatingBookNow />
    </>
  );
}
