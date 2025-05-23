// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TrainingContract is ReentrancyGuard, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant TRAINER_ROLE = keccak256("TRAINER_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    IERC20 public nfgToken;
    Counters.Counter private _trainingJobIds;

    struct TrainingJob {
        uint256 id;
        address owner;
        string modelIpfsHash;
        string datasetIpfsHash;
        uint256 reward;
        uint256 requiredComputingPower;
        uint256 deadline;
        bool isCompleted;
        bool isVerified;
        address[] participants;
        mapping(address => bool) hasSubmitted;
    }

    struct TrainingSubmission {
        string resultIpfsHash;
        uint256 accuracy;
        uint256 timestamp;
    }

    mapping(uint256 => TrainingJob) public trainingJobs;
    mapping(uint256 => mapping(address => TrainingSubmission)) public submissions;
    mapping(address => uint256[]) public userJobs;

    event JobCreated(uint256 indexed jobId, address indexed owner, uint256 reward);
    event JobCompleted(uint256 indexed jobId, address indexed participant);
    event JobVerified(uint256 indexed jobId, address indexed verifier);
    event RewardDistributed(uint256 indexed jobId, address indexed participant, uint256 amount);

    constructor(address _nfgToken) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(TRAINER_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
        nfgToken = IERC20(_nfgToken);
    }

    function createTrainingJob(
        string memory _modelIpfsHash,
        string memory _datasetIpfsHash,
        uint256 _reward,
        uint256 _requiredComputingPower,
        uint256 _duration
    ) external returns (uint256) {
        require(_reward > 0, "Reward must be greater than 0");
        require(_requiredComputingPower > 0, "Computing power must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");

        require(nfgToken.transferFrom(msg.sender, address(this), _reward), "Token transfer failed");

        _trainingJobIds.increment();
        uint256 jobId = _trainingJobIds.current();

        TrainingJob storage job = trainingJobs[jobId];
        job.id = jobId;
        job.owner = msg.sender;
        job.modelIpfsHash = _modelIpfsHash;
        job.datasetIpfsHash = _datasetIpfsHash;
        job.reward = _reward;
        job.requiredComputingPower = _requiredComputingPower;
        job.deadline = block.timestamp + _duration;
        job.isCompleted = false;
        job.isVerified = false;

        userJobs[msg.sender].push(jobId);
        emit JobCreated(jobId, msg.sender, _reward);
        return jobId;
    }

    function submitTrainingResult(
        uint256 _jobId,
        string memory _resultIpfsHash,
        uint256 _accuracy
    ) external nonReentrant {
        TrainingJob storage job = trainingJobs[_jobId];
        require(!job.isCompleted, "Job is already completed");
        require(block.timestamp <= job.deadline, "Job deadline has passed");
        require(!job.hasSubmitted[msg.sender], "Already submitted");

        job.hasSubmitted[msg.sender] = true;
        job.participants.push(msg.sender);

        submissions[_jobId][msg.sender] = TrainingSubmission({
            resultIpfsHash: _resultIpfsHash,
            accuracy: _accuracy,
            timestamp: block.timestamp
        });

        emit JobCompleted(_jobId, msg.sender);
    }

    function verifyAndDistributeRewards(uint256 _jobId) external {
        require(hasRole(VERIFIER_ROLE, msg.sender), "Not authorized to verify");
        TrainingJob storage job = trainingJobs[_jobId];
        require(!job.isVerified, "Job already verified");
        require(job.participants.length > 0, "No submissions");

        job.isVerified = true;
        job.isCompleted = true;

        // Find the best submission
        address bestParticipant = job.participants[0];
        uint256 bestAccuracy = submissions[_jobId][bestParticipant].accuracy;

        for (uint256 i = 1; i < job.participants.length; i++) {
            address participant = job.participants[i];
            uint256 accuracy = submissions[_jobId][participant].accuracy;
            if (accuracy > bestAccuracy) {
                bestAccuracy = accuracy;
                bestParticipant = participant;
            }
        }

        // Distribute reward to the best participant
        require(nfgToken.transfer(bestParticipant, job.reward), "Reward transfer failed");
        emit RewardDistributed(_jobId, bestParticipant, job.reward);
        emit JobVerified(_jobId, msg.sender);
    }

    function getUserJobs(address _user) external view returns (uint256[] memory) {
        return userJobs[_user];
    }

    function getJobDetails(uint256 _jobId) external view returns (
        address owner,
        string memory modelIpfsHash,
        string memory datasetIpfsHash,
        uint256 reward,
        uint256 requiredComputingPower,
        uint256 deadline,
        bool isCompleted,
        bool isVerified,
        uint256 participantCount
    ) {
        TrainingJob storage job = trainingJobs[_jobId];
        return (
            job.owner,
            job.modelIpfsHash,
            job.datasetIpfsHash,
            job.reward,
            job.requiredComputingPower,
            job.deadline,
            job.isCompleted,
            job.isVerified,
            job.participants.length
        );
    }
} 