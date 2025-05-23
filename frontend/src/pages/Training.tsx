import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../store';
import { useWeb3 } from '../contexts/Web3Context';

const TrainingContainer = styled.div`
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

const Form = styled.form`
  max-width: 600px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.space[2]};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[3]}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[3]}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  min-height: 150px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[3]}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SubmitButton = styled.button`
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

const JobsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.space[4]};
`;

const JobCard = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const JobTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const JobStatus = styled.div<{ status: string }>`
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
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const JobDetails = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const Training: React.FC = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [formData, setFormData] = useState({
    modelName: '',
    description: '',
    dataset: '',
    epochs: '',
    batchSize: '',
    learningRate: '',
  });
  const { account } = useWeb3();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement job creation logic
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <TrainingContainer>
      <Header>
        <Title>AI Model Training</Title>
        <Subtitle>Create and manage your training jobs</Subtitle>
      </Header>

      <TabsContainer>
        <Tab active={activeTab === 'create'} onClick={() => setActiveTab('create')}>
          Create Job
        </Tab>
        <Tab active={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')}>
          My Jobs
        </Tab>
      </TabsContainer>

      {activeTab === 'create' ? (
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="modelName">Model Name</Label>
            <Input
              type="text"
              id="modelName"
              name="modelName"
              value={formData.modelName}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="dataset">Dataset</Label>
            <Input
              type="text"
              id="dataset"
              name="dataset"
              value={formData.dataset}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="epochs">Number of Epochs</Label>
            <Input
              type="number"
              id="epochs"
              name="epochs"
              value={formData.epochs}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="batchSize">Batch Size</Label>
            <Input
              type="number"
              id="batchSize"
              name="batchSize"
              value={formData.batchSize}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="learningRate">Learning Rate</Label>
            <Input
              type="number"
              id="learningRate"
              name="learningRate"
              value={formData.learningRate}
              onChange={handleInputChange}
              step="0.0001"
              required
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={!account}>
            {!account ? 'Connect Wallet to Create Job' : 'Create Training Job'}
          </SubmitButton>
        </Form>
      ) : (
        <JobsList>
          {/* TODO: Implement job list */}
          <JobCard>
            <JobTitle>Image Classification Model</JobTitle>
            <JobStatus status="running">Running</JobStatus>
            <JobDetails>
              <div>Epochs: 50/100</div>
              <div>Accuracy: 85%</div>
              <div>Started: 2 hours ago</div>
            </JobDetails>
          </JobCard>
        </JobsList>
      )}
    </TrainingContainer>
  );
};

export default Training; 