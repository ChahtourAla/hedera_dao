console.clear();
const {
  Client,
  PrivateKey,
  ContractCreateFlow,
  ContractFunctionParameters,
  AccountId,
} = require("@hashgraph/sdk");
require("dotenv").config();
const fs = require("fs");

//Grab your Hedera testnet account ID and private key from your .env file
const myAccountId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
const myPrivateKey = PrivateKey.fromStringDer(process.env.MY_PRIVATE_KEY);

//Create your Hedera Testnet client
const client = Client.forTestnet();

//Set your account as the client's operator
client.setOperator(myAccountId, myPrivateKey);

//Get the contract Bytecode
const contractBytecode = fs.readFileSync("dao_sol_LightencyDAO.bin");
async function deployContract(accountId, name) {
  const contractCreate = new ContractCreateFlow()
    .setGas(400000)
    .setBytecode(contractBytecode)
    .setConstructorParameters(
      new ContractFunctionParameters().addAddress(accountId).addString(name)
    );
  const tx = await contractCreate.execute(client);
  const reciept = await tx.getReceipt(client);

  return reciept.contractId;
}

async function main() {
  const contractId = await deployContract(
    myAccountId,
    "Ala Chahtour".toString()
  );
  console.log("Contract Created with ID: ", contractId.toString());
  console.log("-----------------------------------");
}
main();
