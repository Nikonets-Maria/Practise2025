// src/pages/Profile.js
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { getMockUsers, saveMockUsers } from '../data/mockData';

function Profile() {
  const { currentUser, setCurrentUser } = useAppContext();
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState(''); // Для изменения пароля (опционально)
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setError('');
    const users = getMockUsers();
    const updatedUsers = users.map(user =>
      user.id === currentUser.id ? { ...user, name: name.trim(), email: email.trim().toLowerCase(), ...(password ? { password } : {}) } : user
    );
    const updatedUser = updatedUsers.find(u => u.id === currentUser.id);
    setCurrentUser(updatedUser);
    saveMockUsers(updatedUsers);
    setSuccess('Профиль обновлён!');
    setTimeout(() => setSuccess(''), 2000);
  };

  if (!currentUser) return <p>Не авторизован.</p>;

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>
      <h2>Профиль пользователя</h2>
      <form onSubmit={handleSave}>
        <div style={{ marginBottom: '15px' }}>
          <label>Имя:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Новый пароль (оставь пустым для без изменений):</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <p><strong>Роль:</strong> {currentUser.role} (только админ может менять)</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Сохранить</button>
      </form>
    </div>
  );
}

export default Profile;
