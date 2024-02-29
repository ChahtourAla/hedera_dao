import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BladeConnector, ConnectorStrategy } from "@bladelabs/blade-web3.js";
import { createProposal } from "./hedera/contractExecute";
import "./Proposals.css";
import "./Modal.css";
import "./Button.css";

function Proposals(props) {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([
    {
      id: 1,
      title: "Proposal 1",
      description: "Description of Proposal 1",
      votes: 120,
      voteDetails: [
        { voterName: "Alice", vote: "Approve", comment: "Great idea!" },
        { voterName: "Bob", vote: "Reject", comment: "Needs more discussion." },
      ],
    },
    {
      id: 2,
      title: "Proposal 2",
      description: "Description of Proposal 2",
      votes: 75,
      voteDetails: [
        { voterName: "Charlie", vote: "Approve", comment: "I support this." },
        {
          voterName: "Dave",
          vote: "Reject",
          comment: "Not convinced this is the right move.",
        },
      ],
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewProposalModalOpen, setIsNewProposalModalOpen] = useState(false);
  const [isVotesModalOpen, setIsVotesModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [selectedVotes, setSelectedVotes] = useState([]);
  const [comment, setComment] = useState("");
  const [vote, setVote] = useState("");
  const [newProposalDescription, setNewProposalDescription] = useState("");
  const [newReceipient, setnewReceipient] = useState("");
  const [proposalType, setProposalType] = useState("simple");
  const [newAmount, setNewAmount] = useState("");

  const [bladeConnector, setBladeConnector] = useState(null);

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

  const handleVoteClick = (proposal) => {
    setSelectedProposal(proposal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddProposal = () => {
    setIsNewProposalModalOpen(true);
  };

  const handleCloseNewProposalModal = () => {
    setIsNewProposalModalOpen(false);
  };

  const handleSubmitVote = () => {
    setIsModalOpen(false);
  };

  const handleSubmitNewProposal = async () => {
    if (!props.connector) {
      alert("Blade Wallet is not connected.");
      return;
    }

    try {
      const amountInTinybar = Number(newAmount);
      await createProposal(
        props.connector,
        "0.0.3617300".toString(),
        newProposalDescription,
        newReceipient,
        amountInTinybar,
        50,
        proposalType
      );
      alert("Proposal created successfully.");
      // Reset state and close modal here
      setIsNewProposalModalOpen(false);
      // Optionally, refresh proposals list
    } catch (error) {
      console.error("Failed to create proposal:", error);
      alert("Failed to create proposal.");
    }
  };

  const viewHistoricalProposals = () => {
    navigate("/historical-proposals");
  };

  const handleViewVotesClick = (proposalVotes) => {
    setSelectedVotes(proposalVotes);
    setIsVotesModalOpen(true);
  };

  const handleCloseVotesModal = () => {
    setIsVotesModalOpen(false);
  };

  return (
    <div className="proposals">
      <button
        className="button add-proposal-button"
        onClick={handleAddProposal}
      >
        Add New Proposal
      </button>
      <button
        className="button view-history-button"
        onClick={viewHistoricalProposals}
      >
        View Historical Proposals
      </button>
      <ul className="proposal-list">
        {proposals.map((proposal) => (
          <li key={proposal.id} className="proposal-item">
            <h2>{proposal.title}</h2>
            <p>{proposal.description}</p>
            <p>Votes: {proposal.votes}</p>
            <button
              className="button"
              onClick={() => handleVoteClick(proposal)}
            >
              Vote
            </button>
            <button
              className="button view-votes-button"
              onClick={() => handleViewVotesClick(proposal.voteDetails)}
            >
              View Votes
            </button>
          </li>
        ))}
      </ul>
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <header className="modal-header">
              <h2>Vote on Proposal</h2>
              <button onClick={handleCloseModal} className="modal-close-button">
                &times;
              </button>
            </header>
            <div className="modal-body">
              <p>
                <strong>{selectedProposal.title}</strong>
              </p>
              <div className="vote-options">
                <label className="vote-option">
                  <input
                    type="radio"
                    name="vote"
                    value="approve"
                    checked={vote === "approve"}
                    onChange={(e) => setVote(e.target.value)}
                  />
                  <span
                    className={`vote-indicator approve ${
                      vote === "approve" ? "selected" : ""
                    }`}
                  >
                    Approve
                  </span>
                </label>
                <label className="vote-option">
                  <input
                    type="radio"
                    name="vote"
                    value="reject"
                    checked={vote === "reject"}
                    onChange={(e) => setVote(e.target.value)}
                  />
                  <span
                    className={`vote-indicator reject ${
                      vote === "reject" ? "selected" : ""
                    }`}
                  >
                    Reject
                  </span>
                </label>
              </div>
              <textarea
                className="comment-box"
                placeholder="Add your comment here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <button className="button" onClick={handleSubmitVote}>
                Submit Vote
              </button>
            </div>
          </div>
        </div>
      )}
      {isNewProposalModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <header className="modal-header">
              <h2>Add New Proposal</h2>
              <button
                onClick={handleCloseNewProposalModal}
                className="modal-close-button"
              >
                &times;
              </button>
            </header>
            <div className="modal-body">
              <select
                className="modal-input"
                value={proposalType}
                onChange={(e) => setProposalType(e.target.value)}
              >
                <option value="simple">Simple</option>
                <option value="financial">Financial</option>
              </select>
              <textarea
                placeholder="Proposal Description"
                className="modal-input"
                value={newProposalDescription}
                onChange={(e) => setNewProposalDescription(e.target.value)}
              />
              <input
                type="text"
                placeholder="Recipient"
                className="modal-input"
                value={newReceipient}
                onChange={(e) => setnewReceipient(e.target.value)}
              />
              <input
                type="number"
                placeholder="Amount in tinybar"
                className="modal-input"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
              />
              <button className="button" onClick={handleSubmitNewProposal}>
                Submit Proposal
              </button>
            </div>
          </div>
        </div>
      )}
      {isVotesModalOpen && (
        <div className="modal-backdrop">
          <div className="modal votes-modal">
            <header className="modal-header">
              <h2>Votes Detail</h2>
              <button
                onClick={handleCloseVotesModal}
                className="modal-close-button"
              >
                &times;
              </button>
            </header>
            <div className="modal-body">
              {selectedVotes.map((voteDetail, index) => (
                <div key={index} className="vote-detail">
                  <p>Voter: {voteDetail.voterName}</p>
                  <p>Vote: {voteDetail.vote}</p>
                  <p>Comment: {voteDetail.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Proposals;
