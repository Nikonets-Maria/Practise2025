// src/App.js
// user@example.com
// password123

import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';  // Убрали BrowserRouter — он в index.js; добавили useNavigate
import Home from './pages/Home';
import Login from './pages/Login';
import CreateProject from './pages/CreateProject';
import ProjectDetail from './pages/ProjectDetail';
import { AppProvider, useAppContext } from './context/AppContext';

function AppContent() {
  const { currentUser, setCurrentUser } = useAppContext();
  const navigate = useNavigate();  // Для редиректа после логаута
  const isLoggedIn = !!currentUser;

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Login />} />  {/* Редирект на login если не залогинен */}
      </Routes>
    );
  }

  // Если logged in — рендерим navbar + routes
  return (
    <>
      {/* Глобальная навигация */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 20px', background: '#343a40', color: 'white',
        position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>EduCollab</div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <Link  // Заменили а на Link (не React, но в роутере лучше Link)
            to="/" 
            style={{ color: 'white', textDecoration: 'none', padding: '8px 12px', borderRadius: '4px', transition: 'background 0.3s' }}
            onMouseOver={(e) => e.target.style.background = '#495057'}
            onMouseOut={(e) => e.target.style.background = 'transparent'}
          >
            Home
          </Link>
          <Link
            to="/create-project" 
            style={{ color: 'white', textDecoration: 'none', padding: '8px 12px', borderRadius: '4px', transition: 'background 0.3s' }}
            onMouseOver={(e) => e.target.style.background = '#495057'}
            onMouseOut={(e) => e.target.style.background = 'transparent'}
          >
            Create Project
          </Link>
          <span>{currentUser.name} ({currentUser.role})</span>
          <button 
            onClick={() => {
              setCurrentUser(null);
              navigate('/login');  // Программный редирект на login после логаута
            }} 
            style={{
              padding: '8px 12px', background: '#dc3545', color: 'white',
              border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = '#c82333'}
            onMouseOut={(e) => e.target.style.background = '#dc3545'}
          >
            Logout
          </button>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="*" element={<Home />} />  {/* Редирект на home */}
      </Routes>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
