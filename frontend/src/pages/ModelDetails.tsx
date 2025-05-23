import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../store';
import { useWeb3 } from '../contexts/Web3Context';

const ModelDetailsContainer = styled.div`
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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.space[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Sidebar = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: ${({ theme }) => theme.space[4]};
`;

const ModelImage = styled.div`
  width: 100%;
  height: 400px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: ${({ theme }) => theme.space[4]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const DetailsList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.space[4]};
`;

const DetailItem = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const DetailLabel = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.space[1]};
`;

const DetailValue = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const PriceContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const Price = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const PriceLabel = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const OwnerInfo = styled.div`
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const OwnerLabel = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.space[1]};
`;

const OwnerAddress = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  word-break: break-all;
`;

const StatsContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.space[2]} 0`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StatValue = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const BuyButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => `${theme.space[3]} ${theme.space[4]}`};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }
`;

const ModelDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { account } = useWeb3();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch model details
    setLoading(false);
  }, [id]);

  const handleBuy = async () => {
    // TODO: Implement purchase logic
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ModelDetailsContainer>
      <Header>
        <Title>Image Classification Model v2</Title>
        <Subtitle>A state-of-the-art model for image classification tasks</Subtitle>
      </Header>

      <ContentGrid>
        <MainContent>
          <ModelImage>Model Preview</ModelImage>

          <Section>
            <SectionTitle>Description</SectionTitle>
            <Description>
              This model is trained on a large dataset of images and can accurately classify objects
              into 1000 different categories. It uses a deep convolutional neural network architecture
              and has been fine-tuned for optimal performance.
            </Description>
          </Section>

          <Section>
            <SectionTitle>Model Details</SectionTitle>
            <DetailsList>
              <DetailItem>
                <DetailLabel>Architecture</DetailLabel>
                <DetailValue>ResNet50</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Input Size</DetailLabel>
                <DetailValue>224x224</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Accuracy</DetailLabel>
                <DetailValue>95.2%</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Parameters</DetailLabel>
                <DetailValue>25.6M</DetailValue>
              </DetailItem>
            </DetailsList>
          </Section>
        </MainContent>

        <Sidebar>
          <PriceContainer>
            <Price>100 NFG</Price>
            <PriceLabel>Current Price</PriceLabel>
          </PriceContainer>

          <OwnerInfo>
            <OwnerLabel>Owner</OwnerLabel>
            <OwnerAddress>0x1234...5678</OwnerAddress>
          </OwnerInfo>

          <StatsContainer>
            <StatItem>
              <StatLabel>Total Sales</StatLabel>
              <StatValue>12</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Royalty</StatLabel>
              <StatValue>5%</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Created</StatLabel>
              <StatValue>2 months ago</StatValue>
            </StatItem>
          </StatsContainer>

          <BuyButton onClick={handleBuy} disabled={!account}>
            {!account ? 'Connect Wallet to Buy' : 'Buy Model'}
          </BuyButton>
        </Sidebar>
      </ContentGrid>
    </ModelDetailsContainer>
  );
};

export default ModelDetails; 