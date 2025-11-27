// src/context/AppContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockProjects, mockUsers } from '../data/mockData';  // Импорт mock-данных

// Создаем контекст
const AppContext = createContext();

// Хук для использования контекста
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

// Провайдер
export const AppProvider = ({ children }) => {
  // Состояние для текущего пользователя (с persist)
  const [currentUser, setCurrentUserState] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  
  // Функция для установки currentUser с сохранением
  const setCurrentUser = (user) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
      // Очистка projects при логауте (опционально)
      // localStorage.removeItem('projects');
    }
  };

  const [projects, setProjects] = useState(mockProjects);  // Mock-данные

  // Функция для создания нового проекта
  const createProject = (project) => {
    const { teamIds = [currentUser.id] } = project;
    const newProject = {
      id: Date.now().toString(),
      title: project.title,
      description: project.description,
      ownerId: currentUser.id,
      team: teamIds,
      status: 'Идея',
      progress: 0,
      comments: [],
      createdAt: new Date().toISOString(),
      tasks: [],
    };
    setProjects((prev) => [...prev, newProject]);
  };


  // Инициализация: загружаем mockProjects в projects при монтировании (если пусто)
  useEffect(() => {
    setProjects(mockProjects);  // Mock-данные в state
  }, []);

  // Функция для создания нового проекта
//   const createProject = (newProject) => {
//     if (!currentUser) return; // Проверка аутентификации
//     const updatedProjects = [
//       ...projects,
//       {
//         ...newProject,
//         id: Date.now().toString(),  // Простой уникальный ID
//         ownerId: currentUser.id,
//         team: [currentUser.id],     // Владелец в команде (массив ID)
//         status: 'В работе',         // Дефолтный статус
//         progress: 0,
//         comments: [],
//         tasks: [],                  // Пустой массив задач
//         createdAt: new Date().toISOString(),
//       },
//     ];
//     setProjects(updatedProjects);
//   };

//   const createProject = (project) => {
//   const { teamIds = [currentUser.id] } = project;  // Дефолт: владелец в команде
//   const newProject = {
//     id: Date.now().toString(),
//     title: project.title,
//     description: project.description,
//     ownerId: currentUser.id,
//     team: teamIds,  // Используем переданный teamIds
//     status: 'Идея',
//     progress: 0,
//     comments: [],
//     createdAt: new Date().toISOString(),
//     tasks: [],
//   };
//   setProjects((prev) => [...prev, newProject]);
// };


  const logout = () => {
    setCurrentUser(null);  // Удалит из localStorage автоматически
  };
  

  // Функция для добавления задачи
  const addTask = (projectId, task) => {
    if (!currentUser) return;
    setProjects(prevProjects => 
      prevProjects.map(project =>
        project.id === projectId
          ? { ...project, tasks: [...(project.tasks || []), { ...task, id: Date.now().toString() }] }
          : project
      )
    );
  };

  // Функция для изменения статуса задачи
  const updateTaskStatus = (projectId, taskId, newStatus) => {
    if (!currentUser) return;
    setProjects(prevProjects => 
      prevProjects.map(project =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map(task =>
                task.id === taskId ? { ...task, status: newStatus } : task
              )
            }
          : project
      )
    );
  };

  // Функция для удаления задачи (только владелец)
  const removeTask = (projectId, taskId) => {
    if (!currentUser) return;
    setProjects(prevProjects => 
      prevProjects.map(project =>
        project.id === projectId && project.ownerId === currentUser.id  // Только владелец
          ? { ...project, tasks: project.tasks.filter(task => task.id !== taskId) }
          : project
      )
    );
  };

  // Функция для обновления проекта
  const updateProject = (id, updates) => {
    if (!currentUser) return;
    const updatedProjects = projects.map(p =>
      p.id === id ? { ...p, ...updates } : p
    );
    setProjects(updatedProjects);
  };

  // Функция для добавления комментария
  const addComment = (projectId, comment) => {
    if (!currentUser) return;
    const updatedProjects = projects.map(p =>
      p.id === projectId ? {
        ...p,
        comments: [...(p.comments || []), { ...comment, id: Date.now().toString(), date: new Date().toISOString().split('T')[0] }]
      } : p
    );
    setProjects(updatedProjects);
  };

  // Функция для приглашения пользователя в команду (добавляет ID)
  const inviteUserToTeam = (projectId, userId) => {
    if (!mockUsers.find(u => u.id === userId) || !currentUser) return;  // Проверка на существование user и аутентификацию
    const project = projects.find(p => p.id === projectId);
    if (!project || project.ownerId !== currentUser.id) return;  // Только владелец
    const updatedProjects = projects.map(p =>
      p.id === projectId ? {
        ...p,
        team: [...new Set([...p.team, userId])]  // Убираем дубликаты, добавляем ID
      } : p
    );
    setProjects(updatedProjects);
  };

  // Функция для приглашения в проект (alias для inviteUserToTeam, с проверками)
  const inviteToProject = (projectId, userId) => {
    const project = projects.find(p => p.id === projectId);
    const user = mockUsers.find(u => u.id === userId);
    if (!project || !user || project.team.includes(userId) || project.ownerId !== currentUser.id) {
      return;  // Не приглашать, если нет проекта, юзера, уже в команде или не владелец
    }
    inviteUserToTeam(projectId, userId);  // Используем унифицированную функцию
  };

  // Функция для удаления из проекта (только владелец, нельзя удалить самого себя)
  const removeFromProject = (projectId, userId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project || project.ownerId !== currentUser.id || userId === project.ownerId || !project.team.includes(userId)) {
      return;  // Невозможно удалить: не владелец, пытаешься удалить самого себя или юзер не в команде
    }
    const updatedProjects = projects.map(p =>
      p.id === projectId ? { ...p, team: p.team.filter(id => id !== userId) } : p
    );
    setProjects(updatedProjects);
  };

  // Объект value для Provider (включает все функции и состояния)
  const value = {
    currentUser,
    setCurrentUser,
    logout,  // Добавлен для удобства
    projects,
    createProject,
    setProjects,  // Осторожно использовать напрямую; лучше через функции
    addTask,
    updateTaskStatus,
    removeTask,
    updateProject,
    addComment,
    inviteUserToTeam,
    inviteToProject,
    removeFromProject,
    // Дополнительно: список пользователей (для поиска при приглашении)
    users: mockUsers,
    
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
