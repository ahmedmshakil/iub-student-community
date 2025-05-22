
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import MainLayout from './pages/MainLayout';
import ChatPage from './pages/ChatPage';
import MarketplacePage from './pages/MarketplacePage';
import SellItemPage from './pages/SellItemPage';
import ProfilePage from './pages/ProfilePage';
import { Spinner } from './components/common/Spinner';

const App: React.FC = () => {
  const { user, isLoading } = useAuth();

  // While checking auth status, show a loader. 
  // This is a basic check; real apps might have a loading screen or read from localStorage.
  // For this example, isLoading primarily reflects login attempts.
  // A true "initial loading" state might need to be handled differently if persisting auth.
  if (isLoading && !user) { // Show loader mainly during login process
     return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <LoginPage />} 
        />
        <Route 
          path="/" 
          element={user ? <MainLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="/chat" />} /> {/* Default to chat page */}
          <Route path="chat" element={<ChatPage />} />
          <Route path="chat/:courseId" element={<ChatPage />} />
          <Route path="marketplace" element={<MarketplacePage />} />
          <Route path="sell" element={<SellItemPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
