import {
  ContractExecuteTransaction,
  ContractFunctionParameters,
  ContractId,
  AccountId,
  TransactionId,
} from "@hashgraph/sdk";

// Function to create a proposal in the LightencyDAO contract
export const createProposal = async (
  bladeConnector,
  contractId,
  description,
  recipient,
  amount,
  threshold,
  proposalType
) => {
  if (!bladeConnector) {
    throw new Error("Blade connector is not initialized.");
  }

  try {
    const bladeSigner = await bladeConnector.getSigner();
    console.log("blade signer", bladeSigner);
    // Convert proposalType to the contract's expected format
    const proposalTypeParam = proposalType === "Financial" ? 1 : 0;

    const contractExecuteTx = new ContractExecuteTransaction()
      .setContractId(ContractId.fromString(contractId))
      .setGas(1000000)
      .setFunction(
        "createProposal",
        new ContractFunctionParameters()
          .addString(description)
          .addAddress(AccountId.fromString(recipient))
          .addUint256(amount)
          .addUint256(threshold)
          ._addParam(proposalTypeParam)
      )
      .setTransactionId(TransactionId.generate(bladeSigner.getAccountId()))
      .setNodeAccountIds([new AccountId(3)])
      .freeze();

    const signedTransaction = await bladeSigner.signTransaction(
      contractExecuteTx
    );

    // call executes the transaction
    const result = await bladeSigner.call(signedTransaction);

    // Request the receipt of the transaction
    const receipt = await result.getReceiptWithSigner(bladeSigner);

    console.log("Transaction status:", receipt.status.toString());
    return receipt;
  } catch (error) {
    console.error("Error executing smart contract function:", error);
    throw error;
  }
};

// Function to vote on a proposal in the LightencyDAO Contract
export const voteProposal = async (
  bladeConnector,
  contractId,
  proposalIndex,
  approve,
  comment
) => {
  if (!bladeConnector) {
    throw new Error("Blade connector is not initialized.");
  }

  try {
    const bladeSigner = await bladeConnector.getSigner();
    console.log("blade signer", bladeSigner);

    const contractExecuteTx = new ContractExecuteTransaction()
      .setContractId(ContractId.fromString(contractId))
      .setGas(100000)
      .setFunction(
        "voteOnProposal",
        new ContractFunctionParameters()
          .addUint256(proposalIndex)
          .addBool(approve)
          .addBytes32(comment)
      )
      .setTransactionId(TransactionId.generate(bladeSigner.getAccountId()))
      .setNodeAccountIds([new AccountId(3)])
      .freeze();
    const signedTransaction = await bladeSigner.signTransaction(
      contractExecuteTx
    );

    // call executes the transaction
    const result = await bladeSigner.call(signedTransaction);

    // Request the receipt of the transaction
    const receipt = await result.getReceiptWithSigner(bladeSigner);

    console.log("Transaction status:", receipt.status.toString());
    return receipt;
  } catch (error) {
    console.error("Error executing smart contract function:", error);
    throw error;
  }
};

// Function to execute proposal
export const executeProposal = async (
  bladeConnector,
  contractId,
  proposalIndex
) => {
  if (!bladeConnector) {
    throw new Error("Blade connector is not initialized.");
  }

  try {
    const bladeSigner = await bladeConnector.getSigner();
    console.log("blade signer", bladeSigner);

    const contractExecuteTx = new ContractExecuteTransaction()
      .setContractId(ContractId.fromString(contractId))
      .setGas(400000)
      .setFunction(
        "addMember",
        new ContractFunctionParameters().addUint256(proposalIndex)
      )
      .setTransactionId(TransactionId.generate(bladeSigner.getAccountId()))
      .setNodeAccountIds([new AccountId(3)])
      .freeze();

    const signedTransaction = await bladeSigner.signTransaction(
      contractExecuteTx
    );

    // call executes the transaction
    const result = await bladeSigner.call(signedTransaction);

    // Request the receipt of the transaction
    const receipt = await result.getReceiptWithSigner(bladeSigner);

    console.log("Transaction status:", receipt.status.toString());
    return receipt;
  } catch (error) {
    console.error("Error executing smart contract function:", error);
    throw error;
  }
};

