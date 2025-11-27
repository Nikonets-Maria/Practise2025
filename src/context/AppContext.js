// src/context/AppContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import {                         
  getMockUsers,                  
  saveMockUsers,                  
  getProjects,                   
  saveProjects                   
} from '../data/mockData';       

// Создание контекста
const AppContext = createContext();

// Хук для доступа к контексту
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');  
  }
  return context;
};

// Провайдер состояния
export const AppProvider = ({ children }) => {
  // Состояние: Текущий пользователь  
  const [currentUser, setCurrentUserState] = useState(() => {
    const saved = localStorage.getItem('currentUser');  
    return saved ? JSON.parse(saved) : null;       
  });
  
  // Функция: Установка currentUser с синхронизацией localStorage
  const setCurrentUser = (user) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));  
    } else {
      localStorage.removeItem('currentUser');       
    }
  };

  // Состояние: Список проектов  
  const [projects, setProjectsState] = useState(() => {
    return getProjects();                            
  });

  // Функция: Установка projects с синхронизацией localStorage
  const setProjects = (newProjects) => {
    setProjectsState(newProjects);
    saveProjects(newProjects);                       
  };

  // Состояние: Список пользователей  
  const [users, setUsersState] = useState(() => {
    return getMockUsers();                            
  });

  // Функция: Установка users с синхронизацией localStorage
  const setUsers = (newUsers) => {
    setUsersState(newUsers);
    saveMockUsers(newUsers);                         
  };

  // Эффект инициализации
  useEffect(() => {
    if (projects.length === 0) {
      const mockProjs = getProjects();               
      setProjects(mockProjs);
    }
    if (users.length === 0) {
      const mockUsers = getMockUsers();              
      setUsers(mockUsers);
    }
  }, []);                                            

  // Функция: Logout
  const logout = () => {
    setCurrentUser(null);                            
  };

  // Функция: Создание нового проекта
  const createProject = (projectData) => {
    if (!currentUser) return;                          
    if (!['teacher', 'admin'].includes(currentUser.role)) return; 
    const { teamIds = [currentUser.id] } = projectData;  
    const newProject = {
      id: Date.now().toString(),                     
      title: projectData.title,
      description: projectData.description,
      ownerId: currentUser.id,                        
      team: teamIds,                                  
      status: 'Идея',                          
      progress: 0,
      comments: [],                                   
      createdAt: new Date().toISOString(),          
      tasks: []                                      
    };
    setProjects(prev => [...prev, newProject]);      
  };

  // Функция: Добавление задачи в проект
  const addTask = (projectId, taskData) => {
    if (!currentUser) return;                          
    const project = projects.find(p => p.id === projectId);
    if (!project) return;                             
    const isMember = project.team.includes(currentUser.id) || project.ownerId === currentUser.id;
    if (!isMember) return;                             
    const newTask = { ...taskData, id: Date.now().toString() };  
    setProjects(prev => 
      prev.map(p => 
        p.id === projectId 
          ? { ...p, tasks: [...(p.tasks || []), newTask] } 
          : p
      )
    );                                               
  };

  // Функция: Изменение статуса задачи 
  const updateTaskStatus = (projectId, taskId, newStatus) => {
    if (!currentUser) return;
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    const task = project.tasks.find(t => t.id === taskId);
    if (!task) return;                                 
    const canUpdate = task.assignedTo === currentUser.id || project.ownerId === currentUser.id;
    if (!canUpdate) return;                            
    setProjects(prev => 
      prev.map(p => 
        p.id === projectId 
          ? { 
              ...p, 
              tasks: p.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t) 
            } 
          : p
      )
    );
  };

  // Функция: Удаление задачи
  const removeTask = (projectId, taskId) => {
    if (!currentUser) return;
    const project = projects.find(p => p.id === projectId);
    if (!project || project.ownerId !== currentUser.id) return; 
    setProjects(prev => 
      prev.map(p => 
        p.id === projectId 
          ? { ...p, tasks: p.tasks.filter(t => t.id !== taskId) } 
          : p
      )
    );
  };

  // Функция: Обновление проекта
  const updateProject = (projectId, updates) => {
    if (!currentUser) return;
    const project = projects.find(p => p.id === projectId);
    if (!project || project.ownerId !== currentUser.id) return;  
    setProjects(prev => 
      prev.map(p => p.id === projectId ? { ...p, ...updates } : p)
    );
  };

  // Функция: Добавление комментария
  const addComment = (projectId, commentData) => {
    if (!currentUser) return;
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    const isMember = project.team.includes(currentUser.id) || project.ownerId === currentUser.id;
    if (!isMember) return;                             
    const newComment = { 
      ...commentData, 
      id: Date.now().toString(), 
      date: new Date().toISOString().split('T')[0]   
    };
    setProjects(prev => 
      prev.map(p => 
        p.id === projectId 
          ? { ...p, comments: [...(p.comments || []), newComment] } 
          : p
      )
    );
  };

  // Функция: Приглашение пользователя в команду
  const inviteUserToTeam = (projectId, userId) => {
    if (!currentUser) return;
    const project = projects.find(p => p.id === projectId);
    const user = users.find(u => u.id === userId);
    if (!project || !user || project.ownerId !== currentUser.id || project.team.includes(userId)) return;
    setProjects(prev => 
      prev.map(p => 
        p.id === projectId 
          ? { ...p, team: [...new Set([...p.team, userId])] }  
          : p
      )
    );
  };

  // Функция: Удаление из проекта
  const removeFromProject = (projectId, userId) => {
    if (!currentUser) return;
    const project = projects.find(p => p.id === projectId);
    if (!project || project.ownerId !== currentUser.id || userId === project.ownerId || !project.team.includes(userId)) return;
    setProjects(prev => 
      prev.map(p => 
        p.id === projectId 
          ? { ...p, team: p.team.filter(id => id !== userId) } 
          : p
      )
    );
  };

  // Value object: Экспорт state и functions
  const value = {
    // State
    currentUser,
    projects,
    users,
    // Auth/Logout
    setCurrentUser,
    logout,
    setUsers,
    // Project Operations
    createProject,
    setProjects,
    addTask,
    updateTaskStatus,
    removeTask,
    updateProject,
    addComment,
    inviteUserToTeam,
    removeFromProject
  };

  // Рендер: Provider с children и value
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
