// // src/App.js
// // Тестовый админ-логин: user@example.com / password123

// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import { AppProvider, useAppContext } from './context/AppContext';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import CreateProject from './pages/CreateProject';
// import ProjectDetail from './pages/ProjectDetail';
// import AdminDashboard from './pages/AdminDashboard';

// // Компонент для защищённых роутов (ProtectedRoute)
// const ProtectedRoute = ({ children, requiredRole }) => {
//   const { currentUser } = useAppContext();
//   const navigate = useNavigate(); // Добавлено для возможных редиректов

//   if (!currentUser) {
//     return <Navigate to="/login" replace />;
//   }

//   if (requiredRole && currentUser.role !== requiredRole) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// // Компонент навигации (Nav) — показывается только для залогиненных пользователей
// const Nav = () => {
//   const { currentUser, setCurrentUser } = useAppContext();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     setCurrentUser(null);
//     navigate('/login');
//   };

//   // Показываем кнопку Create Project только для teacher/admin
//   const canCreateProject = currentUser.role === 'teacher' || currentUser.role === 'admin';

//   return (
//     <nav style={{
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       padding: '10px 20px',
//       background: '#343a40',
//       color: 'white',
//       position: 'sticky',
//       top: 0,
//       zIndex: 1000,
//       boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
//     }}>
//       <div style={{ fontSize: '24px', fontWeight: 'bold' }}>EduCollab</div>
//       <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
//         <a
//           href="/"
//           style={{ color: 'white', textDecoration: 'none', padding: '8px 12px', borderRadius: '4px', transition: 'background 0.3s' }}
//           onMouseOver={(e) => e.target.style.background = '#495057'}
//           onMouseOut={(e) => e.target.style.background = 'transparent'}
//         >
//           Home
//         </a>
//         {canCreateProject && (
//           <a
//             href="/create-project"
//             style={{ color: 'white', textDecoration: 'none', padding: '8px 12px', borderRadius: '4px', transition: 'background 0.3s' }}
//             onMouseOver={(e) => e.target.style.background = '#495057'}
//             onMouseOut={(e) => e.target.style.background = 'transparent'}
//           >
//             Create Project
//           </a>
//         )}
//         <span>{currentUser.name} ({currentUser.role})</span>
//         {currentUser.role === 'admin' && (
//           <a
//             href="/admin"
//             style={{ color: 'white', textDecoration: 'none', padding: '8px 12px', borderRadius: '4px', transition: 'background 0.3s' }}
//             onMouseOver={(e) => e.target.style.background = '#495057'}
//             onMouseOut={(e) => e.target.style.background = 'transparent'}
//           >
//             Admin
//           </a>
//         )}
//         <button
//           onClick={handleLogout}
//           style={{
//             padding: '8px 12px',
//             background: '#dc3545',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             transition: 'background 0.3s'
//           }}
//           onMouseOver={(e) => e.target.style.background = '#c82333'}
//           onMouseOut={(e) => e.target.style.background = '#dc3545'}
//         >
//           Logout
//         </button>
//       </div>
//     </nav>
//   );
// };

// // Layout для защищённых страниц: Nav + children
// const ProtectedLayout = ({ children }) => (
//   <>
//     <Nav />
//     <main style={{ padding: '20px' }}>
//       {children}
//     </main>
//   </>
// );

// // Основной компонент App
// function App() {
//   return (
//     <BrowserRouter>
//       <AppProvider>
//         <Routes>
//           {/* Публичный роут: только для неаутентифицированных */}
//           <Route
//             path="/login"
//             element={
//               <Routes>
//                 <Route path="/login" element={<Login />} />
//                 <Route path="*" element={<Navigate to="/login" replace />} />
//               </Routes>
//             }
//           />

