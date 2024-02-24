import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Proposals from "./components/Proposals";
import HistoricalProposals from "./components/HistoricalProposals";
import "./App.css";
import { BladeConnector, ConnectorStrategy } from "@bladelabs/blade-web3.js";

function App() {
  const [bladeConnector, setBladeConnector] = useState(null);
  const [connectedAccountId, setConnectedAccountId] = useState("");

  useEffect(() => {
    const initBlade = async () => {
      try {
        const connector = await BladeConnector.init(
          ConnectorStrategy.WALLET_CONNECT,
          {
            name: "Lightency and Dar Blockchain Community DAO",
            description:
              "A community DAO for Lightency and Dar Blockchain Team",
            url: "https://lightency.io/",
            icons: [
              "https://res.cloudinary.com/dtrbcyuox/image/upload/v1698271156/logo-name-dark_vjik3y.png",
            ],
          }
        );
        setBladeConnector(connector);
      } catch (error) {
        console.error("Error initializing Blade Wallet:", error);
      }
    };

    initBlade();
  }, []);

  const connectWallet = async () => {
    if (!bladeConnector) {
      console.log("Blade connector is not initialized.");
      return;
    }
    try {
      // Specify Testnet as the network when creating a session
      const params = {
        network: "testnet", // Ensure this matches the Blade Web3.js library's expected format for specifying the Testnet
      };
      const pairedAccountIds = await bladeConnector.createSession(params);
      if (pairedAccountIds.length > 0) {
        console.log("Connected Account IDs:", pairedAccountIds);
        setConnectedAccountId(pairedAccountIds[0]); // Assuming the first account is the active one
      }
    } catch (error) {
      console.error("Error connecting to Blade Wallet:", error);
    }
  };

  const disconnectWallet = async () => {
    if (!bladeConnector) {
      console.log("Blade connector is not initialized.");
      return;
    }
    try {
      await bladeConnector.killSession();
      setConnectedAccountId(""); // Clear the connected account ID
      console.log("Disconnected from Blade Wallet.");
    } catch (error) {
      console.error("Error disconnecting Blade Wallet:", error);
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar
          connectWallet={connectWallet}
          disconnectWallet={disconnectWallet}
          accountId={connectedAccountId}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/proposals"
            element={<Proposals connector={bladeConnector} />}
          />
          <Route
            path="/historical-proposals"
            element={<HistoricalProposals />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
