import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { ethers } from 'ethers';

// Contract ABIs
import NFGTokenABI from '../contracts/NeuralForgeToken.json';
import MarketplaceABI from '../contracts/AIModelMarketplace.json';
import TrainingABI from '../contracts/TrainingContract.json';

// Contract addresses (to be updated after deployment)
const CONTRACT_ADDRESSES = {
  nfgToken: process.env.REACT_APP_NFG_TOKEN_ADDRESS || '',
  marketplace: process.env.REACT_APP_MARKETPLACE_ADDRESS || '',
  training: process.env.REACT_APP_TRAINING_ADDRESS || '',
};

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42], // Mainnet, Ropsten, Rinkeby, Goerli, Kovan
});

interface Web3ContextType {
  account: string | null;
  chainId: number | null;
  isActive: boolean;
  isActivating: boolean;
  error: Error | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  nfgToken: ethers.Contract | null;
  marketplace: ethers.Contract | null;
  training: ethers.Contract | null;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  chainId: null,
  isActive: false,
  isActivating: false,
  error: null,
  connect: async () => {},
  disconnect: () => {},
  nfgToken: null,
  marketplace: null,
  training: null,
});

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { account, chainId, activate, deactivate, active, error, library } = useWeb3React();
  const [isActivating, setIsActivating] = useState(false);
  const [contracts, setContracts] = useState<{
    nfgToken: ethers.Contract | null;
    marketplace: ethers.Contract | null;
    training: ethers.Contract | null;
  }>({
    nfgToken: null,
    marketplace: null,
    training: null,
  });

  useEffect(() => {
    if (library && active) {
      const signer = library.getSigner();
      
      // Initialize contracts
      const nfgToken = new ethers.Contract(
        CONTRACT_ADDRESSES.nfgToken,
        NFGTokenABI.abi,
        signer
      );

      const marketplace = new ethers.Contract(
        CONTRACT_ADDRESSES.marketplace,
        MarketplaceABI.abi,
        signer
      );

      const training = new ethers.Contract(
        CONTRACT_ADDRESSES.training,
        TrainingABI.abi,
        signer
      );

      setContracts({ nfgToken, marketplace, training });
    }
  }, [library, active]);

  const connect = async () => {
    try {
      setIsActivating(true);
      await activate(injected);
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    } finally {
      setIsActivating(false);
    }
  };

  const disconnect = () => {
    deactivate();
  };

  return (
    <Web3Context.Provider
      value={{
        account: account || null,
        chainId: chainId || null,
        isActive: active,
        isActivating,
        error: error || null,
        connect,
        disconnect,
        nfgToken: contracts.nfgToken,
        marketplace: contracts.marketplace,
        training: contracts.training,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}; 