import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  padding: ${({ theme }) => theme.space[6]};
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.space[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
`;

const FooterTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.default};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[2]};
`;

const SocialLink = styled.a`
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: color ${({ theme }) => theme.transitions.default};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.space[6]};
  padding-top: ${({ theme }) => theme.space[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>NeuralForge</FooterTitle>
          <FooterLink to="/about">About Us</FooterLink>
          <FooterLink to="/contact">Contact</FooterLink>
          <FooterLink to="/careers">Careers</FooterLink>
          <FooterLink to="/blog">Blog</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Platform</FooterTitle>
          <FooterLink to="/marketplace">Marketplace</FooterLink>
          <FooterLink to="/training">Training</FooterLink>
          <FooterLink to="/models">Models</FooterLink>
          <FooterLink to="/pricing">Pricing</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Resources</FooterTitle>
          <FooterLink to="/docs">Documentation</FooterLink>
          <FooterLink to="/api">API Reference</FooterLink>
          <FooterLink to="/tutorials">Tutorials</FooterLink>
          <FooterLink to="/faq">FAQ</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Connect</FooterTitle>
          <SocialLinks>
            <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              Twitter
            </SocialLink>
            <SocialLink href="https://github.com" target="_blank" rel="noopener noreferrer">
              GitHub
            </SocialLink>
            <SocialLink href="https://discord.com" target="_blank" rel="noopener noreferrer">
              Discord
            </SocialLink>
          </SocialLinks>
        </FooterSection>
      </FooterContent>

      <Copyright>
        © {new Date().getFullYear()} NeuralForge. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer; 