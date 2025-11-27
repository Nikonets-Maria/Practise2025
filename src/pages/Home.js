// // src/pages/Home.js
// import React, { useMemo, useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAppContext } from '../context/AppContext';

// function Home() {
//   const { currentUser, projects, users } = useAppContext();  // Добавлен users для показа имен команды
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('Все');

//   // Используем проекты из контекста (mock уже загружён через AppContext)
//   const allProjects = projects;

//   // Фильтрация: по поиску и статусу (статус должен быть в mockData/projects)
// //   const filteredProjects = useMemo(() => {
// //     return allProjects.filter(project => {
// //       const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
// //       const matchesStatus = filterStatus === 'Все' || project.status === filterStatus;
// //       return matchesSearch && matchesStatus;
// //     });
// //   }, [allProjects, searchTerm, filterStatus]);

// //   // Функция для получения читаемых имен команды из ID
// //   // Фильтруем только users с ролью "user", если это нужно, но по умолчанию показываем всех участников
// //   const getTeamNames = (team) => {
// //     if (!Array.isArray(team) || team.length === 0) return 'Нет участников';
// //     return team
// //       .map(id => {
// //         const user = users.find(u => u.id === id);
// //         return user ? user.name : 'Неизвестный пользователь';
// //       })
// //       .join(', ');
// //   };

//   // src/pages/Home.js (обновить filteredProjects)

// const filteredProjects = useMemo(() => {
//   let allRelevantProjects = projects; // Базовый список

//   // ФИЛЬТР ПО РОЛИ (главный фикс):
//   if (currentUser.role === 'student') {
//     allRelevantProjects = projects.filter(p => p.team.includes(currentUser.id));
//   } else if (currentUser.role === 'teacher') {
//     allRelevantProjects = projects.filter(p => p.ownerId === currentUser.id);
//   } // Для admin оставляем все (все роли)

//   // Затем применить поиск и статус
//   return allRelevantProjects.filter(project => {
//     const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           getTeamNames(project.team).toLowerCase().includes(searchTerm.toLowerCase()); // Улучшили поиск: по учасникам
//     const projectStatus = project.status || ''; // Безопасность
//     const matchesStatus = filterStatus === 'Все' || projectStatus === filterStatus;
//     return matchesSearch && matchesStatus;
//   }).sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)); // Сорт по дате (новые наверх)
// }, [projects, searchTerm, filterStatus, currentUser]);

// const getTeamNames = (team) => {
//   if (!Array.isArray(team) || team.length === 0) return 'Нет участников';
//   const names = team
//     .map(id => users.find(u => u.id === id)?.name || 'Неизвестный')
//     .filter((name) => name !== 'Неизвестный') // Убери неизвестных для чистоты
//     .join(', ');
//   return names || 'Нет участников';
// };


//   // Проверка аутентификации
//   if (!currentUser) {
//     navigate('/login');
//     return null;
//   }

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>Добро пожаловать, {currentUser.name}! Твои проекты</h2>
      
//       {/* Кнопка создания проекта */}
//       <Link 
//         to="/create-project" 
//         style={{ 
//           display: 'inline-block', 
//           padding: '10px 20px', 
//           background: '#007bff', 
//           color: 'white', 
//           textDecoration: 'none', 
//           borderRadius: '5px', 
//           marginBottom: '20px' 
//         }}>
//         + Создать новый проект
//       </Link>
      
//       {/* Поиск и фильтр */}
//       <div style={{ marginBottom: '20px' }}>
//         <input
//           type="text"
//           placeholder="Поиск по названию..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{ padding: '8px', marginRight: '10px', width: '200px', border: '1px solid #ddd', borderRadius: '4px' }}
//         />
//         <select 
//           value={filterStatus} 
//           onChange={(e) => setFilterStatus(e.target.value)} 
//           style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
//         >
//           <option value="Все">Все статусы</option>
//           <option value="Идея">Идея</option>
//           <option value="В работе">В работе</option>
//           <option value="Завершён">Завершён</option>
//           <option value="Пауз">Пауз</option>
//         </select>
//       </div>
      
//       {/* Список проектов */}
//       <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
//         {filteredProjects.map(project => (
//           <div
//             key={project.id}
//             style={{
//               border: '1px solid #ddd',
//               padding: '15px',
//               borderRadius: '8px',
//               boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//               transition: 'box-shadow 0.2s ease',
//               cursor: 'pointer',  // Делаем кликабельным для навигации
//             }}
//             onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)'}
//             onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'}
//             onClick={() => navigate(`/project/${project.id}`)}  // Навигация по клику на карточку
//           >
//             <h3>{project.title}</h3>
//             <p>{project.description}</p>
//             <p>Статус: <span style={{ 
//               color: project.status === 'Завершён' ? 'green' : 
//                      project.status === 'В работе' ? 'orange' : 
//                      project.status === 'Идея' ? 'blue' : 'gray' 
//             }}>{project.status}</span></p>
//             {/* Прогресс */}
//             <div style={{ margin: '10px 0' }}>
//               Прогресс: {project.progress || 0}%
//               <div
//                 style={{
//                   width: '100%',
//                   background: '#e0e0e0',
//                   borderRadius: '10px',
//                   height: '10px',
//                   marginTop: '5px'
//                 }}
//               >
//                 <div
//                   style={{
//                     width: `${project.progress || 0}%`,
//                     background: (project.progress || 0) > 50 ? '#4caf50' : 

