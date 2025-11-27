// src/pages/Login.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { getMockUsers, saveMockUsers } from '../data/mockData';  // mockUsers не нужен, если не используем напрямую

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');  // Новый: для успеха без alert
  const { setCurrentUser } = useAppContext();
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const nameRef = useRef(null);  // Для автофокуса на name в sign up

  useEffect(() => {
    // Автофокус на первое поле
    if (isSignUp) {
      nameRef.current?.focus();
    } else {
      emailRef.current?.focus();
    }
  }, [isSignUp]);

  const clearError = () => {
    if (error) setError('');
  };

  const clearSuccess = () => {
    if (success) setSuccess('');
  };

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
    setSuccess('');  // Очистка предыдущего успеха
    const currentUsers = getMockUsers();

    // Валидация (без изменений)
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
      // Фокус на password, но ref нет — можно добавить
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
    setSuccess(`Регистрация успешна! Добро пожаловать, ${newUser.name}!`);  // В UI вместо alert
    // navigate('/') оставляем, но success покажет перед редиректом (или delay если нужно)
    setTimeout(() => navigate('/'), 1500);  // Короткая задержка для показа успеха
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
              ref={nameRef}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError();
                clearSuccess();
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
              clearSuccess();
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
              clearSuccess();
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
                clearSuccess();
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
        {success && (
          <p style={{ color: 'green', marginBottom: '15px', textAlign: 'center' }}>
            {success}
          </p>
        )}
        <button
          type="submit"
          aria-label={isSignUp ? 'Зарегистрироваться' : 'Войти'}
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
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            resetForm();
          }}
          aria-label={isSignUp ? 'Перейти к входу' : 'Перейти к регистрации'}
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
