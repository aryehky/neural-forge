import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import { useWeb3 } from '../../contexts/Web3Context';

interface Model {
  id: number;
  owner: string;
  ipfsHash: string;
  price: string;
  isForSale: boolean;
  isVerified: boolean;
  royaltyPercentage: number;
  totalSales: number;
}

interface MarketplaceState {
  models: Model[];
  loading: boolean;
  error: string | null;
  selectedModel: Model | null;
}

const initialState: MarketplaceState = {
  models: [],
  loading: false,
  error: null,
  selectedModel: null,
};

export const fetchModels = createAsyncThunk(
  'marketplace/fetchModels',
  async (_, { getState }) => {
    const { marketplace } = useWeb3();
    if (!marketplace) throw new Error('Marketplace contract not initialized');

    const models: Model[] = [];
    const modelCount = await marketplace.getModelCount();
    
    for (let i = 1; i <= modelCount; i++) {
      const model = await marketplace.getModelDetails(i);
      models.push({
        id: i,
        owner: model.owner,
        ipfsHash: model.ipfsHash,
        price: ethers.utils.formatEther(model.price),
        isForSale: model.isForSale,
        isVerified: model.isVerified,
        royaltyPercentage: model.royaltyPercentage.toNumber(),
        totalSales: model.totalSales.toNumber(),
      });
    }

    return models;
  }
);

export const listModel = createAsyncThunk(
  'marketplace/listModel',
  async ({ ipfsHash, price, royaltyPercentage }: { 
    ipfsHash: string; 
    price: string; 
    royaltyPercentage: number; 
  }, { getState }) => {
    const { marketplace, nfgToken } = useWeb3();
    if (!marketplace || !nfgToken) throw new Error('Contracts not initialized');

    const priceWei = ethers.utils.parseEther(price);
    await nfgToken.approve(marketplace.address, priceWei);
    
    const tx = await marketplace.listModel(ipfsHash, priceWei, royaltyPercentage);
    await tx.wait();

    return tx;
  }
);

export const buyModel = createAsyncThunk(
  'marketplace/buyModel',
  async (modelId: number, { getState }) => {
    const { marketplace, nfgToken } = useWeb3();
    if (!marketplace || !nfgToken) throw new Error('Contracts not initialized');

    const model = await marketplace.getModelDetails(modelId);
    await nfgToken.approve(marketplace.address, model.price);
    
    const tx = await marketplace.buyModel(modelId);
    await tx.wait();

    return modelId;
  }
);

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    setSelectedModel: (state, action: PayloadAction<Model | null>) => {
      state.selectedModel = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchModels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModels.fulfilled, (state, action) => {
        state.loading = false;
        state.models = action.payload;
      })
      .addCase(fetchModels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch models';
      })
      .addCase(listModel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listModel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(listModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to list model';
      })
      .addCase(buyModel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(buyModel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(buyModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to buy model';
      });
  },
});

export const { setSelectedModel, clearError } = marketplaceSlice.actions;
export default marketplaceSlice.reducer; 