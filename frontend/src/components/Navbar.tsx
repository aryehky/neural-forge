import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components';
import { useWeb3 } from '../contexts/Web3Context';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.space[4]};
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndices.navbar};
`;

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[4]};
`;

const NavLink = styled(Link)<{ active?: boolean }>`
  color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.text};
  text-decoration: none;
  font-weight: ${({ theme, active }) => active ? theme.fontWeights.semibold : theme.fontWeights.regular};
  transition: color ${({ theme }) => theme.transitions.default};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const WalletButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[4]}`};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: background-color ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }
`;

const AccountInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[4]}`};
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const Navbar: React.FC = () => {
  const { account, activate, deactivate, active } = useWeb3React();
  const { injected } = useWeb3();
  const location = useLocation();

  const connectWallet = async () => {
    try {
      await activate(injected);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const disconnectWallet = () => {
    deactivate();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Nav>
      <Logo to="/">NeuralForge</Logo>
      <NavLinks>
        <NavLink to="/" active={location.pathname === '/'}>Home</NavLink>
        <NavLink to="/marketplace" active={location.pathname === '/marketplace'}>Marketplace</NavLink>
        <NavLink to="/training" active={location.pathname === '/training'}>Training</NavLink>
        <NavLink to="/profile" active={location.pathname === '/profile'}>Profile</NavLink>
      </NavLinks>
      {active && account ? (
        <AccountInfo>
          {formatAddress(account)}
          <WalletButton onClick={disconnectWallet}>Disconnect</WalletButton>
        </AccountInfo>
      ) : (
        <WalletButton onClick={connectWallet}>Connect Wallet</WalletButton>
      )}
    </Nav>
  );
};

export default Navbar; 