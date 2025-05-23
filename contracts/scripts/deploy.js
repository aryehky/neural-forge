const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy NFG Token
  const NeuralForgeToken = await hre.ethers.getContractFactory("NeuralForgeToken");
  const nfgToken = await NeuralForgeToken.deploy();
  await nfgToken.deployed();
  console.log("NeuralForgeToken deployed to:", nfgToken.address);

  // Deploy AI Model Marketplace
  const AIModelMarketplace = await hre.ethers.getContractFactory("AIModelMarketplace");
  const marketplace = await AIModelMarketplace.deploy(nfgToken.address);
  await marketplace.deployed();
  console.log("AIModelMarketplace deployed to:", marketplace.address);

  // Deploy Training Contract
  const TrainingContract = await hre.ethers.getContractFactory("TrainingContract");
  const training = await TrainingContract.deploy(nfgToken.address);
  await training.deployed();
  console.log("TrainingContract deployed to:", training.address);

  // Grant roles
  const TRAINER_ROLE = await training.TRAINER_ROLE();
  const VERIFIER_ROLE = await training.VERIFIER_ROLE();
  const ADMIN_ROLE = await marketplace.ADMIN_ROLE();
  const MARKETPLACE_VERIFIER_ROLE = await marketplace.VERIFIER_ROLE();

  await training.grantRole(TRAINER_ROLE, deployer.address);
  await training.grantRole(VERIFIER_ROLE, deployer.address);
  await marketplace.grantRole(ADMIN_ROLE, deployer.address);
  await marketplace.grantRole(MARKETPLACE_VERIFIER_ROLE, deployer.address);

  console.log("Roles granted to deployer");

  // Mint initial tokens to deployer
  const initialSupply = hre.ethers.utils.parseEther("1000000"); // 1 million tokens
  await nfgToken.mint(deployer.address, initialSupply);
  console.log("Initial tokens minted to deployer");

  // Save deployment info
  const deploymentInfo = {
    nfgToken: nfgToken.address,
    marketplace: marketplace.address,
    training: training.address,
    network: hre.network.name,
    deployer: deployer.address
  };

  console.log("Deployment info:", deploymentInfo);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 