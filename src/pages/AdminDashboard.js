// // src/pages/AdminDashboard.js
// import React, { useState, useEffect } from 'react';
// import { useAppContext } from '../context/AppContext'; // Опционально, для sync с currentUser
// import { getMockUsers, saveMockUsers, getProjects } from '../data/mockData';

// const AdminDashboard = () => {
//   // Все хуки в топе, безусловно!
//   const { currentUser } = useAppContext(); // Опционально: для проверки роли (если не в ProtectedRoute)
//   const [users, setUsers] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Загрузка данных при монтировании (асинхронно, без блокировки)
//     const loadedUsers = getMockUsers();
//     const loadedProjects = getProjects();
//     setUsers(loadedUsers);
//     setProjects(loadedProjects);
//     setLoading(false);
//   }, []);

//   // Ранний возврат ПОСЛЕ всех хуков
//   if (loading) {
//     return <div style={{ padding: '20px', textAlign: 'center' }}>Загрузка...</div>;
//   }

//   // Проверка роли (опционально, дублирует ProtectedRoute, но для safety)
//   if (currentUser && currentUser.role !== 'admin') {
//     return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Доступ запрещён. Только для админов.</div>;
//   }

//   const handleRoleChange = (userId, newRole) => {
//     const updatedUsers = users.map((user) =>
//       user.id === userId ? { ...user, role: newRole } : user
//     );
//     setUsers(updatedUsers);
//     saveMockUsers(updatedUsers); // Persist в localStorage
//   };

//   const handleDeleteUser = (userId) => {
//     if (window.confirm('Удалить пользователя?')) {
//       const updatedUsers = users.filter(user => user.id !== userId);
//       setUsers(updatedUsers);
//       saveMockUsers(updatedUsers);
//     }
//   };

//   const handleDeleteProject = (projectId) => {
//     if (window.confirm('Удалить проект?')) {
//       const updatedProjects = projects.filter(p => p.id !== projectId);
//       setProjects(updatedProjects);
//       // Сохрани в localStorage, если projects там (в mockData.js добавь saveProjects)
//     }
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
//       <h1>Admin Dashboard (Добро пожаловать, {currentUser?.name})</h1>
      
//       {/* Раздел пользователей */}
//       <section style={{ marginBottom: '40px' }}>
//         <h2>Управление пользователями ({users.length})</h2>
//         <div style={{ display: 'grid', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
//           {users.map((user) => (
//             <div
//               key={user.id}
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 padding: '10px',
//                 border: '1px solid #ddd',
//                 borderRadius: '5px',
//                 background: '#f9f9f9'
//               }}
//             >
//               <div>
//                 <span><strong>{user.name}</strong> ({user.email})</span>
//                 <small style={{ marginLeft: '10px', color: '#666' }}>ID: {user.id}</small>
//               </div>
//               <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
//                 <select
//                   value={user.role}
//                   onChange={(e) => handleRoleChange(user.id, e.target.value)}
//                   style={{ padding: '5px', borderRadius: '3px' }}
//                 >
//                   <option value="admin">Admin</option>
//                   <option value="teacher">Teacher</option>
//                   <option value="student">Student</option>
//                 </select>
//                 <button
//                   onClick={() => handleDeleteUser(user.id)}
//                   style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
//                 >
//                   Удалить
//                 </button>
//               </div>
//             </div>
//           ))}
//           {users.length === 0 && <p>Нет пользователей. Зарегистрируйте новых в Login.</p>}
//         </div>
//       </section>

//       {/* Раздел проектов */}
//       <section>
//         <h2>Все проекты ({projects.length})</h2>
//         <div style={{ display: 'grid', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
//           {projects.map((project) => (
//             <div
//               key={project.id}
//               style={{
//                 padding: '15px',
//                 border: '1px solid #ddd',
//                 borderRadius: '5px',
//                 background: '#f9f9f9',
//                 position: 'relative'
//               }}
//             >
//               <h3>{project.title}</h3>
//               <p>{project.description}</p>
//               <p><strong>Владелец ID:</strong> {project.ownerId}</p>
//               <p><strong>Команда:</strong> {Array.isArray(project.team) ? project.team.join(', ') : 'Нет команды'}</p>
//               <p><strong>Статус:</strong> {project.status} | <strong>Прогресс:</strong> {project.progress || 0}%</p>
//               <p><strong>Задачи:</strong> {project.tasks?.length || 0} | <strong>Комментарии:</strong> {project.comments?.length || 0}</p>
//               <button
//                 onClick={() => handleDeleteProject(project.id)}
//                 style={{ 
//                   position: 'absolute', 
//                   top: '10px', 
//                   right: '10px', 
//                   padding: '5px 10px', 
//                   background: '#dc3545', 
//                   color: 'white', 
//                   border: 'none', 
//                   borderRadius: '3px', 
//                   cursor: 'pointer' 
//                 }}
//               >
//                 Удалить проект
//               </button>
//             </div>
//           ))}
//           {projects.length === 0 && <p>Нет проектов. Создайте в Home.</p>}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default AdminDashboard;


