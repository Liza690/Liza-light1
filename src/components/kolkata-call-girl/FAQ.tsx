"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How can I find a premium escort service near me in Kolkata?",
    a: "Finding a high-quality escort service near me is simple with Bengal Beauties. We offer a curated, discreet platform that connects you with elite companions across the city, ensuring a professional and memorable experience.",
  },
  {
    q: "What should I expect when booking a Kolkata call girl?",
    a: "When you choose a Kolkata call girl through our agency, you can expect unmatched professionalism, elegance, and discretion. We focus on providing personalized companionship that caters to your specific preferences and desires for any occasion.",
  },
  {
    q: "Is it possible to request a Russian escort in Kolkata?",
    a: "Yes, we provide access to an exclusive Russian escort in Kolkata for those seeking a unique, sophisticated, and culturally refined companionship experience. Our companions are vetted for class and personality to ensure your complete satisfaction.",
  },
  {
    q: "How do Bengal Beauties ensure the discretion of my booking?",
    a: "Discretion is the foundation of our agency. We handle all bookings through private channels, ensuring your identity remains protected while you enjoy our professional kolkata escorts in complete confidence.",
  },
  {
    q: "Are your services available for a last-minute call girl service near me?",
    a: "While we recommend scheduling in advance for the best experience, we do our best to accommodate requests. If you are searching for a call girl service near me on short notice, contact our team, and we will assist you promptly.",
  },
  {
    q: "What sets your Kolkata escorts apart from others?",
    a: "Our kolkata escorts are chosen for their sophistication, intelligence, and ability to elevate any social setting. Bengal Beauties is dedicated to maintaining high standards of conduct, safety, and client-focused service for every engagement.",
  },
  {
    q: "Can I hire Kolkata call girls for private events or galas?",
    a: "Absolutely, We specialize in providing the perfect companion for dinners, galas, and private functions. Our kolkata call girls are experienced in high-end social settings and will ensure you have an engaging and elegant partner by your side.",
  },
  {
    q: "How do I initiate a booking with a Kolkata escort?",
    a: "Simply browse our online profiles to find the companion who best matches your requirements. Once you have made your selection, contact our booking team, and we will manage the rest of the process seamlessly.",
  },
  {
    q: "Do you provide services for out-of-town visitors looking for a Kolkata escort?",
    a: "Yes, we frequently assist business travelers and tourists. Whether you are in the city for a short stay or an extended period, our kolkata escort services are designed to make your time here truly exceptional and stress-free.",
  },
  {
    q: "What safety and professional standards do Bengal Beauties maintain?",
    a: "Safety and mutual respect are our top priorities. We thoroughly vet all companions to ensure they meet our rigorous standards for elegance and class, guaranteeing a respectful and worry-free experience for every client we serve.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="faq-section" id="faq">
      <div className="faq-inner">
        <p className="section-label" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "10px", fontWeight: 700 }}>FAQ</p>
        <h2 className="faq-title"><em>Frequently</em> Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item ${open === i ? "open" : ""}`}>
              <button className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
                <span>{faq.q}</span>
                <svg className="faq-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div className="faq-answer">{faq.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
