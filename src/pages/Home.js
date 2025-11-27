// src/pages/Home.js
// Домашняя страница EduCollab: отображает проекты пользователя с фильтрацией по роли и поиском.

import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function Home() {
  const { currentUser, projects, users } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Все');

  const allProjects = projects || [];

  // Фильтрация проектов по роли пользователя
  const userProjects = useMemo(() => {
    if (currentUser.role === 'admin') return allProjects;
    if (currentUser.role === 'teacher') return allProjects.filter(p => p.ownerId === currentUser.id);
    return allProjects.filter(p => p.ownerId === currentUser.id || p.team.includes(currentUser.id));
  }, [allProjects, currentUser]);

  // Дополнительная фильтрация по поиску и статусу
  const filteredProjects = useMemo(() => {
    return userProjects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
      const projectStatus = project.status || '';
      const matchesStatus = filterStatus === 'Все' || projectStatus === filterStatus;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => (new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1));
  }, [userProjects, searchTerm, filterStatus]);

  // Получение имен участников команды по IDs
  const getTeamNames = (team) => {
    if (!Array.isArray(team) || team.length === 0) return 'Нет участников';
    const names = team
      .map(id => users.find(u => u.id === id)?.name || 'Неизвестный пользователь')
      .filter(name => name !== 'Неизвестный пользователь');
    return names.length > 0 ? names.join(', ') : 'Нет участников';
  };

  return (
    <div className="home-container">
      <h2 className="welcome-title">Добро пожаловать, {currentUser?.name || 'Пользователь'}! ({currentUser?.role || 'Без роли'}) Твои проекты</h2>
      
      {['teacher', 'admin'].includes(currentUser?.role) && (
        <Link to="/create-project" className="create-btn">+ Создать новый проект</Link>
      )}
      
      <div className="filters">
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)} 
          className="status-select"
        >
          <option value="Все">Все статусы</option>
          <option value="Идея">Идея</option>
          <option value="В работе">В работе</option>
          <option value="Завершён">Завершён</option>
          <option value="Пауз">Пауз</option>
        </select>
      </div>
      
      <div className="project-grid">
        {filteredProjects.map(project => (
          <div
            key={project.id}
            className="project-card"
            onClick={() => navigate(`/project/${project.id}`)}
          >
            <h3 className="project-title">{project.title}</h3>
            <p className="project-desc">{project.description}</p>
            <p className="project-status">Статус: <span className="status-chip" style={{ 
              color: project.status === 'Завершён' ? 'green' : 
                     project.status === 'В работе' ? 'SlateBlue' : 
                     project.status === 'Идея' ? 'blue' : 'gray'
            }}>{project.status || 'Не задан'}</span></p>
            <div className="progress-container">
              <p className="progress-text">Прогресс: {project.progress || 0}%</p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${project.progress || 0}%`,
                    backgroundColor: (project.progress || 0) > 50 ? '#4caf50' : 
                                     (project.progress || 0) > 20 ? '#ff9800' : '#f44336'
                  }}
                />
              </div>
            </div>
            <p className="project-team">Команда: {getTeamNames(project.team)}</p>
            <small className="project-date">Создан: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Неизвестно'}</small>
          </div>
        ))}
      </div>
      
      {filteredProjects.length === 0 && (
        <p className="empty-msg">
          Нет проектов по фильтру. 
          {['teacher', 'admin'].includes(currentUser?.role) ? 
            <Link to="/create-project" className="create-link">Создай новый!</Link> : 
            'Обратитесь к учителю.'
          }
        </p>
      )}
    </div>
  );
}

export default Home;
