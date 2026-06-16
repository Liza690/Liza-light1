"use client";

import { useState } from "react";

const faqs = [
  {
    q: "What is the process for booking a companion with Bengal Beauties?",
    a: "Booking is simple: browse our curated profiles to find your perfect match, then contact our team to confirm availability and logistics. We handle all the details to ensure your experience is seamless and professional.",
  },
  {
    q: "How quickly can I secure a companion for a last-minute request?",
    a: "We prioritize efficiency and can often accommodate short-notice requests. Please reach out to our team directly via our contact channels, and we will do our best to arrange a high-quality companion for you promptly.",
  },
  {
    q: "Is my privacy and discretion fully guaranteed during the booking?",
    a: "Absolutely, We operate with strict confidentiality protocols. Your identity and personal information remain protected throughout the entire booking process, allowing you to enjoy your experience with complete peace of mind.",
  },
  {
    q: "Are your companions available for travel or out-of-town events?",
    a: "Yes, We frequently provide travel companionship for business trips, vacations, and special events. Our companions are well-traveled, professional, and ready to accompany you to any destination you require.",
  },
  {
    q: "How do you ensure the quality and professionalism of your companions?",
    a: "We personally vet all our companions to ensure they meet our high standards of elegance, intelligence, and social grace. We focus on individuals who can comfortably adapt to high-end settings and provide an elevated experience.",
  },
  {
    q: "Can I hire a companion for professional events or business dinners?",
    a: "Certainly. Our companions are adept at handling sophisticated social settings, including business dinners, galas, and networking events. They are trained to be engaging, presentable, and the perfect partner for your professional engagements.",
  },
  {
    q: "What is included in the service fee?",
    a: "Our service fee covers the coordination, vetting, and booking of your selected companion. We aim for complete transparency; please contact us directly for specific details regarding rates and what is included in your chosen experience.",
  },
  {
    q: "Can I request a specific style or personality for my companion?",
    a: "Yes We encourage you to share your preferences regarding personality, interests, and style when you contact us. Our goal is to match you with a companion who aligns perfectly with your desires for the event.",
  },
  {
    q: "Do you offer long-term or recurring companionship arrangements?",
    a: "Yes, we cater to clients looking for consistent companionship for regular social activities or ongoing needs. Contact our team to discuss a tailored arrangement that suits your schedule and lifestyle.",
  },
  {
    q: "What payment methods are accepted for booking?",
    a: "We offer secure and discreet payment options to ensure a smooth transaction. Once your booking is confirmed, our team will provide you with all the necessary details to finalize your reservation safely.",
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
