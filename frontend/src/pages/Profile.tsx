import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../store';
import { useWeb3 } from '../contexts/Web3Context';

const ProfileContainer = styled.div`
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

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: ${({ theme }) => theme.space[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ProfileInfo = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  margin: 0 auto ${({ theme }) => theme.space[4]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  color: white;
`;

const Username = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const Address = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  word-break: break-all;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.space[1]};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const MainContent = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const TabsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Tab = styled.button<{ active?: boolean }>`
  padding: ${({ theme }) => `${theme.space[3]} ${theme.space[4]}`};
  background: none;
  border: none;
  border-bottom: 2px solid ${({ theme, active }) => active ? theme.colors.primary : 'transparent'};
  color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.textSecondary};
  font-weight: ${({ theme, active }) => active ? theme.fontWeights.semibold : theme.fontWeights.regular};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const ActivityItem = styled.div`
  padding: ${({ theme }) => theme.space[4]};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ActivityTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const ActivityDetails = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  display: flex;
  gap: ${({ theme }) => theme.space[4]};
`;

const ActivityDate = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.space[2]};
`;

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('activity');
  const { account } = useWeb3();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getInitials = (address: string) => {
    return address.slice(2, 4).toUpperCase();
  };

  return (
    <ProfileContainer>
      <Header>
        <Title>Profile</Title>
        <Subtitle>View your profile and activity</Subtitle>
      </Header>

      <ProfileGrid>
        <Sidebar>
          <ProfileInfo>
            <Avatar>{account ? getInitials(account) : '?'}</Avatar>
            <Username>{account ? formatAddress(account) : 'Not Connected'}</Username>
            <Address>{account}</Address>
          </ProfileInfo>

          <Stats>
            <StatItem>
              <StatValue>12</StatValue>
              <StatLabel>Models</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>5</StatValue>
              <StatLabel>Training Jobs</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>3</StatValue>
              <StatLabel>Sales</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>2.5k</StatValue>
              <StatLabel>NFG Tokens</StatLabel>
            </StatItem>
          </Stats>
        </Sidebar>

        <MainContent>
          <TabsContainer>
            <Tab active={activeTab === 'activity'} onClick={() => setActiveTab('activity')}>
              Activity
            </Tab>
            <Tab active={activeTab === 'models'} onClick={() => setActiveTab('models')}>
              My Models
            </Tab>
            <Tab active={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')}>
              Training Jobs
            </Tab>
          </TabsContainer>

          <ActivityList>
            <ActivityItem>
              <ActivityTitle>Model Listed for Sale</ActivityTitle>
              <ActivityDetails>
                <div>Model: Image Classification v2</div>
                <div>Price: 100 NFG</div>
              </ActivityDetails>
              <ActivityDate>2 hours ago</ActivityDate>
            </ActivityItem>

            <ActivityItem>
              <ActivityTitle>Training Job Completed</ActivityTitle>
              <ActivityDetails>
                <div>Model: Text Generation</div>
                <div>Accuracy: 92%</div>
              </ActivityDetails>
              <ActivityDate>1 day ago</ActivityDate>
            </ActivityItem>

            <ActivityItem>
              <ActivityTitle>Model Purchased</ActivityTitle>
              <ActivityDetails>
                <div>Model: Object Detection</div>
                <div>Price: 50 NFG</div>
              </ActivityDetails>
              <ActivityDate>3 days ago</ActivityDate>
            </ActivityItem>
          </ActivityList>
        </MainContent>
      </ProfileGrid>
    </ProfileContainer>
  );
};

export default Profile; 