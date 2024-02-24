import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ connectWallet, disconnectWallet, accountId }) {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        LDB<span className="nav-logo-highlight">DAO</span>
      </Link>
      <div className="nav-links">
        <Link to="/" className="nav-item">
          Home
        </Link>
        <Link to="/proposals" className="nav-item">
          Proposals
        </Link>
        {/* More nav items can be added here */}
      </div>
      {accountId ? (
        <button onClick={disconnectWallet} className="nav-button">
          Account Id: {accountId}
        </button>
      ) : (
        <button onClick={connectWallet} className="nav-button">
          Connect Wallet
        </button>
      )}
    </nav>
  );
}

export default Navbar;
