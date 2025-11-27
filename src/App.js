// src/App.js
// Этот файл определяет структуру всего приложения.

import React from 'react';
import { Routes, Route, BrowserRouter, Navigate, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import CreateProject from './pages/CreateProject';
import ProjectDetail from './pages/ProjectDetail';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import { AppProvider, useAppContext } from './context/AppContext';

// КОМПОНЕНТ ЗАЩИТЫ РОУТОВ (ProtectedRoute)
// проверка аутентификации и роли перед рендером protected-содержимого.

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser } = useAppContext();  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// КОМПОНЕНТ НАВИГАЦИОННОЙ ПАНЕЛИ (NavBar)
// header с links/buttons для навигации — показывается только logged-in пользователям (в AppContent).

const NavBar = () => {
  const { currentUser, setCurrentUser } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    setCurrentUser(null); 
    navigate('/login');
  };

  const canCreateProject = currentUser?.role === 'teacher' || currentUser?.role === 'admin';
  const isAdmin = currentUser?.role === 'admin';     

  return (
    <nav className="navbar">                            
      <div className="navbar-brand">EduCollab</div>     
      <div className="navbar-links">                  
        <Link to="/" className="nav-link">Home</Link>   
        {canCreateProject && (
          <Link to="/create-project" className="nav-link">Create Project</Link>  
        )}
        {isAdmin && (
          <Link to="/admin" className="nav-link">Admin Panell</Link>
        )}
        <Link to="/profile" className="nav-link">
          Profile
          <span className="user-info">{currentUser?.name || 'Пользователь'} ({currentUser?.role || 'неизвестно'})</span> 
        </Link> 
         <button onClick={handleLogout} className="logout-btn">Logout</button>

      </div>
    </nav>
  );
};

// КОМПОНЕНТ КОНТЕЙНЕРА РОУТОВ (AppContent)

const AppContent = () => {
  const { currentUser } = useAppContext();
  
  return (
    <>
      {currentUser && <NavBar />}   
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route                                         
          path="/"                                     
          element={                                    
            <ProtectedRoute>                           
              <Home />                                
            </ProtectedRoute>                          
          }                                           
        />                                             
        <Route                                         
          path="/create-project"                       
          element={                                   
            <ProtectedRoute>                           
              <CreateProject />                        
            </ProtectedRoute>                          
          }                                           
        />                                             
        <Route                                         
          path="/project/:id"                          
          element={                                   
            <ProtectedRoute>                           
              <ProjectDetail />                        
            </ProtectedRoute>                          
          }                                           
        />                                             
        <Route                                         
          path="/admin"                                
          element={                                   
            <ProtectedRoute requiredRole="admin">     
              <AdminDashboard />                       
            </ProtectedRoute>                          
          }                                           
        />                                             
        <Route                                         
          path="/profile"                              
          element={                                   
            <ProtectedRoute>                           
              <Profile />                              
            </ProtectedRoute>                          
          }                                           
        />                                             
        <Route                                          // 404 catch-all: if logged-in → /, else → /login
          path="*"                                     
          element={<Navigate to={currentUser ? "/" : "/login"} replace />} 
        />                                             
      </Routes>                                        
    </>                                               
  );
};

// ОСНОВНОЙ КОМПОНЕНТ ПРИЛОЖЕНИЯ (App)

function App() {
  return (
    <BrowserRouter>                                  
      <AppProvider>                                   
        <AppContent />                               
      </AppProvider>                                  
    </BrowserRouter>                                 
  );
}

export default App;                           
