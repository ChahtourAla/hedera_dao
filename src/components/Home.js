// Home.js
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Welcome to Our Community DAO</h1>
        <p>Empowering community governance through blockchain technology.</p>
      </header>
      <section className="get-started">
        <h2>Get Started</h2>
        <p>
          Join our DAO and start participating in the governance of our
          community.
        </p>
        <Link to="/proposals" className="get-started-link">
          View Proposals
        </Link>
      </section>
      <section className="features">
        <h2>Features</h2>
        <div className="features-list">
          <div className="feature">
            <h3>Create Proposals</h3>
            <p>Members can propose new initiatives or changes.</p>
          </div>
          <div className="feature">
            <h3>Vote on Proposals</h3>
            <p>Your vote counts. Participate in the decision-making process.</p>
          </div>
          <div className="feature">
            <h3>Transparent Governance</h3>
            <p>
              All activities are recorded on the blockchain, ensuring
              transparency and integrity.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
