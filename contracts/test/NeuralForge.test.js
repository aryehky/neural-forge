const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NeuralForge", function () {
  let nfgToken;
  let marketplace;
  let training;
  let owner;
  let user1;
  let user2;
  let initialSupply;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    initialSupply = ethers.utils.parseEther("1000000"); // 1 million tokens

    // Deploy NFG Token
    const NeuralForgeToken = await ethers.getContractFactory("NeuralForgeToken");
    nfgToken = await NeuralForgeToken.deploy();
    await nfgToken.deployed();

    // Deploy Marketplace
    const AIModelMarketplace = await ethers.getContractFactory("AIModelMarketplace");
    marketplace = await AIModelMarketplace.deploy(nfgToken.address);
    await marketplace.deployed();

    // Deploy Training Contract
    const TrainingContract = await ethers.getContractFactory("TrainingContract");
    training = await TrainingContract.deploy(nfgToken.address);
    await training.deployed();

    // Mint tokens to users
    await nfgToken.mint(owner.address, initialSupply);
    await nfgToken.mint(user1.address, ethers.utils.parseEther("1000"));
    await nfgToken.mint(user2.address, ethers.utils.parseEther("1000"));
  });

  describe("Token", function () {
    it("Should have correct name and symbol", async function () {
      expect(await nfgToken.name()).to.equal("NeuralForge Token");
      expect(await nfgToken.symbol()).to.equal("NFG");
    });

    it("Should mint tokens correctly", async function () {
      expect(await nfgToken.balanceOf(owner.address)).to.equal(initialSupply);
    });
  });

  describe("Marketplace", function () {
    const modelPrice = ethers.utils.parseEther("1");
    const royaltyPercentage = 10;

    it("Should list a model correctly", async function () {
      await nfgToken.connect(user1).approve(marketplace.address, modelPrice);
      const tx = await marketplace.connect(user1).listModel(
        "ipfs://model1",
        modelPrice,
        royaltyPercentage
      );
      const receipt = await tx.wait();
      const event = receipt.events.find(e => e.event === "ModelListed");
      expect(event.args.owner).to.equal(user1.address);
      expect(event.args.price).to.equal(modelPrice);
    });

    it("Should buy a model correctly", async function () {
      // List model
      await nfgToken.connect(user1).approve(marketplace.address, modelPrice);
      const tx = await marketplace.connect(user1).listModel(
        "ipfs://model1",
        modelPrice,
        royaltyPercentage
      );
      const receipt = await tx.wait();
      const modelId = receipt.events.find(e => e.event === "ModelListed").args.modelId;

      // Buy model
      await nfgToken.connect(user2).approve(marketplace.address, modelPrice);
      await marketplace.connect(user2).buyModel(modelId);

      const modelDetails = await marketplace.getModelDetails(modelId);
      expect(modelDetails.owner).to.equal(user2.address);
      expect(modelDetails.isForSale).to.equal(false);
    });
  });

  describe("Training", function () {
    const reward = ethers.utils.parseEther("1");
    const requiredComputingPower = 100;
    const duration = 3600; // 1 hour

    it("Should create a training job correctly", async function () {
      await nfgToken.connect(user1).approve(training.address, reward);
      const tx = await training.connect(user1).createTrainingJob(
        "ipfs://model1",
        "ipfs://dataset1",
        reward,
        requiredComputingPower,
        duration
      );
      const receipt = await tx.wait();
      const event = receipt.events.find(e => e.event === "JobCreated");
      expect(event.args.owner).to.equal(user1.address);
      expect(event.args.reward).to.equal(reward);
    });

    it("Should submit training results correctly", async function () {
      // Create job
      await nfgToken.connect(user1).approve(training.address, reward);
      const tx = await training.connect(user1).createTrainingJob(
        "ipfs://model1",
        "ipfs://dataset1",
        reward,
        requiredComputingPower,
        duration
      );
      const receipt = await tx.wait();
      const jobId = receipt.events.find(e => e.event === "JobCreated").args.jobId;

      // Submit results
      await training.connect(user2).submitTrainingResult(
        jobId,
        "ipfs://result1",
        95
      );

      const jobDetails = await training.getJobDetails(jobId);
      expect(jobDetails.participantCount).to.equal(1);
    });
  });
}); 