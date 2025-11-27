// src/pages/ProjectDetail.js (полностью обновлённая версия с модалами, безопасными массивами и фиксами)

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { mockUsers } from '../data/mockData';

function ProjectDetail() {
  const { id } = useParams();
  const { projects, currentUser, updateProject, addComment, addTask, updateTaskStatus, removeTask, inviteUserToTeam } = useAppContext();
  const project = projects.find(p => p.id === id);
  const navigate = useNavigate();

  // Только состояния для модалов (старые удалены для чистоты)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAddCommentModalOpen, setIsAddCommentModalOpen] = useState(false);
  const [selectedInviteUserId, setSelectedInviteUserId] = useState('');
  const [editData, setEditData] = useState({ title: project?.title || '', description: project?.description || '', progress: project?.progress || 0 });
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentRating, setCommentRating] = useState(1);
  const [error, setError] = useState('');

  // Безопасные массивы
  const safeTeam = Array.isArray(project?.team) ? project.team : [];
  const safeTasks = Array.isArray(project?.tasks) ? project.tasks : [];
  const safeComments = Array.isArray(project?.comments) ? project.comments : [];

  const teamMembers = project ? [
    { id: project.ownerId, name: mockUsers.find(u => u.id === project.ownerId)?.name || 'Владелец' },
    ...safeTeam.map(member => ({
      id: typeof member === 'string' ? member : member.id,
      name: typeof member === 'string' ? (mockUsers.find(u => u.id === member)?.name || member) : (member.name || member.id)
    }))
  ] : [];

  if (!project || !currentUser) {
    navigate('/');
    return null;
  }

  const isOwner = project.ownerId === currentUser.id;
  const clearError = () => setError('');

  const ProgressBar = ({ progress }) => (
    <div style={{ width: '100%', background: '#e0e0e0', borderRadius: '10px', height: '20px', margin: '5px 0' }}>
      <div
        style={{
          width: `${progress}%`,
          background: progress > 50 ? '#4caf50' : progress > 20 ? '#ff9800' : '#f44336',
          height: '100%',
          borderRadius: '10px',
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  );

  // Обработчики (только для модалов, переименованы и очищены)
  const handleSaveEditModal = () => {
    if (!editData.title.trim() || !editData.description.trim() || editData.progress < 0 || editData.progress > 100) {
      setError('Заполни корректно: название и описание обязательны, прогресс 0-100!');
      return;
    }
    updateProject(project.id, editData);
    setIsEditModalOpen(false);
    setError('');
    alert('Проект обновлён!');
  };

  const handleInvite = () => {
    if (!selectedInviteUserId) {
      setError('Выбери пользователя!');
      return;
    }
    inviteUserToTeam(project.id, selectedInviteUserId);
    setSelectedInviteUserId('');
    setError('');
    setIsInviteModalOpen(false);
    alert('Пользователь приглашён!');
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim() || !assignedTo) {
      setError('Заполни название и выбери исполнителя!');
      return;
    }
    addTask(project.id, {
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      status: 'Todo',
      assignedTo,
      createdBy: currentUser.id
    });
    setNewTaskTitle('');
    setNewTaskDesc('');
    setAssignedTo('');
    setError('');
    setIsAddTaskModalOpen(false);
  };

  const handleAddComment = () => {
    if (!commentText.trim()) {
      setError('Введи текст комментария!');
      return;
    }
    addComment(project.id, { userId: currentUser.id, text: commentText.trim(), rating: commentRating });
    setCommentText('');
    setCommentRating(1);
    setError('');
    setIsAddCommentModalOpen(false);
    alert('Комментарий добавлен!');
  };

  // Улучшенный Modal с inline overlay-стилями (position: fixed для корректного наложения)
  const Modal = ({ isOpen, onClose, title, children, onSave }) => {
    if (!isOpen) return null;
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '400px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h4>{title}</h4>
          {children}
          {error && <p className="error">{error}</p>}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              style={{
                padding: '8px 16px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '10px 20px',
          background: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          marginBottom: '20px',
          cursor: 'pointer'
        }}
      >
        ← Назад к проектам
      </button>
      {isOwner && (
        <button
          onClick={() => setIsEditModalOpen(true)}  // Прямой toggle модала
          style={{
            padding: '10px 20px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            marginBottom: '20px',
            cursor: 'pointer'
          }}
        >
          Редактировать проект
        </button>
      )}

      {/* Отображение проекта */}
      <h2>{project.title}</h2>
      <p><strong>Описание:</strong> {project.description}</p>
      <p><strong>Статус:</strong> {project.status || 'Не задан'}</p>
      <p><strong>Прогресс:</strong> {project.progress || 0}%</p>
      <ProgressBar progress={project.progress || 0} />

      {/* Команда */}
      <h3>Команда ({teamMembers.length})</h3>
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginTop: '10px' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {teamMembers.map(member => (
            <li key={member.id} style={{ marginBottom: '5px' }}>
              {member.name} ({member.id === project.ownerId ? 'владелец' : 'участник'})
            </li>
          ))}
        </ul>
        {isOwner && (
          <button
            onClick={() => setIsInviteModalOpen(true)}
            style={{
              padding: '10px 20px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              marginTop: '10px',
              cursor: 'pointer'
            }}
          >
            Пригласить пользователя
          </button>
        )}
      </div>

      {/* Задачи */}
      <h3>Задачи проекта</h3>
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginTop: '10px' }}>
        {['Todo', 'In Progress', 'Done'].map(status => (
          <div key={status} style={{ marginBottom: '20px' }}>
            <h4>{status} ({safeTasks.filter(task => task.status === status).length})</h4>
            {safeTasks.filter(task => task.status === status).map(task => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px',
                  background: '#f9f9f9',
                  borderRadius: '5px',
                  marginBottom: '5px'
                }}
              >
                <div style={{ flex: 1 }}>
                  <p><strong>{task.title}</strong></p>
                  <p>Описание: {task.description || 'Нет'}</p>
                  <p>
                    Назначен: {task.assignedTo === currentUser.id ? 'Тебе' : (teamMembers.find(m => m.id === task.assignedTo)?.name || 'Неизвестный')}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {status !== 'Done' && (
                    <button
                      onClick={() => updateTaskStatus(project.id, task.id, status === 'Todo' ? 'In Progress' : 'Done')}
                      style={{
                        padding: '5px 10px',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      {status === 'Todo' ? 'Начать' : 'Завершить'}
                    </button>
                  )}
                  {status === 'Done' && <span style={{ color: 'green' }}>✔ Готово</span>}
                  {isOwner && (
                    <button
                      onClick={() => removeTask(project.id, task.id)}  // Убрали лишний аргумент
                      style={{
                        padding: '5px 10px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      Удалить
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
        {(isOwner || safeTeam.some(userId => userId === currentUser.id)) && (
          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            style={{
              padding: '10px 20px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              marginTop: '10px',
              cursor: 'pointer'
            }}
          >
            Добавить задачу
          </button>
        )}
      </div>

      {/* Комментарии */}
      <h3>Комментарии и рейтинги ({safeComments.length})</h3>
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginTop: '10px' }}>
        {safeComments.length > 0 ? (
          safeComments.map(comment => (
            <div key={comment.id} style={{ marginBottom: '15px', padding: '10px', background: '#f9f9f9', borderRadius: '5px' }}>
              <p>
                <strong>
                  {comment.userId === currentUser.id ? 'Ты' : (teamMembers.find(m => m.id === comment.userId)?.name || comment.userId)}
                </strong> ({comment.date || new Date().toLocaleDateString()}): {comment.text}
              </p>
              <p>Рейтинг: {'★'.repeat(comment.rating || 1)} ({comment.rating || 1}/5)</p>
            </div>
          ))
        ) : (
          <p>Нет комментариев. Добавь первый!</p>
        )}
        <button
          onClick={() => setIsAddCommentModalOpen(true)}
          style={{
            padding: '10px 20px',
            background: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            marginTop: '20px',
            cursor: 'pointer'
          }}
        >
          Добавить комментарий
        </button>
      </div>

      {/* Модалы */}
      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setError(''); }}
        title="Редактировать проект"
        onSave={handleSaveEditModal}  // Переименованная функция
      >
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="editTitle">Название:</label>
          <input
            id="editTitle"
            type="text"
            value={editData.title}
            onChange={(e) => { setEditData({ ...editData, title: e.target.value }); clearError(); }}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              marginTop: '5px'
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="editDesc">Описание:</label>
          <textarea
            id="editDesc"
            value={editData.description}
            onChange={(e) => { setEditData({ ...editData, description: e.target.value }); clearError(); }}
            rows="3"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              marginTop: '5px'
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="editProgress">Прогресс (%):</label>
          <input
            id="editProgress"
            type="number"
            min="0"
            max="100"
            value={editData.progress}
            onChange={(e) => { setEditData({ ...editData, progress: Number(e.target.value) }); clearError(); }}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              marginTop: '5px'
            }}
          />
        </div>
      </Modal>

      {/* Invite Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => { setIsInviteModalOpen(false); setError(''); setSelectedInviteUserId(''); }}
        title="Пригласить пользователя"
        onSave={handleInvite}
      >
        <select
          value={selectedInviteUserId}
          onChange={(e) => { setSelectedInviteUserId(e.target.value); clearError(); }}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        >
          <option value="">Выбери пользователя...</option>
          {mockUsers
            .filter(user => !safeTeam.includes(user.id) && user.id !== project.ownerId)
            .map(user => (
              <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
            ))}
        </select>
      </Modal>

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddTaskModalOpen}
        onClose={() => { setIsAddTaskModalOpen(false); setError(''); setNewTaskTitle(''); setNewTaskDesc(''); setAssignedTo(''); }}
        title="Добавить задачу"
        onSave={handleAddTask}
      >
        <input
          type="text"
          placeholder="Название задачи"
          value={newTaskTitle}
          onChange={(e) => { setNewTaskTitle(e.target.value); clearError(); }}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginBottom: '10px'
          }}
        />
        <textarea
          placeholder="Описание"
          value={newTaskDesc}
          onChange={(e) => { setNewTaskDesc(e.target.value); clearError(); }}
          rows="3"
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginBottom: '10px'
          }}
        />
        <select
          value={assignedTo}
          onChange={(e) => { setAssignedTo(e.target.value); clearError(); }}
          disabled={teamMembers.length === 0}  // Защита: нельзя выбрать, если команда пуста
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        >
          <option value="">Выбери исполнителя...</option>
          {teamMembers.map(member => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>
      </Modal>

      {/* Add Comment Modal */}
      <Modal
        isOpen={isAddCommentModalOpen}
        onClose={() => { setIsAddCommentModalOpen(false); setError(''); setCommentText(''); setCommentRating(1); }}
        title="Добавить комментарий"
        onSave={handleAddComment}
      >
        <textarea
          value={commentText}
          onChange={(e) => { setCommentText(e.target.value); clearError(); }}
          placeholder="Твой комментарий..."
          rows="3"
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginBottom: '10px'
          }}
        />
        <label>Рейтинг: {commentRating}/5 ★</label>
        <input
          type="range"
          min="1"
          max="5"
          value={commentRating}
          onChange={(e) => { setCommentRating(Number(e.target.value)); clearError(); }}
          style={{ width: '100%', marginBottom: '10px' }}
        />
      </Modal>
    </div>
  );
}

export default ProjectDetail;
