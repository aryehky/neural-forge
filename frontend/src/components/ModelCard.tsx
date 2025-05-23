import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { setSelectedModel } from '../store/slices/marketplaceSlice';
import { Model } from '../types';

interface ModelCardProps {
  model: Model;
}

const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ModelImage = styled.div`
  width: 100%;
  height: 200px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.text};
`;

const Price = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 8px;
`;

const Details = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Badge = styled.span<{ verified?: boolean }>`
  background: ${({ verified, theme }) => 
    verified ? theme.colors.success : theme.colors.warning};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setSelectedModel(model));
    navigate(`/model/${model.id}`);
  };

  return (
    <Card onClick={handleClick}>
      <ModelImage>
        <span role="img" aria-label="AI Model">🤖</span>
      </ModelImage>
      <Title>Model #{model.id}</Title>
      <Price>{model.price} NFG</Price>
      <Details>
        <span>Owner: {model.owner.slice(0, 6)}...{model.owner.slice(-4)}</span>
        <span>Sales: {model.totalSales}</span>
      </Details>
      <Details>
        <span>Royalty: {model.royaltyPercentage}%</span>
        <Badge verified={model.isVerified}>
          {model.isVerified ? 'Verified' : 'Unverified'}
        </Badge>
      </Details>
    </Card>
  );
};

export default ModelCard; 