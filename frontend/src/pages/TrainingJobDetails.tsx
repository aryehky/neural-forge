import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../store';
import { useWeb3 } from '../contexts/Web3Context';

const JobDetailsContainer = styled.div`
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

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const ProgressContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.full};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.space[2]};

  &::after {
    content: '';
    display: block;
    width: ${({ progress }) => `${progress}%`};
    height: 100%;
    background-color: ${({ theme }) => theme.colors.primary};
    transition: width ${({ theme }) => theme.transitions.default};
  }
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const MetricCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.space[1]};
`;

const MetricLabel = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const LogContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-family: monospace;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
  max-height: 300px;
  overflow-y: auto;
`;

const LogLine = styled.div`
  margin-bottom: ${({ theme }) => theme.space[1]};
  white-space: pre-wrap;
`;

const StatusBadge = styled.div<{ status: string }>`
  display: inline-block;
  padding: ${({ theme }) => `${theme.space[1]} ${theme.space[2]}`};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background-color: ${({ theme, status }) => {
    switch (status) {
      case 'running':
        return theme.colors.success;
      case 'pending':
        return theme.colors.warning;
      case 'completed':
        return theme.colors.primary;
      case 'failed':
        return theme.colors.error;
      default:
        return theme.colors.border;
    }
  }};
  color: white;
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const DetailsList = styled.div`
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.space[2]} 0`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DetailValue = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const ActionButton = styled.button`
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

const TrainingJobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { account } = useWeb3();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(65);

  useEffect(() => {
    // TODO: Fetch job details
    setLoading(false);
  }, [id]);

  const handleStop = async () => {
    // TODO: Implement stop job logic
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <JobDetailsContainer>
      <Header>
        <Title>Training Job #1234</Title>
        <Subtitle>Image Classification Model Training</Subtitle>
      </Header>

      <ContentGrid>
        <MainContent>
          <Section>
            <StatusBadge status="running">Running</StatusBadge>
            <ProgressContainer>
              <ProgressBar progress={progress} />
              <ProgressText>
                <span>Epoch 65/100</span>
                <span>65% Complete</span>
              </ProgressText>
            </ProgressContainer>

            <MetricsGrid>
              <MetricCard>
                <MetricValue>92.5%</MetricValue>
                <MetricLabel>Current Accuracy</MetricLabel>
              </MetricCard>
              <MetricCard>
                <MetricValue>0.023</MetricValue>
                <MetricLabel>Loss</MetricLabel>
              </MetricCard>
              <MetricCard>
                <MetricValue>2.5h</MetricValue>
                <MetricLabel>Time Elapsed</MetricLabel>
              </MetricCard>
              <MetricCard>
                <MetricValue>1.5h</MetricValue>
                <MetricLabel>Estimated Time Remaining</MetricLabel>
              </MetricCard>
            </MetricsGrid>

            <SectionTitle>Training Logs</SectionTitle>
            <LogContainer>
              <LogLine>[2024-02-20 14:30:15] Starting epoch 65</LogLine>
              <LogLine>[2024-02-20 14:30:20] Batch 1/100 - Loss: 0.023</LogLine>
              <LogLine>[2024-02-20 14:30:25] Batch 2/100 - Loss: 0.022</LogLine>
              <LogLine>[2024-02-20 14:30:30] Batch 3/100 - Loss: 0.021</LogLine>
            </LogContainer>
          </Section>
        </MainContent>

        <Sidebar>
          <Section>
            <SectionTitle>Job Details</SectionTitle>
            <DetailsList>
              <DetailItem>
                <DetailLabel>Model Name</DetailLabel>
                <DetailValue>Image Classification v2</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Dataset</DetailLabel>
                <DetailValue>ImageNet</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Epochs</DetailLabel>
                <DetailValue>100</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Batch Size</DetailLabel>
                <DetailValue>32</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Learning Rate</DetailLabel>
                <DetailValue>0.001</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Started</DetailLabel>
                <DetailValue>2.5 hours ago</DetailValue>
              </DetailItem>
            </DetailsList>
          </Section>

          <ActionButton onClick={handleStop} disabled={!account}>
            Stop Training
          </ActionButton>
        </Sidebar>
      </ContentGrid>
    </JobDetailsContainer>
  );
};

export default TrainingJobDetails; 