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
  deadline,
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
          .addUint256(deadline)
          .addUint256(threshold)
          ._addParam(proposalTypeParam)
      )
      .setTransactionId(TransactionId.generate(bladeSigner.getAccountId()))
      .setNodeAccountIds([new AccountId(3)])
      .freeze();

    // populate adds transaction ID and node IDs to the transaction
    // const populatedTransaction = await bladeSigner.populateTransaction(
    //   contractExecuteTx
    // );
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
