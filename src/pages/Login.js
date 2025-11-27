// src/pages/Login.js
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { getMockUsers, saveMockUsers, mockUsers } from '../data/mockData';  // Добавь экспорты в mockData.js

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');  // Для Sign Up
  const [role, setRole] = useState('student');  // Дефолт ролевая
  const [isSignUp, setIsSignUp] = useState(false);  // Режим: false - login, true - sign up
  const [error, setError] = useState('');
  const { setCurrentUser } = useAppContext();
  const navigate = useNavigate();
  const emailRef = useRef(null);  // Для автофокуса

  // Очистка ошибки при изменении полей
  const clearError = () => {
    if (error) setError('');
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setRole('student');
    setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const currentUsers = getMockUsers();  // Используем localStorage или дефолт
    const user = currentUsers.find(u => u.email === email.toLowerCase() && u.password === password);
    if (user) {
      setCurrentUser(user);
      navigate('/');
    } else {
      setError('Неверный email или пароль. (Тест: user@example.com / password123)');
      if (emailRef.current) emailRef.current.focus();
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setError('');
    const currentUsers = getMockUsers();

    // Валидация
    if (!name.trim()) {
      setError('Введите имя!');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Введите корректный email!');
      return;
    }
    const lowerEmail = email.toLowerCase();
    if (currentUsers.some(u => u.email === lowerEmail)) {
      setError('Этот email уже зарегистрирован!');
      return;
    }
    if (password.length < 6) {
      setError('Пароль минимум 6 символов!');
      return;
    }
    if (!['teacher', 'student'].includes(role)) {
      setError('Неверная роль!');
      return;
    }

    // Создать нового пользователя
    const newUser = {
      id: Date.now().toString(),  // Уникальный ID
      name: name.trim(),
      email: lowerEmail,
      role,
      password,  // В реале - хэшировать, но mock
    };

    // Сохранить
    const updatedUsers = [...currentUsers, newUser];
    saveMockUsers(updatedUsers);

    // Авто-логин
    setCurrentUser(newUser);
    navigate('/');
    alert(`Регистрация успешна! Добро пожаловать, ${newUser.name}!`);
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '50px auto',
      padding: '30px',
      border: '1px solid #ddd',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      backgroundColor: '#fff'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        {isSignUp ? 'Регистрация в EduCollab' : 'Вход в EduCollab'}
      </h2>
      <form onSubmit={isSignUp ? handleSignUp : handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
        {isSignUp && (
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Имя:
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError();
              }}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        )}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Email:
          </label>
          <input
            id="email"
            type="email"
            ref={emailRef}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError();
            }}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Пароль:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearError();
            }}
            required
            minLength={isSignUp ? 6 : 0}  // Для sign up - проверка длины
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        {isSignUp && (
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="role" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Роль:
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                clearError();
              }}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            >
              <option value="student">Студент</option>
              <option value="teacher">Учитель</option>
            </select>
          </div>
        )}
        {error && (
          <p style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>
            {error}
          </p>
        )}
        <button
          type="submit"
          style={{
            padding: '12px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = '#0056b3'}
          onMouseOut={(e) => e.target.style.background = '#007bff'}
        >
          {isSignUp ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            resetForm();  // Очищаем поля при переключении
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#007bff',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          {isSignUp ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
        </button>
      </div>
    </div>
  );
}

export default Login;
