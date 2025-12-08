import { useNavigate } from 'react-router-dom';
import './Landing.css';

function Launch() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        {/* Header */}
        <div className="landing-header">
          <div className="logo">
            <span className="logo-text">JotDown</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">
            Your thoughts, organized.
            <br />
            <span className="hero-highlight">Your way.</span>
          </h1>
          <p className="hero-description">
            Need to take notes on the fly? Want documents organized simple and clean? Quickly Jot Down whatever you need, whenever you need with no hastle.
          </p>

          {/* CTA Buttons */}
          <div className="cta-buttons">
            <button 
              className="cta-primary"
              onClick={() => navigate('/Register')}
            >
              Get Started Free
            </button>
            <button 
              className="cta-secondary"
              onClick={() => navigate('/Login')}
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="features-section">
          <div className="feature-card">
            <h3 className="feature-title"> Instant Documentation</h3>
            <p className="feature-description">
              Quickly open and take notes without the waiting buffer time of creating, opening, and saving documents.
            </p>
          </div>

          <div className="feature-card">
            <h3 className="feature-title">Organize with Folders</h3>
            <p className="feature-description">
              Create unlimited folders and nested structures to keep your notes perfectly organized.
            </p>
          </div>

          <div className="feature-card">
            <h3 className="feature-title">AI Overview</h3>
            <p className="feature-description">
              Have your notes evaluated and summarized by Google Gemini's 2.5 (free) and open LLM model!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="landing-footer">
          <p className="footer-text">
            Join thousands of users who trust JotDown with their ideas
          </p>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="bg-decoration bg-decoration-1"></div>
      <div className="bg-decoration bg-decoration-2"></div>
      <div className="bg-decoration bg-decoration-3"></div>
    </div>
  );
}

export default Launch;