//           {/* Защищённые роуты: с Nav */}
//           <Route
//             path="/"
//             element={
//               <ProtectedRoute>
//                 <ProtectedLayout>
//                   <Routes>
//                     <Route index element={<Home />} />
//                     <Route path="/create-project" element={<CreateProject />} />
//                     <Route path="/project/:id" element={<ProjectDetail />} />
//                     <Route
//                       path="/admin"
//                       element={
//                         <ProtectedRoute requiredRole="admin">
//                           <AdminDashboard />
//                         </ProtectedRoute>
//                       }
//                     />
//                     <Route path="*" element={<Navigate to="/" replace />} />
//                   </Routes>
//                 </ProtectedLayout>
//               </ProtectedRoute>
//             }
//           />

//           {/* 404 для всего остального */}
//           <Route path="*" element={<div style={{ padding: '20px', textAlign: 'center' }}>404 - Страница не найдена</div>} />
//         </Routes>
//       </AppProvider>
//     </BrowserRouter>
//   );
// }

// export default App;





// src/App.js
import React from 'react';
import { Routes, Route, BrowserRouter, Navigate, Link, useNavigate } from 'react-router-dom';  // Added useNavigate here
import Home from './pages/Home';
import Login from './pages/Login';
import CreateProject from './pages/CreateProject';
import ProjectDetail from './pages/ProjectDetail';
import AdminDashboard from './pages/AdminDashboard';
import { AppProvider, useAppContext } from './context/AppContext';  // Correct hook import
import Profile from './pages/Profile';

// ProtectedRoute component (fixed: inside Provider, uses useAppContext correctly)
const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser } = useAppContext();  // Safe hook (only inside Provider)
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// NavBar component (only for logged-in, with safe display)
const NavBar = () => {
  const { currentUser, setCurrentUser } = useAppContext();
  const navigate = useNavigate();  // Now imported correctly

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      background: '#343a40',
      color: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    }}>
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>EduCollab</div>
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <Link
          to="/"
          style={{ color: 'white', textDecoration: 'none', padding: '8px 12px', borderRadius: '4px', transition: 'background 0.3s' }}
          onMouseOver={(e) => (e.target.style.background = '#495057')}
          onMouseOut={(e) => (e.target.style.background = 'transparent')}
        >
          Home
        </Link>
        <Link
          to="/create-project"
          style={{ color: 'white', textDecoration: 'none', padding: '8px 12px', borderRadius: '4px', transition: 'background 0.3s' }}
          onMouseOver={(e) => (e.target.style.background = '#495057')}
          onMouseOut={(e) => (e.target.style.background = 'transparent')}
        >
          Create Project
        </Link>
        {isAdmin && (
          <Link
            to="/admin"
            style={{ color: 'white', textDecoration: 'none', padding: '8px 12px', borderRadius: '4px', transition: 'background 0.3s' }}
            onMouseOver={(e) => (e.target.style.background = '#495057')}
            onMouseOut={(e) => (e.target.style.background = 'transparent')}
          >
            Admin
          </Link>
        )}
        <Link
          to="/profile"
          style={{ color: 'white', textDecoration: 'none', padding: '8px 12px', borderRadius: '4px', transition: 'background 0.3s' }}
          onMouseOver={(e) => e.target.style.background = '#495057'}
          onMouseOut={(e) => e.target.style.background = 'transparent'}
        >
          Profile
        </Link>

        <span>{currentUser?.name || 'Пользователь'} ({currentUser?.role || 'неизвестно'})</span>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 12px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background 0.3s'
          }}
          onMouseOver={(e) => (e.target.style.background = '#c82333')}
          onMouseOut={(e) => (e.target.style.background = '#dc3545')}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

// AppContent (Routes inside Provider)
const AppContent = () => {
  const { currentUser } = useAppContext();  // Global check for Nav

  return (
    <>
      {currentUser && <NavBar />}  {/* Nav only for logged-in */}
      <Routes>
        <Route path="/login/*" element={<Login />} />  {/* Unprotected, matches /* for future nested */}
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

        <Route path="*" element={<Navigate to={currentUser ? "/" : "/login"} replace />} />  {/* 404 redirect */}
      </Routes>
    </>
  );
};

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
