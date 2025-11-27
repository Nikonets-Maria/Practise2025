// src/pages/CreateProject.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function CreateProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [teamEmails, setTeamEmails] = useState('');  // Новое: поле для email участников (через запятую)
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');  // Новое: сообщение об успехе
  const { createProject, currentUser, users } = useAppContext();  // Добавлен users из context
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Заполни название и описание!');
      setSuccess('');
      return;
    }

    // Обработка команды: разбить email по запятой, найти соответствующие ID, фильтровать существующие
    const teamEmailArray = teamEmails.split(',').map(email => email.trim()).filter(email => email);
    const teamIds = [];
    let invalidEmails = [];

    teamEmailArray.forEach(email => {
      const user = users.find(u => u.email === email);
      if (user) {
        teamIds.push(user.id);
      } else {
        invalidEmails.push(email);
      }
    });

    if (invalidEmails.length > 0) {
      setError(`Некоторые email не найдены: ${invalidEmails.join(', ')}`);
      setSuccess('');
      return;
    }

    // Добавляем текущего пользователя в команду автоматически (если не добавлен)
    if (!teamIds.includes(currentUser.id)) {
      teamIds.push(currentUser.id);
    }

    createProject({
      title: title.trim(),
      description: description.trim(),
      teamIds,  // Передаем teamIds в createProject
    });

    setSuccess('Проект создан успешно!');
    setError('');
    setTitle('');
    setDescription('');
    setTeamEmails('');

    // Редирект на Home с задержкой, чтобы увидеть успех (можно убрать, если не нужно)
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Создать новый проект</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Название проекта:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Описание проекта:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Участники команды (email через запятую, необязательно):</label>
          <textarea
            value={teamEmails}
            onChange={(e) => setTeamEmails(e.target.value)}
            placeholder="example@email.com, another@email.com"
            rows="2"
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
          />
          <small style={{ color: '#666' }}>Ты автоматически добавлен в команду. Только зарегистрированные пользователи.</small>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button
          type="submit"
          style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', width: '100%', cursor: 'pointer' }}
          disabled={!title.trim() || !description.trim()}  // Disable если не заполнены основные поля
        >
          Создать проект
        </button>
      </form>
    </div>
  );
}

export default CreateProject;
