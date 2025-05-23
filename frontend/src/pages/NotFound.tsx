import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space[8]};
  text-align: center;
`;

const ErrorCode = styled.h1`
  font-size: 120px;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
  line-height: 1;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin: ${({ theme }) => theme.space[4]} 0;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[4]};
  justify-content: center;
`;

const Button = styled.button`
  padding: ${({ theme }) => `${theme.space[3]} ${theme.space[4]}`};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
`;

const PrimaryButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 2px solid ${({ theme }) => theme.colors.primary};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}10;
  }
`;

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <NotFoundContainer>
      <ErrorCode>404</ErrorCode>
      <Title>Page Not Found</Title>
      <Description>
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </Description>
      <ButtonGroup>
        <PrimaryButton onClick={() => navigate('/')}>
          Go to Homepage
        </PrimaryButton>
        <SecondaryButton onClick={() => navigate(-1)}>
          Go Back
        </SecondaryButton>
      </ButtonGroup>
    </NotFoundContainer>
  );
};

export default NotFound; 