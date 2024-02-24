import { BladeConnector, ConnectorStrategy } from "@bladelabs/blade-web3.js";

// Initialize BladeConnector with your preferred strategy and dApp metadata
export const bladeConnector = await BladeConnector.init(
  ConnectorStrategy.WALLET_CONNECT, // This is optional, defaults to AUTO
  {
    name: "Lightency and Dar Blockchain Community DAO",
    description: "A community DAO for Lightency and Dar Blockchain Team",
    url: "https://lightency.io/",
    icons: [
      "https://res.cloudinary.com/dtrbcyuox/image/upload/v1698271156/logo-name-dark_vjik3y.png",
    ],
  }
);
