// src/pages/Profile.js

import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { getMockUsers, saveMockUsers } from '../data/mockData';

function Profile() {
  const { currentUser, setCurrentUser } = useAppContext();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!name.trim()) {
      setError('Введите имя!');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Введите корректный email!');
      return;
    }
    if (password && password.length < 6) {
      setError('Пароль минимум 6 символов!');
      return;
    }
    
    const users = getMockUsers();
    const updatedUsers = users.map(user =>
      user.id === currentUser.id ? {
        ...user,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        ...(password ? { password } : {})
      } : user
    );
    saveMockUsers(updatedUsers);
    const updatedUser = updatedUsers.find(u => u.id === currentUser.id);
    setCurrentUser(updatedUser);
    setSuccess('Профиль обновлён!');
    setTimeout(() => setSuccess(''), 2000);
  };

  if (!currentUser) return <p>Не авторизован.</p>;

  return (
    <div className="profile-container">
      <h2>Профиль пользователя</h2>
      <form onSubmit={handleSave}>
        <div className="form-field">
          <label htmlFor="profileName">Имя:</label>
          <input
            id="profileName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-input"
          />
        </div>
        
        <div className="form-field">
          <label htmlFor="profileEmail">Email:</label>
          <input
            id="profileEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>
        
        <div className="form-field">
          <label htmlFor="profilePassword">Новый пароль (оставь пустым для без изменений):</label>
          <input
            id="profilePassword"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
          />
        </div>
        
        <p><strong>Роль:</strong> {currentUser.role} (только админ может менять)</p>
        
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={!name.trim() || !email.trim()}
        >
          Сохранить
        </button>
      </form>
    </div>
  );
}

export default Profile;
