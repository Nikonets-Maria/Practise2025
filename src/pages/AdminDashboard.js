// src/pages/AdminDashboard.js

import React, { useState, useEffect } from 'react';
import { getMockUsers, saveMockUsers, getProjects, saveProjects } from '../data/mockData';
import { Link, useNavigate } from 'react-router-dom';

function AdminDashboard() {
  // Состояния: данные и UI
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  // Загрузка данных из localStorage
  useEffect(() => {
    const loadData = () => {
      setUsers(getMockUsers());
      setProjects(getProjects());
      setLoading(false);
    };
    loadData();
  }, []);

  // Фильтрация пользователей по поиску
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Изменение роли пользователя
  const handleRoleChange = (userId, newRole) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);
    saveMockUsers(updatedUsers);
    setSuccess('Роль пользователя обновлена!');
    setTimeout(() => setSuccess(''), 3000);
  };

  // Удаление пользователя с подтверждением
  const handleDeleteUser = (userId) => {
    if (!window.confirm('Удалить этого пользователя? Это действие необратимо!')) return;
    
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    saveMockUsers(updatedUsers);
    setSuccess('Пользователь удалён!');
    setTimeout(() => setSuccess(''), 3000);
  };

  // Удаление проекта с подтверждением
  const handleDeleteProject = (projectId) => {
    if (!window.confirm('Удалить этот проект? Все данные (задачи, комментарии) потеряются!')) return;
    
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    setSuccess('Проект удалён!');
    setTimeout(() => setSuccess(''), 3000);
  };

  // Очистка уведомлений
  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="loading-container">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Заголовок панели */}
      <h1 className="dashboard-title">Admin Dashboard</h1>
      
      {/* Секция статистики */}
      <div className="stats-section">
        <h3>Статистика</h3>
        <p>Всего пользователей: {users.length}</p>
        <p>Всего проектов: {projects.length}</p>
        <p>Активных проектов: {projects.filter(p => p.status !== 'Завершён').length}</p>
        <button
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          className="clear-data-btn"
        >
          Очистить все данные (Dev only)
        </button>
      </div>

      {/* Уведомления об ошибках/успехе */}
      {error && (
        <div className="error-notification">
          {error}
          <button onClick={clearMessages} className="dismiss-btn">×</button>
        </div>
      )}
      {success && (
        <div className="success-notification">
          {success}
          <button onClick={clearMessages} className="dismiss-btn">×</button>
        </div>
      )}

      {/* Секция управления пользователями */}
      <section className="users-section">
        <div className="section-header">
          <h2>Управление пользователями ({filteredUsers.length} из {users.length})</h2>
          <input
            type="text"
            placeholder="Поиск по email или имени..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        {filteredUsers.length === 0 ? (
          <p className="no-results">Пользователи не найдены по поиску.</p>
        ) : (
          <div className="users-grid">
            {filteredUsers.map(user => (
              <div key={user.id} className="user-card">
                <div className="user-info">
                  <strong>{user.name}</strong> ({user.email}) — <em>Роль: {user.role}</em>
                </div>
                <div className="user-actions">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="role-select"
                  >
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                  </select>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="delete-btn"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Секция проектов */}
      <section className="projects-section">
        <h2>Все проекты ({projects.length})</h2>
        {projects.length === 0 ? (
          <p className="no-results">Нет проектов. <Link to="/create-project" className="link-create">Создайте первый!</Link></p>
        ) : (
          <ul className="projects-list">
            {projects.map(project => (
              <li key={project.id} className="project-card">
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <p><strong>Владелец ID:</strong> {project.ownerId}</p>
                  <p><strong>Команда:</strong> {Array.isArray(project.team) ? project.team.join(', ') : 'Нет команды'}</p>
                  <p><strong>Статус:</strong> {project.status} | <strong>Прогресс:</strong> {project.progress || 0}%</p>
                  <p><strong>Задачи:</strong> {Array.isArray(project.tasks) ? project.tasks.length : 0} | <strong>Комментарии:</strong> {Array.isArray(project.comments) ? project.comments.length : 0}</p>
                  <small>Создан: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Неизвестно'}</small>
                </div>
                <div className="project-actions">
                  <Link to={`/project/${project.id}`} className="view-btn">
                    Просмотр
                  </Link>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="delete-btn"
                  >
                    Удалить
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Навигация назад */}
      <div className="navigation-footer">
        <button
          onClick={() => navigate('/')}
          className="back-home-btn"
        >
          ← Назад к Home
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
