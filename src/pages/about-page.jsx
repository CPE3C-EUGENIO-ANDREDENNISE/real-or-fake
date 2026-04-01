import Layout from "../assets/components/Layout";
import "../styles/about.css";

export default function AboutPage() {
  return (
    <Layout>
      <main className="about-content">

        {/* HERO */}
        <div className="about-hero">
          <h1 className="about-title">About VeriFake</h1>
          <p className="about-subtitle">Empowering truth through AI-powered fact-checking</p>
        </div>

        {/* FEATURE CARDS */}
        <div className="about-cards">
          <div className="about-card">
            <div className="about-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h3>Trusted Sources</h3>
              <p>We verify claims against authoritative and peer-reviewed sources</p>
            </div>
          </div>

          <div className="about-card">
            <div className="about-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <div>
              <h3>Community Driven</h3>
              <p>Built by a global community committed to fighting misinformation</p>
            </div>
          </div>

          <div className="about-card">
            <div className="about-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
              </svg>
            </div>
            <div>
              <h3>95% Accuracy</h3>
              <p>Industry-leading accuracy backed by advanced AI technology</p>
            </div>
          </div>

          <div className="about-card">
            <div className="about-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div>
              <h3>Our Mission</h3>
              <p>Making truth accessible to everyone, everywhere</p>
            </div>
          </div>
        </div>

        {/* OUR STORY */}
        <div className="about-story">
          <div className="story-text">
            <h2>Our Story</h2>
            <p>VeriFake was founded in 2024 with a simple mission: to combat the spread of misinformation in the digital age. In a world where false information can spread faster than truth, we believe everyone deserves access to accurate, verified facts.</p>
            <p>Our team of developers, journalists, and AI researchers came together to build a platform that makes fact-checking fast, reliable, and accessible to everyone.</p>
          </div>
          <div className="story-image">
            <div className="story-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>Image placeholder</span>
            </div>
          </div>
        </div>

        {/* MEET THE TEAM */}
        <div className="about-team">
          <h2 className="team-title">Meet the Team</h2>
          <p className="team-subtitle">The people behind VeriFake</p>
          <div className="team-grid">

            {[
              { name: "Reylie K. Domingo", role: "Computer Engineering Student", email: "email@placeholder.com" },
              { name: "Andre Dennise Eugenio", role: "Computer Engineering Student", email: "email@placeholder.com" },
              { name: "Clark S. San Pedro", role: "Computer Engineering Student", email: "email@placeholder.com" },
              { name: "Denver Lyndon Aerol S. San Diego", role: "Computer Engineering Student", email: "denverlyndonaerolsandiego@gmail.com" },
            ].map((member, i) => (
              <div className="team-card" key={i}>
                <div className="team-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                </div>
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <a className="team-email" href={`mailto:${member.email}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {member.email}
                </a>
              </div>
            ))}

          </div>
        </div>

      </main>
    </Layout>
  );
}
