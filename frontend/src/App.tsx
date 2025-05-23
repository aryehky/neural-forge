import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { Web3Provider } from './contexts/Web3Context';
import { store } from './store';
import { theme } from './theme';
import GlobalStyle from './styles/GlobalStyle';

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
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Web3Provider>
          <Router>
            <GlobalStyle />
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/training" element={<Training />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/model/:id" element={<ModelDetails />} />
              <Route path="/job/:id" element={<TrainingJobDetails />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </Router>
        </Web3Provider>
      </ThemeProvider>
    </Provider>
  );
};

export default App; 