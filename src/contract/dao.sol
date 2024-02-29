// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LightencyDAO {
    enum ProposalStatus { Pending, Accepted, Refused }
    enum ProposalType { Simple, Financial }

    struct Vote {
        address voter;
        bool approve;
        bytes32 comment;
        bool hasVoted; 
    }

    struct Proposal {
        uint256 id;
        string description;
        address payable recipient;
        uint256 amount;
        uint256 approveCount;
        uint256 rejectCount;
        bool executed;
        uint256 deadline;
        uint256 threshold;
        ProposalStatus status;
        ProposalType proposalType;
        mapping(address => Vote) votes;
    }

    struct ProposalInfo {
        uint256 id;
        string description;
        address recipient;
        uint256 amount;
        uint256 approveCount;
        uint256 rejectCount;
        bool executed;
        uint256 deadline;
        uint256 threshold;
        ProposalStatus status;
        ProposalType proposalType;
    }

    struct Member {
        bool isCouncil;
        string name;
    }

    mapping(address => Member) public members;
    address[] private councilMembers;
    address[] private simpleMembers;
    Proposal[] public proposals;

    // Events
    event MemberAdded(address member, bool isCouncil, string name);
    event MemberRemoved(address member);
    event CouncilMemberAdded(address member);
    event ProposalCreated(uint256 id, string description, address recipient, uint256 amount, uint256 deadline, uint256 threshold, ProposalType proposalType);
    event VotedOnProposal(uint256 proposalId, address voter, bool approve, bytes32 comment);
    event ProposalExecuted(uint256 id, ProposalStatus status, uint256 approveCount, uint256 rejectCount);
    event DaoFunded(address sender, uint256 amount);

    modifier onlyMember() {
        require(bytes(members[msg.sender].name).length > 0, "Not a member");
        _;
    }

    modifier onlyCouncil() {
        require(members[msg.sender].isCouncil, "Only council members allowed");
        _;
    }

    constructor(address _councilMember, string memory _councilName) {
        members[_councilMember] = Member(true, _councilName);
        councilMembers.push(_councilMember);
        emit CouncilMemberAdded(_councilMember);
    }

    function fundDao() external payable {
        emit DaoFunded(msg.sender, msg.value);
    }

    function addMember(address _member, string memory _name) external onlyCouncil {
        require(bytes(members[_member].name).length == 0, "Already a member");
        members[_member] = Member(false, _name);
        simpleMembers.push(_member);
        emit MemberAdded(_member, false, _name);
    }

    function addCouncilMember(address _member, string memory _name) external onlyCouncil {
        require(bytes(members[_member].name).length == 0, "Already a member");
        members[_member] = Member(true, _name);
        councilMembers.push(_member);
        emit CouncilMemberAdded(_member);
    }

    function removeMember(address _member) external onlyCouncil {
        require(bytes(members[_member].name).length > 0, "Not a member");
        delete members[_member];
        emit MemberRemoved(_member);
    }

    function createProposal(string memory _description, address payable _recipient, uint256 _amount, uint256 _threshold, ProposalType _proposalType) external onlyMember {
        uint256 proposalId = proposals.length;
        proposals.push();
        Proposal storage newProposal = proposals[proposalId];
        newProposal.id = proposalId;
        newProposal.description = _description;
        newProposal.recipient = _recipient;
        newProposal.amount = _amount;
        newProposal.approveCount = 0;
        newProposal.rejectCount = 0;
        newProposal.executed = false;
        newProposal.deadline = block.timestamp + 24 hours;
        newProposal.threshold = _threshold;
        newProposal.status = ProposalStatus.Pending;
        newProposal.proposalType = _proposalType;
        emit ProposalCreated(proposalId, _description, _recipient, _amount, newProposal.deadline, _threshold, _proposalType);
    }

    function voteOnProposal(uint256 _proposalIndex, bool approve, bytes32 comment) external onlyMember {
        require(_proposalIndex < proposals.length, "Proposal does not exist");
        Proposal storage proposal = proposals[_proposalIndex];
        require(block.timestamp < proposal.deadline, "Voting period has ended");
        require(!proposal.executed, "Proposal already executed");
        require(!proposal.votes[msg.sender].hasVoted, "Already voted"); 

        if (approve) {
            proposal.approveCount += 1;
        } else {
            proposal.rejectCount += 1;
        }

        proposal.votes[msg.sender] = Vote(msg.sender, approve, comment, true); 

        emit VotedOnProposal(_proposalIndex, msg.sender, approve, comment);
    }

    function executeProposal(uint256 _proposalIndex) external onlyMember {
        require(_proposalIndex < proposals.length, "Proposal does not exist");
        Proposal storage proposal = proposals[_proposalIndex];
        require(block.timestamp > proposal.deadline, "Proposal deadline has not passed");
        require(!proposal.executed, "Proposal already executed");
        proposal.executed = true;
        uint256 votesNeeded = (councilMembers.length + simpleMembers.length) * proposal.threshold / 100;
        if (proposal.approveCount >= votesNeeded && proposal.approveCount > proposal.rejectCount) {
            if (proposal.proposalType == ProposalType.Financial) {
                proposal.recipient.transfer(proposal.amount);
            }
            proposal.status = ProposalStatus.Accepted;
        } else {
            proposal.status = ProposalStatus.Refused;
        }
        emit ProposalExecuted(_proposalIndex, proposal.status, proposal.approveCount, proposal.rejectCount);
    }

    function getDaoBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getCouncilMembers() external view returns (address[] memory) {
        return councilMembers;
    }

    function getSimpleMembers() external view returns (address[] memory) {
        return simpleMembers;
    }

    function getAllMembers() external view returns (address[] memory allMembers) {
        allMembers = new address[](councilMembers.length + simpleMembers.length);
        for (uint i = 0; i < councilMembers.length; i++) {
            allMembers[i] = councilMembers[i];
        }
        for (uint i = 0; i < simpleMembers.length; i++) {
            allMembers[i + councilMembers.length] = simpleMembers[i];
        }
        return allMembers;
    }

    function getAllProposals() external view returns (ProposalInfo[] memory) {
        ProposalInfo[] memory infos = new ProposalInfo[](proposals.length);
        for (uint i = 0; i < proposals.length; i++) {
            Proposal storage proposal = proposals[i];
            infos[i] = ProposalInfo({
                id: proposal.id,
                description: proposal.description,
                recipient: proposal.recipient,
                amount: proposal.amount,
                approveCount: proposal.approveCount,
                rejectCount: proposal.rejectCount,
                executed: proposal.executed,
                deadline: proposal.deadline,
                threshold: proposal.threshold,
                status: proposal.status,
                proposalType: proposal.proposalType
            });
        }
        return infos;
    }

    function getVotesForProposal(uint256 proposalId) external view returns (address[] memory, bool[] memory, bytes32[] memory) {
        require(proposalId < proposals.length, "Proposal does not exist");

        // Temporary solution to count votes due to lack of direct mapping length access
        uint256 voteCount = 0;
        for (uint256 i = 0; i < simpleMembers.length + councilMembers.length; i++) {
            address member = i < simpleMembers.length ? simpleMembers[i] : councilMembers[i - simpleMembers.length];
            if (proposals[proposalId].votes[member].hasVoted) {
                voteCount++;
            }
        }

        address[] memory voters = new address[](voteCount);
        bool[] memory approvals = new bool[](voteCount);
        bytes32[] memory comments = new bytes32[](voteCount);

        uint256 index = 0;
        for (uint256 i = 0; i < simpleMembers.length + councilMembers.length; i++) {
            address member = i < simpleMembers.length ? simpleMembers[i] : councilMembers[i - simpleMembers.length];
            if (proposals[proposalId].votes[member].hasVoted) {
                voters[index] = member;
                approvals[index] = proposals[proposalId].votes[member].approve;
                comments[index] = proposals[proposalId].votes[member].comment;
                index++;
            }
        }

        return (voters, approvals, comments);
    }


    receive() external payable {}
    fallback() external payable {}
}
