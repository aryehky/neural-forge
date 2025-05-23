import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import { store } from './store';
import { theme } from './theme';
import { Web3Provider } from './contexts/Web3Context';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Training from './pages/Training';
import Profile from './pages/Profile';
import ModelDetails from './pages/ModelDetails';
import TrainingJobDetails from './pages/TrainingJobDetails';

// Styles
import GlobalStyle from './styles/GlobalStyle';

function getLibrary(provider: any) {
  return new ethers.providers.Web3Provider(provider);
}

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3Provider>
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <Router>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/training" element={<Training />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/model/:id" element={<ModelDetails />} />
                <Route path="/training/:id" element={<TrainingJobDetails />} />
              </Routes>
              <Footer />
            </Router>
          </ThemeProvider>
        </Web3Provider>
      </Web3ReactProvider>
    </Provider>
  );
};

export default App; 