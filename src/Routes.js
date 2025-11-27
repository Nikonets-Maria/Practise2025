// src/Routes.js (расширение твоего)
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';  // Новый
import CreateProject from './pages/CreateProject'; // Новый

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/project/:id" element={<ProjectDetail />} />  // Детали по ID
      <Route path="/create-project" element={<CreateProject />} /> // Создание
    </Routes>
  );
}