// Function to add a new simple member
export const addSimpleMember = async (
  bladeConnector,
  contractId,
  memberAddress,
  memberName
) => {
  if (!bladeConnector) {
    throw new Error("Blade connector is not initialized.");
  }

  try {
    const bladeSigner = await bladeConnector.getSigner();
    console.log("blade signer", bladeSigner);

    const contractExecuteTx = new ContractExecuteTransaction()
      .setContractId(ContractId.fromString(contractId))
      .setGas(400000)
      .setFunction(
        "addMember",
        new ContractFunctionParameters()
          .addAddress(AccountId.fromString(memberAddress))
          .addString(memberName)
      )
      .setTransactionId(TransactionId.generate(bladeSigner.getAccountId()))
      .setNodeAccountIds([new AccountId(3)])
      .freeze();

    const signedTransaction = await bladeSigner.signTransaction(
      contractExecuteTx
    );

    // call executes the transaction
    const result = await bladeSigner.call(signedTransaction);

    // Request the receipt of the transaction
    const receipt = await result.getReceiptWithSigner(bladeSigner);

    console.log("Transaction status:", receipt.status.toString());
    return receipt;
  } catch (error) {
    console.error("Error executing smart contract function:", error);
    throw error;
  }
};

// Function to add a new council member
export const addCouncilMember = async (
  bladeConnector,
  contractId,
  memberAddress,
  memberName
) => {
  if (!bladeConnector) {
    throw new Error("Blade connector is not initialized.");
  }

  try {
    const bladeSigner = await bladeConnector.getSigner();
    console.log("blade signer", bladeSigner);

    const contractExecuteTx = new ContractExecuteTransaction()
      .setContractId(ContractId.fromString(contractId))
      .setGas(400000)
      .setFunction(
        "addCouncilMember",
        new ContractFunctionParameters()
          .addAddress(AccountId.fromString(memberAddress))
          .addString(memberName)
      )
      .setTransactionId(TransactionId.generate(bladeSigner.getAccountId()))
      .setNodeAccountIds([new AccountId(3)])
      .freeze();

    const signedTransaction = await bladeSigner.signTransaction(
      contractExecuteTx
    );

    // call executes the transaction
    const result = await bladeSigner.call(signedTransaction);

    // Request the receipt of the transaction
    const receipt = await result.getReceiptWithSigner(bladeSigner);

    console.log("Transaction status:", receipt.status.toString());
    return receipt;
  } catch (error) {
    console.error("Error executing smart contract function:", error);
    throw error;
  }
};

// Function to remove a member
export const removeMember = async (
  bladeConnector,
  contractId,
  memberAddress
) => {
  if (!bladeConnector) {
    throw new Error("Blade connector is not initialized.");
  }
  try {
    const bladeSigner = await bladeConnector.getSigner();
    console.log("blade signer", bladeSigner);

    const contractExecuteTx = new ContractExecuteTransaction()
      .setContractId(ContractId.fromString(contractId))
      .setGas(400000)
      .setFunction(
        "removeMember",
        new ContractFunctionParameters().addAddress(
          AccountId.fromString(memberAddress)
        )
      )
      .setTransactionId(TransactionId.generate(bladeSigner.getAccountId()))
      .setNodeAccountIds([new AccountId(3)])
      .freeze();

    const signedTransaction = await bladeSigner.signTransaction(
      contractExecuteTx
    );

    // call executes the transaction
    const result = await bladeSigner.call(signedTransaction);

    // Request the receipt of the transaction
    const receipt = await result.getReceiptWithSigner(bladeSigner);

    console.log("Transaction status:", receipt.status.toString());
    return receipt;
  } catch (error) {
    console.error("Error executing smart contract function:", error);
    throw error;
  }
};
