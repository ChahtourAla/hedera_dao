import React, { useState } from "react";

const HistoricalProposals = () => {
  const [isVotesModalOpen, setIsVotesModalOpen] = useState(false);
  const [selectedVotes, setSelectedVotes] = useState([]);
  const [proposals, setProposals] = useState([
    {
      id: 1,
      title: "Proposal 1",
      description: "Description of Proposal 1",
      status: "Accepted",
      voteDetails: [
        { voterName: "Alice", vote: "Approve", comment: "Great idea!" },
        { voterName: "Bob", vote: "Reject", comment: "Needs more discussion." },
      ],
    },
    {
      id: 2,
      title: "Proposal 2",
      description: "Description of Proposal 2",
      status: "Rejected",
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

  const handleViewVotesClick = (proposalVotes) => {
    setSelectedVotes(proposalVotes);
    setIsVotesModalOpen(true);
  };

  const handleCloseVotesModal = () => {
    setIsVotesModalOpen(false);
  };

  return (
    <div>
      <h1>Historical Proposals</h1>
      <ul className="proposal-list">
        {proposals.map((proposal) => (
          <li key={proposal.id} className="proposal-item">
            <h2>{proposal.title}</h2>
            <p>{proposal.description}</p>
            <p>Votes: {proposal.status}</p>
            <button
              className="button view-votes-button"
              onClick={() => handleViewVotesClick(proposal.voteDetails)}
            >
              View Votes
            </button>
          </li>
        ))}
      </ul>
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
};

export default HistoricalProposals;
