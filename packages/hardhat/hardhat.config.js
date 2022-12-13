require("@nomiclabs/hardhat-waffle");
require("@semaphore-protocol/hardhat");
require("@nomiclabs/hardhat-waffle");
require("hardhat-abi-exporter");
require("dotenv").config();
require("./tasks/deploy");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 31337,
    },
  },
  abiExporter: {
    path: "../next-app/contracts/ABI",
    runOnCompile: true,
    clear: true,
    flat: true,
    only: [],
    spacing: 2,
    pretty: false,
  },
  etherscan: {
    api: process.env.ETHERSCAN_KEY,
  },
};