// src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { getMockUsers, saveMockUsers, getProjects, saveProjects } from '../data/mockData';
import { Link, useNavigate } from 'react-router-dom'; // Для навигации

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // Поиск по пользователям
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Для сообщений успеха
  const navigate = useNavigate();

  useEffect(() => {
    // Загрузка данных при монтировании
    const loadData = () => {
      setUsers(getMockUsers());
      setProjects(getProjects());
      setLoading(false);
    };
    loadData();
  }, []);

  // Фильтрация пользователей по поиску (email или name)
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = (userId, newRole) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);
    saveMockUsers(updatedUsers);
    setSuccess('Роль пользователя обновлена!');
    setTimeout(() => setSuccess(''), 3000); // Автоочистка
  };

  // Удаление пользователя (с подтверждением)
  const handleDeleteUser = (userId) => {
    if (!window.confirm('Удалить этого пользователя? Это действие необратимо!')) return;
    
    // Удаляем из localStorage
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    saveMockUsers(updatedUsers);
    
    // Если удаляем текущего пользователя (редкий кейс для админа), логаут
    // Но поскольку это админ, проверим в контексте (опционально)
    
    setSuccess('Пользователь удалён!');
    setTimeout(() => setSuccess(''), 3000);
  };

  // Удаление проекта (с подтверждением)
  const handleDeleteProject = (projectId) => {
    if (!window.confirm('Удалить этот проект? Все данные (задачи, комментарии) потеряются!')) return;
    
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    
    setSuccess('Проект удалён!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Admin Dashboard</h1>
      
      {/* Статистика */}
      <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Статистика</h3>
        <p>Всего пользователей: {users.length}</p>
        <p>Всего проектов: {projects.length}</p>
        <p>Активных проектов: {projects.filter(p => p.status !== 'Завершён').length}</p>
        <button
          onClick={() => {
            localStorage.clear(); // Полная очистка (для dev)
            window.location.reload();
          }}
          style={{
            padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none',
            borderRadius: '4px', cursor: 'pointer', fontSize: '12px'
          }}
        >
          Очистить все данные (Dev only)
        </button>
      </div>

      {/* Уведомления */}
      {error && (
        <div style={{ color: 'red', background: '#f8d7da', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>
          {error} <button onClick={clearMessages} style={{ marginLeft: '10px', background: 'none', border: 'none', color: 'red' }}>×</button>
        </div>
      )}
      {success && (
        <div style={{ color: 'green', background: '#d4edda', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>
          {success} <button onClick={clearMessages} style={{ marginLeft: '10px', background: 'none', border: 'none', color: 'green' }}>×</button>
        </div>
      )}

      {/* Управление пользователями */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2>Управление пользователями ({filteredUsers.length} из {users.length})</h2>
          <input
            type="text"
            placeholder="Поиск по email или имени..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: '250px'
            }}
          />
        </div>
        {filteredUsers.length === 0 ? (
          <p>Пользователи не найдены по поиску.</p>
        ) : (
          <div style={{ display: 'grid', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
            {filteredUsers.map(user => (
              <div
                key={user.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  background: '#f9f9f9'
                }}
              >
                <div style={{ flex: 1 }}>
                  <strong>{user.name}</strong> ({user.email}) — <em>Роль: {user.role}</em>
                </div>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  style={{ padding: '5px', borderRadius: '3px', marginRight: '10px' }}
                >
                  <option value="admin">Admin</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </select>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  style={{
                    padding: '5px 10px', background: '#dc3545', color: 'white',
                    border: 'none', borderRadius: '3px', cursor: 'pointer'
                  }}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Все проекты */}
      <section>
        <h2>Все проекты ({projects.length})</h2>
        {projects.length === 0 ? (
          <p>Нет проектов. <Link to="/create-project" style={{ color: '#007bff' }}>Создайте первый!</Link></p>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {projects.map(project => (
              <li
                key={project.id}
                style={{
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '10px',
                  background: '#f9f9f9'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <p><strong>Владелец ID:</strong> {project.ownerId}</p>
                    <p><strong>Команда:</strong> {Array.isArray(project.team) ? project.team.join(', ') : 'Нет команды'}</p>
                    <p><strong>Статус:</strong> {project.status} | <strong>Прогресс:</strong> {project.progress || 0}%</p>
                    <p><strong>Задачи:</strong> {Array.isArray(project.tasks) ? project.tasks.length : 0} | <strong>Комментарии:</strong> {Array.isArray(project.comments) ? project.comments.length : 0}</p>
                    <small>Создан: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Неизвестно'}</small>
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <Link
                      to={`/project/${project.id}`}
                      style={{
                        padding: '5px 10px', background: '#007bff', color: 'white',
                        border: 'none', borderRadius: '3px', cursor: 'pointer', textDecoration: 'none'
                      }}
                    >
                      Просмотр
                    </Link>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      style={{
                        padding: '5px 10px', background: '#dc3545', color: 'white',
                        border: 'none', borderRadius: '3px', cursor: 'pointer'
                      }}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Кнопка выхода */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px', background: '#6c757d', color: 'white',
            border: 'none', borderRadius: '5px', cursor: 'pointer'
          }}
        >
          ← Назад к Home
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
