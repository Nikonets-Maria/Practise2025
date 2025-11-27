// src/pages/CreateProject.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function CreateProject() {
  // Состояния формы
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [teamEmails, setTeamEmails] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Контекст
  const { createProject, currentUser, users } = useAppContext();
  // Навигация
  const navigate = useNavigate();

  // Обработчик создания проекта
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Валидация обязательных полей
    if (!title.trim() || !description.trim()) {
      setError('Заполни название и описание!');
      return;
    }

    // Обработка команды: парсим emails и проверяем
    const teamEmailArray = teamEmails.split(',').map(email => email.trim()).filter(email => email);
    const teamIds = [];
    let invalidEmails = [];

    teamEmailArray.forEach(email => {
      const user = users.find(u => u.email === email.toLowerCase());
      if (user) {
        teamIds.push(user.id);
      } else {
        invalidEmails.push(email);
      }
    });

    if (invalidEmails.length > 0) {
      setError(`Некоторые email не найдены в системе: ${invalidEmails.join(', ')}`);
      return;
    }

    // Добавление создателя в команду
    if (!teamIds.includes(currentUser.id)) {
      teamIds.push(currentUser.id);
    }

    // Создание проекта
    createProject({
      title: title.trim(),
      description: description.trim(),
      teamIds,
    });

    setSuccess('Проект создан успешно!');
    setError('');
    setTitle('');
    setDescription('');
    setTeamEmails('');

    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  // Ролевая защита
  if (!currentUser) {
    navigate('/login');
    return null;
  }
  if (!['teacher', 'admin'].includes(currentUser.role)) {
    setError('У вас нет прав для создания проектов. Обратитесь к администратору.');
    navigate('/');
    return null;
  }

  // Рендер формы
  return (
    <div className="create-project-container">
      <h2 className="create-title">Создать новый проект</h2>
      <form onSubmit={handleSubmit} className="create-form">
        {/* Поле названия */}
        <div className="form-group">
          <label className="form-label">Название проекта:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-input"
            placeholder="Введите название..."
          />
        </div>

        {/* Поле описания */}
        <div className="form-group">
          <label className="form-label">Описание проекта:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
            className="form-textarea"
            placeholder="Введите описание проекта..."
          />
        </div>

        {/* Поле команды */}
        <div className="form-group">
          <label className="form-label">Участники команды (email через запятую, необязательно):</label>
          <textarea
            value={teamEmails}
            onChange={(e) => setTeamEmails(e.target.value)}
            placeholder="example@email.com, another@email.com"
            rows="2"
            className="form-textarea team-input"
          />
          <small className="form-hint">Ты автоматически добавлен в команду. Только зарегистрированные пользователи.</small>
        </div>

        {/* Сообщения */}
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        {/* Кнопка подтверждения */}
        <button
          type="submit"
          className="submit-btn"
          disabled={!title.trim() || !description.trim()}
        >
          Создать проект
        </button>
      </form>

      {/* Кнопка отмены */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="cancel-btn"
      >
        Отмена
      </button>
    </div>
  );
}

export default CreateProject;