//                                (project.progress || 0) > 20 ? '#ff9800' : '#f44336',
//                     height: '100%',
//                     borderRadius: '10px'
//                   }}
//                 />
//               </div>
//             </div>
//             <p>Команда: {getTeamNames(project.team)}</p>  {/* Показ имен вместо количества */}
//             <small>Создан: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Неизвестно'}</small>
//             <br />
//             {/* Убираем Link, навигация по onClick */}
//           </div>
//         ))}
//       </div>
      
//       {/* Если нет проектов */}
//       {filteredProjects.length === 0 && (
//         <p>Нет проектов по фильтру. <Link to="/create-project">Создай новый!</Link></p>
//       )}
//     </div>
//   );
// }

// export default Home;


// src/pages/Home.js
import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function Home() {
  // ВСЕ хуки — СТРОГО В НАЧАЛЕ, без любого кода перед ними (даже условий!)
  const { currentUser, projects, users } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Все');

  const allProjects = projects || [];  // Переменная для projects без хука

  // Фильтруем проекты по роли (useMemo, безусловно!)
  const userProjects = useMemo(() => {
    if (!currentUser) return [];  // Не должно сработать, но на всякий
    if (currentUser.role === 'admin') return allProjects;
    if (currentUser.role === 'teacher') return allProjects.filter(p => p.ownerId === currentUser.id);
    return allProjects.filter(p => p.ownerId === currentUser.id || p.team.includes(currentUser.id));
  }, [allProjects, currentUser]);

  // Фильтруем по поиску и статусу (второй useMemo)
  const filteredProjects = useMemo(() => {
    return userProjects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'Все' || project.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [userProjects, searchTerm, filterStatus]);

  // Функция для команд (без изменений)
  const getTeamNames = (team) => {
    if (!Array.isArray(team) || team.length === 0) return 'Нет участников';
    return team
      .map(id => {
        const user = users.find(u => u.id === id);
        return user ? user.name : 'Неизвестный пользователь';
      })
      .filter(name => name)
      .join(', ');
  };

  // НИКАКИХ early returns ДО НИХ! Только рендер.
  return (
    <div style={{ padding: '20px' }}>
      <h2>Добро пожаловать, {currentUser.name}! ({currentUser.role}) Твои проекты</h2>
      
      {/* Кнопка создания — только для teachers/admins */}
      {['teacher', 'admin'].includes(currentUser.role) && (
        <Link 
          to="/create-project" 
          style={{ 
            display: 'inline-block', 
            padding: '10px 20px', 
            background: '#28a745', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '5px', 
            marginBottom: '20px',
            transition: 'background 0.3s'
          }}
          onMouseOver={(e) => e.target.style.background = '#218838'}
          onMouseOut={(e) => e.target.style.background = '#28a745'}
        >
          + Создать новый проект
        </Link>
      )}
      
      {/* Поиск и фильтр */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', width: '200px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)} 
          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="Все">Все статусы</option>
          <option value="Идея">Идея</option>
          <option value="В работе">В работе</option>
          <option value="Завершён">Завершён</option>
          <option value="Пауз">Пауз</option>
        </select>
      </div>
      
      {/* Список проектов */}
      <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
        {filteredProjects.map(project => (
          <div
            key={project.id}
            style={{
              border: '1px solid #ddd',
              padding: '15px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'box-shadow 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'}
            onClick={() => navigate(`/project/${project.id}`)}
          >
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <p>Статус: <span style={{ 
              color: project.status === 'Завершён' ? 'green' : 
                     project.status === 'В работе' ? 'orange' : 
                     project.status === 'Идея' ? 'blue' : 'gray' 
            }}>{project.status}</span></p>
            {/* Прогресс */}
            <div style={{ margin: '10px 0' }}>
              Прогресс: {project.progress || 0}%
              <div
                style={{
                  width: '100%',
                  background: '#e0e0e0',
                  borderRadius: '10px',
                  height: '10px',
                  marginTop: '5px'
                }}
              >
                <div
                  style={{
                    width: `${project.progress || 0}%`,
                    background: (project.progress || 0) > 50 ? '#4caf50' : 
                               (project.progress || 0) > 20 ? '#ff9800' : '#f44336',
                    height: '100%',
                    borderRadius: '10px'
                  }}
                />
              </div>
            </div>
            <p>Команда: {getTeamNames(project.team)}</p>
            <small>Создан: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Неизвестно'}</small>
          </div>
        ))}
      </div>
      
      {/* Нет проектов */}
      {filteredProjects.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666' }}>
          Нет проектов по фильтру. {['teacher', 'admin'].includes(currentUser?.role) ? <Link to="/create-project" style={{ color: '#007bff' }}>Создай новый!</Link> : 'Обратитесь к учителю.'}
        </p>
      )}
    </div>
  );
}

export default Home;
