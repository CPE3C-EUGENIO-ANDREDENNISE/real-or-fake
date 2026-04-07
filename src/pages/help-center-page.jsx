import { useState } from "react";
import ResourcesLayout from "../assets/components/ResourceLayout";
import "../styles/help-center.css";

const steps = [
  {
    number: "01",
    title: "Submit Your Query",
    desc: "Enter a claim, paste a news link, or upload an image that you want to verify.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  {
    number: "02",
    title: "AI Analysis",
    desc: "Our advanced AI system analyzes the content against millions of verified sources, scientific papers, and authoritative databases.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1010 10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
  {
    number: "03",
    title: "Expert Review",
    desc: "Human fact-checkers review AI findings to ensure accuracy and context.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    number: "04",
    title: "Receive Results",
    desc: "Get a detailed report with verdict, confidence score, evidence, and sources within seconds.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    number: "05",
    title: "Share & Save",
    desc: "Save your checks to your dashboard and share verified information with others.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
    ),
  },
];

const faqs = [
  { q: "How accurate is VeriFake?", a: "VeriFake achieves a 95% accuracy rate by combining AI analysis with human expert review against millions of verified sources." },
  { q: "What types of content can I check?", a: "You can check text claims, news article URLs, and images. Our AI handles all three formats seamlessly." },
  { q: "How long does a fact-check take?", a: "Most checks are completed within seconds. Complex claims requiring expert review may take up to a few minutes." },
  { q: "Is my data kept private?", a: "Yes. All submissions are encrypted and handled according to our Privacy Policy. We never sell your data." },
  { q: "Can I save my fact-check results?", a: "Yes! Once logged in, all your checks are saved to your personal dashboard for future reference." },
];

export default function HelpCenterPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <ResourcesLayout>
      <main className="help-content">

        {/* HERO */}
        <div className="help-hero">
          <h1 className="help-title">Help Center</h1>
          <p className="help-subtitle">Our fact-checking process explained</p>
        </div>

        {/* INTERACTIVE STEPS */}
        <div className="help-steps-section">
          <div className="steps-nav">
            {steps.map((s, i) => (
              <button
                key={i}
                className={`step-nav-btn ${activeStep === i ? 'active' : ''}`}
                onClick={() => setActiveStep(i)}
              >
                <span className="step-num">{s.number}</span>
                <span className="step-nav-title">{s.title}</span>
                {activeStep === i && <div className="step-indicator" />}
              </button>
            ))}
          </div>

          <div className="step-display">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`step-panel ${activeStep === i ? 'active' : ''}`}
              >
                <div className="step-icon-large">{s.icon}</div>
                <div className="step-badge">{s.number}</div>
                <h2 className="step-title">{s.title}</h2>
                <p className="step-desc">{s.desc}</p>
                <div className="step-nav-arrows">
                  <button
                    className="arrow-btn"
                    disabled={i === 0}
                    onClick={() => setActiveStep(i - 1)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                    Previous
                  </button>
                  <div className="step-dots">
                    {steps.map((_, di) => (
                      <div
                        key={di}
                        className={`step-dot ${activeStep === di ? 'active' : ''}`}
                        onClick={() => setActiveStep(di)}
                      />
                    ))}
                  </div>
                  <button
                    className="arrow-btn"
                    disabled={i === steps.length - 1}
                    onClick={() => setActiveStep(i + 1)}
                  >
                    Next
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ALL STEPS LIST */}
        <div className="help-steps-list">
          <h2 className="section-title">Full Process Overview</h2>
          <div className="steps-card">
            {steps.map((s, i) => (
              <div className="step-row" key={i}>
                <div className="step-row-num">{s.number}</div>
                <div>
                  <h3 className="step-row-title">{s.title}</h3>
                  <p className="step-row-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="help-faq">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div
                key={i}
                className={`faq-item ${openFaq === i ? 'open' : ''}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="faq-question">
                  <span>{f.q}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
                {openFaq === i && (
                  <div className="faq-answer">{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

      </main>
    </ResourcesLayout>
  );
}
