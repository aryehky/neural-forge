// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AIModelMarketplace is ReentrancyGuard, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    IERC20 public nfgToken;
    Counters.Counter private _modelIds;

    struct Model {
        uint256 id;
        address owner;
        string ipfsHash;
        uint256 price;
        bool isForSale;
        bool isVerified;
        uint256 royaltyPercentage;
        uint256 totalSales;
    }

    struct License {
        address licensee;
        uint256 modelId;
        uint256 expiryDate;
        bool isActive;
    }

    mapping(uint256 => Model) public models;
    mapping(uint256 => mapping(address => License)) public licenses;
    mapping(address => uint256[]) public userModels;

    event ModelListed(uint256 indexed modelId, address indexed owner, uint256 price);
    event ModelSold(uint256 indexed modelId, address indexed seller, address indexed buyer, uint256 price);
    event LicenseIssued(uint256 indexed modelId, address indexed licensee, uint256 expiryDate);
    event ModelVerified(uint256 indexed modelId, address indexed verifier);

    constructor(address _nfgToken) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
        nfgToken = IERC20(_nfgToken);
    }

    function listModel(
        string memory _ipfsHash,
        uint256 _price,
        uint256 _royaltyPercentage
    ) external returns (uint256) {
        require(_price > 0, "Price must be greater than 0");
        require(_royaltyPercentage <= 100, "Royalty percentage must be <= 100");

        _modelIds.increment();
        uint256 modelId = _modelIds.current();

        models[modelId] = Model({
            id: modelId,
            owner: msg.sender,
            ipfsHash: _ipfsHash,
            price: _price,
            isForSale: true,
            isVerified: false,
            royaltyPercentage: _royaltyPercentage,
            totalSales: 0
        });

        userModels[msg.sender].push(modelId);
        emit ModelListed(modelId, msg.sender, _price);
        return modelId;
    }

    function buyModel(uint256 _modelId) external nonReentrant {
        Model storage model = models[_modelId];
        require(model.isForSale, "Model is not for sale");
        require(model.owner != msg.sender, "Cannot buy your own model");

        uint256 price = model.price;
        uint256 royaltyAmount = (price * model.royaltyPercentage) / 100;
        uint256 sellerAmount = price - royaltyAmount;

        require(nfgToken.transferFrom(msg.sender, model.owner, sellerAmount), "Token transfer failed");
        if (royaltyAmount > 0) {
            require(nfgToken.transferFrom(msg.sender, address(this), royaltyAmount), "Royalty transfer failed");
        }

        model.owner = msg.sender;
        model.isForSale = false;
        model.totalSales += 1;

        userModels[msg.sender].push(_modelId);
        emit ModelSold(_modelId, model.owner, msg.sender, price);
    }

    function issueLicense(uint256 _modelId, address _licensee, uint256 _duration) external {
        require(hasRole(ADMIN_ROLE, msg.sender) || models[_modelId].owner == msg.sender, "Not authorized");
        require(_duration > 0, "Duration must be greater than 0");

        licenses[_modelId][_licensee] = License({
            licensee: _licensee,
            modelId: _modelId,
            expiryDate: block.timestamp + _duration,
            isActive: true
        });

        emit LicenseIssued(_modelId, _licensee, block.timestamp + _duration);
    }

    function verifyModel(uint256 _modelId) external {
        require(hasRole(VERIFIER_ROLE, msg.sender), "Not authorized to verify");
        models[_modelId].isVerified = true;
        emit ModelVerified(_modelId, msg.sender);
    }

    function getUserModels(address _user) external view returns (uint256[] memory) {
        return userModels[_user];
    }

    function getModelDetails(uint256 _modelId) external view returns (
        address owner,
        string memory ipfsHash,
        uint256 price,
        bool isForSale,
        bool isVerified,
        uint256 royaltyPercentage,
        uint256 totalSales
    ) {
        Model storage model = models[_modelId];
        return (
            model.owner,
            model.ipfsHash,
            model.price,
            model.isForSale,
            model.isVerified,
            model.royaltyPercentage,
            model.totalSales
        );
    }
} 