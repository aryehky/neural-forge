import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../store';
import { fetchModels } from '../store/slices/marketplaceSlice';
import ModelCard from '../components/ModelCard';

const MarketplaceContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space[4]};
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[6]};
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
`;

const FilterLabel = styled.label`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const FilterSelect = styled.select`
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[3]}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SearchInput = styled.input`
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[3]}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  min-width: 300px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ModelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.space[4]};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.space[8]};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.space[8]};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const Marketplace: React.FC = () => {
  const dispatch = useDispatch();
  const { models, loading, error } = useSelector((state: RootState) => state.marketplace);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterVerified, setFilterVerified] = useState('all');

  useEffect(() => {
    dispatch(fetchModels());
  }, [dispatch]);

  const filteredModels = models
    .filter(model => {
      const matchesSearch = model.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVerified = filterVerified === 'all' || 
        (filterVerified === 'verified' && model.isVerified) ||
        (filterVerified === 'unverified' && !model.isVerified);
      return matchesSearch && matchesVerified;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'sales':
          return b.totalSales - a.totalSales;
        default:
          return 0;
      }
    });

  if (loading) {
    return <LoadingMessage>Loading models...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>Error loading models: {error}</ErrorMessage>;
  }

  return (
    <MarketplaceContainer>
      <Header>
        <Title>AI Model Marketplace</Title>
        <Subtitle>Browse and purchase AI models from the community</Subtitle>
      </Header>

      <FiltersContainer>
        <FilterGroup>
          <FilterLabel>Search</FilterLabel>
          <SearchInput
            type="text"
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Sort By</FilterLabel>
          <FilterSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="sales">Most Sales</option>
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Verification</FilterLabel>
          <FilterSelect value={filterVerified} onChange={(e) => setFilterVerified(e.target.value)}>
            <option value="all">All Models</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
          </FilterSelect>
        </FilterGroup>
      </FiltersContainer>

      <ModelsGrid>
        {filteredModels.map(model => (
          <ModelCard key={model.id} model={model} />
        ))}
      </ModelsGrid>
    </MarketplaceContainer>
  );
};

export default Marketplace; 