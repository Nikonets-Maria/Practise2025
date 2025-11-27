// src/pages/Login.js
// Страница входа и регистрации в EduCollab с переключаемым режимом.

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { getMockUsers, saveMockUsers } from '../data/mockData';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { setCurrentUser } = useAppContext();
  const navigate = useNavigate();
  
  const emailRef = useRef(null);
  const nameRef = useRef(null);

  useEffect(() => {
    if (isSignUp) {
      nameRef.current?.focus();
    } else {
      emailRef.current?.focus();
    }
  }, [isSignUp]);

  const clearError = () => setError('');
  const clearSuccess = () => setSuccess('');
  
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setRole('student');
    setError('');
    setSuccess('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const currentUsers = getMockUsers();
    const user = currentUsers.find(u => u.email === email.toLowerCase() && u.password === password);
    if (user) {
      setCurrentUser(user);
      navigate('/');
    } else {
      setError('Неверный email или пароль. (Тест: user@example.com / password123)');
      emailRef.current?.focus();
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const currentUsers = getMockUsers();
    
    if (!name.trim()) {
      setError('Введите имя!');
      nameRef.current?.focus();
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Введите корректный email!');
      emailRef.current?.focus();
      return;
    }
    const lowerEmail = email.toLowerCase();
    if (currentUsers.some(u => u.email === lowerEmail)) {
      setError('Этот email уже зарегистрирован!');
      emailRef.current?.focus();
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
    
    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: lowerEmail,
      role,
      password,
    };
    const updatedUsers = [...currentUsers, newUser];
    saveMockUsers(updatedUsers);
    setCurrentUser(newUser);
    setSuccess(`Регистрация успешна! Добро пожаловать, ${newUser.name}!`);
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div className="login-container">
      <h2 className="login-title">
        {isSignUp ? 'Регистрация в EduCollab' : 'Вход в EduCollab'}
      </h2>
      <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="login-form">
        {isSignUp && (
          <div className="form-field">
            <label htmlFor="name" className="form-label">Имя:</label>
            <input
              id="name"
              type="text"
              ref={nameRef}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError();
                clearSuccess();
              }}
              required
              className="form-input"
            />
          </div>
        )}
        <div className="form-field">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            id="email"
            type="email"
            ref={emailRef}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError();
              clearSuccess();
            }}
            required
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label htmlFor="password" className="form-label">Пароль:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearError();
              clearSuccess();
            }}
            required
            className="form-input"
          />
        </div>
        {isSignUp && (
          <div className="form-field">
            <label htmlFor="role" className="form-label">Роль:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                clearError();
                clearSuccess();
              }}
              className="form-select"
            >
              <option value="student">Студент</option>
              <option value="teacher">Учитель</option>
            </select>
          </div>
        )}
        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}
        <button
          type="submit"
          aria-label={isSignUp ? 'Зарегистрироваться' : 'Войти'}
          className="btn btn-primary"
        >
          {isSignUp ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </form>
      <div className="toggle-section">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            resetForm();
          }}
          aria-label={isSignUp ? 'Перейти к входу' : 'Перейти к регистрации'}
          className="btn-link"
        >
          {isSignUp ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
        </button>
      </div>
    </div>
  );
}

export default Login;
