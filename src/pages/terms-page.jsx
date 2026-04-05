import ResourcesLayout from "../assets/components/ResourcesLayout";
import "../styles/terms.css";

const terms = [
  { title: "Acceptance of Terms", body: "By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement." },
  { title: "Use License", body: "Permission is granted to temporarily use VeriFake for personal, non-commercial purposes." },
  { title: "Disclaimer", body: 'The fact-checking results are provided "as is" without warranty of any kind. While we strive for accuracy, we cannot guarantee 100% accuracy in all cases.' },
  { title: "Limitations", body: "VeriFake is not responsible for decisions made based on our fact-checking results." },
  { title: "User Conduct", body: "Users must not submit false claims intentionally or attempt to manipulate the system." },
  { title: "Privacy", body: "Your data is handled according to our Privacy Policy." },
];

export default function TermsPage() {
  return (
    <ResourcesLayout>
      <main className="terms-content">
        <div className="terms-hero">
          <h1 className="terms-title">Terms & Conditions</h1>
          <p className="terms-subtitle">Please read these terms carefully</p>
        </div>

        <div className="terms-card">
          <p className="terms-updated">Last updated: March 25, 2026</p>
          <p className="terms-intro">By using VeriFake, you agree to these terms and conditions.</p>
          <div className="terms-divider" />
          {terms.map((t, i) => (
            <div className="terms-item" key={i}>
              <h3 className="terms-item-title">{i + 1}. {t.title}</h3>
              <p className="terms-item-body">{t.body}</p>
            </div>
          ))}
          <div className="terms-divider" />
          <p className="terms-contact">
            For questions about these Terms, please contact us at{" "}
            <a href="mailto:verifake@gmail.com" className="terms-link">verifake@gmail.com</a>
          </p>
        </div>
      </main>
    </ResourcesLayout>
  );
}
