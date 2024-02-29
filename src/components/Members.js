import React, { useState, useEffect } from "react";
import { BladeConnector, ConnectorStrategy } from "@bladelabs/blade-web3.js";
import {
  addSimpleMember,
  addCouncilMember,
  removeMember,
} from "./hedera/contractExecute";

const Members = (props) => {
  const [members, setMembers] = useState([
    {
      accountId: "0.0.1465",
      role: "Council Member",
      name: "Ala Chahtour",
    },
    {
      accountId: "0.0.3629871",
      role: "Council Member",
      name: "Youssef Sghaier",
    },
  ]);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [memberType, setMemberType] = useState("Simple Member");
  const [newAccountId, setNewAccountId] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
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

  const handleAddNewMember = async () => {
    if (!props.connector) {
      alert("Blade Wallet is not connected.");
      return;
    }

    try {
      if (memberType === "Simple Member") {
        await addSimpleMember(
          props.connector,
          "0.0.3617300".toString(),
          newAccountId.toString(),
          newMemberName
        );
        alert("Simple member added successfully.");
        setIsAddMemberModalOpen(false);
      } else {
        await addCouncilMember(
          props.connector,
          "0.0.3617300".toString(),
          newAccountId.toString(),
          newMemberName
        );
        alert("Council member added successfully.");
        setIsAddMemberModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to add member:", error);
      alert("Failed to add member.");
    }
  };

  const handleAddMember = () => {
    setIsAddMemberModalOpen(true);
  };
  const handleCloseAddMemberModal = () => {
    setIsAddMemberModalOpen(false);
  };
  return (
    <div>
      <h1>DAO Members</h1>
      <button className="button view-history-button" onClick={handleAddMember}>
        Add New Member
      </button>
      <ul className="proposal-list">
        {members.map((member) => (
          <li key={member.accountId} className="proposal-item">
            <h2>{member.name}</h2>
            <p>{member.accountId}</p>
            <p>{member.role}</p>
            <button
              className="button"
              // onClick={() => handleVoteClick(proposal)}
            >
              Remove Member
            </button>
          </li>
        ))}
      </ul>
      {isAddMemberModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <header className="modal-header">
              <h2>Add New Member</h2>
              <button
                onClick={handleCloseAddMemberModal}
                className="modal-close-button"
              >
                &times;
              </button>
            </header>
            <div className="modal-body">
              <select
                className="modal-input"
                value={memberType}
                onChange={(e) => setMemberType(e.target.value)}
              >
                <option value="financial">Simple Member</option>
                <option value="simple">Council Member</option>
              </select>
              <input
                type="text"
                placeholder="Account ID"
                className="modal-input"
                value={newAccountId}
                onChange={(e) => setNewAccountId(e.target.value)}
              />
              <input
                type="text"
                placeholder="Name"
                className="modal-input"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
              />
              <button className="button" onClick={handleAddNewMember}>
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
