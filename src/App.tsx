import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { TopBanner } from './components/Layout/TopBanner';
import { Navbar } from './components/Layout/Navbar';
import { Footer } from './components/Layout/Footer';

import { LeaderboardPage } from './pages/LeaderboardPage';
import { SystemDetailPage } from './pages/SystemDetailPage';
import { ComparePage } from './pages/ComparePage';
import { MethodologyPage } from './pages/MethodologyPage';
import { TestDataPage } from './pages/TestDataPage';
import { RealMiniRunPage } from './pages/RealMiniRunPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors">
          {/* Persistent Non-Negotiable Honesty Banner */}
          <TopBanner />

          {/* Sticky Navigation Header */}
          <Navbar />

          {/* Main Application Router */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LeaderboardPage />} />
              <Route path="/system/:id" element={<SystemDetailPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/methodology" element={<MethodologyPage />} />
              <Route path="/test-data" element={<TestDataPage />} />
              <Route path="/real-run" element={<RealMiniRunPage />} />
              {/* Fallback to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Research Lab Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
