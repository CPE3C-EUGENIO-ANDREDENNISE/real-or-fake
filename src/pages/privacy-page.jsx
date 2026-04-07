import ResourcesLayout from "../assets/components/ResourceLayout";
import "../styles/terms.css";

const privacySections = [
  {
    title: "Information We Collect",
    items: [
      "Account information (email, name)",
      "Search queries and fact-check requests",
      "Usage data and analytics",
    ],
  },
  {
    title: "How We Use Your Information",
    items: [
      "To provide fact-checking services",
      "To improve our algorithms",
      "To send important updates",
      "To analyze usage patterns",
    ],
  },
  {
    title: "Data Security",
    body: "We use industry-standard encryption and security measures to protect your data.",
  },
  {
    title: "Data Sharing",
    body: "We do not sell your personal information. We may share anonymized data for research purposes.",
  },
  {
    title: "Your Rights",
    items: [
      "Access your data",
      "Request data deletion",
      "Opt-out of communications",
    ],
  },
  {
    title: "Cookies",
    body: "We use cookies to improve your experience and analyze usage.",
  },
];

export default function PrivacyPage() {
  return (
    <ResourcesLayout>
      <main className="terms-content">
        <div className="terms-hero">
          <h1 className="terms-title">Privacy Policy</h1>
          <p className="terms-subtitle">How we protect your data</p>
        </div>

        <div className="terms-card">
          <p className="terms-updated">Last updated: March 25, 2026</p>
          <p className="terms-intro">At VeriFake, we take your privacy seriously.</p>
          <div className="terms-divider" />

          {privacySections.map((s, i) => (
            <div className="terms-item" key={i}>
              <h3 className="terms-item-title">{i + 1}. {s.title}</h3>
              {s.body && <p className="terms-item-body">{s.body}</p>}
              {s.items && (
                <ul className="terms-item-list">
                  {s.items.map((item, j) => (
                    <li key={j} className="terms-item-body">- {item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="terms-divider" />
          <p className="terms-contact">
            Contact us at{" "}
            <a href="mailto:verifake@gmail.com" className="terms-link">
              verifake@gmail.com
            </a>{" "}
            for any privacy concerns.
          </p>
        </div>
      </main>
    </ResourcesLayout>
  );
}
