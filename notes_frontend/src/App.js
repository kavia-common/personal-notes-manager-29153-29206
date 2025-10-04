import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import './styles/theme.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';
import { useAuth } from './context/AuthContext';

/**
 * ProtectedRoute ensures authenticated access to private pages.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

// PUBLIC_INTERFACE
function App() {
  return (
    <div className="ocean-app">
      <Header />
      <div className="ocean-layout">
        <Sidebar />
        <main className="ocean-main" role="main" aria-label="Main content">
          <Routes>
            <Route path="/" element={<Navigate to="/notes" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/notes"
              element={
                <ProtectedRoute>
                  <Notes />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/notes" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
