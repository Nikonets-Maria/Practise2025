import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { mockUsers } from '../data/mockData';

function ProjectDetail() {
  const { id } = useParams();
  const { projects, currentUser, updateProject, addComment, addTask, updateTaskStatus, removeTask, inviteUserToTeam } = useAppContext();
  const project = projects.find(p => p.id === id);
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAddCommentModalOpen, setIsAddCommentModalOpen] = useState(false);
  
  const [selectedInviteUserId, setSelectedInviteUserId] = useState('');
  const [editData, setEditData] = useState({ 
    title: project?.title || '', 
    description: project?.description || '', 
    progress: project?.progress || 0 
  });
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentRating, setCommentRating] = useState(1);
  const [error, setError] = useState('');

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
    <div className="progress-bar-container">
      <div
        className="progress-bar-fill"
        style={{
          width: `${progress}%`,
          background: progress > 50 ? '#4caf50' : progress > 20 ? '#ff9800' : '#f44336',
        }}
      />
    </div>
  );

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
    addComment(project.id, {
      userId: currentUser.id,
      text: commentText.trim(),
      rating: commentRating
    });
    setCommentText('');
    setCommentRating(1);
    setError('');
    setIsAddCommentModalOpen(false);
    alert('Комментарий добавлен!');
  };

  const Modal = ({ isOpen, onClose, title, children, onSave }) => {
    if (!isOpen) return null;
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h4>{title}</h4>
          {children}
          {error && <p className="error">{error}</p>}
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={onSave}>Save</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="project-detail">
      <button className="btn btn-secondary" onClick={() => navigate('/')}>
        ← Назад к проектам
      </button>
      
      {isOwner && (
        <button className="btn btn-success" onClick={() => setIsEditModalOpen(true)}>
          Редактировать проект
        </button>
      )}

      <h2>{project.title}</h2>
      <p><strong>Описание:</strong> {project.description}</p>
      <p><strong>Статус:</strong> {project.status || 'Не задан'}</p>
      <p><strong>Прогресс:</strong> {project.progress || 0}%</p>
      <ProgressBar progress={project.progress || 0} />

      <h3>Команда ({teamMembers.length})</h3>
      <div className="section-card">
        <ul className="list-unstyled">
          {teamMembers.map(member => (
            <li key={member.id} className="member-item">
              {member.name} ({member.id === project.ownerId ? 'владелец' : 'участник'})
            </li>
          ))}
        </ul>
        {isOwner && (
          <button className="btn btn-success" onClick={() => setIsInviteModalOpen(true)}>
            Пригласить пользователя
          </button>
        )}
      </div>

      <h3>Задачи проекта</h3>
      <div className="section-card">
        {['Todo', 'In Progress', 'Done'].map(status => (
          <div key={status} className="task-section">
            <h4>{status} ({safeTasks.filter(task => task.status === status).length})</h4>
            {safeTasks.filter(task => task.status === status).map(task => (
              <div key={task.id} className="task-card">
                <div className="task-info">
                  <p><strong>{task.title}</strong></p>
                  <p>Описание: {task.description || 'Нет'}</p>
                  <p>Назначен: {task.assignedTo === currentUser.id ? 'Тебе' : (teamMembers.find(m => m.id === task.assignedTo)?.name || 'Неизвестный')}</p>
                </div>
                <div className="task-actions">
                  {status !== 'Done' && (
                    <button 
                      className="btn btn-success btn-small" 
                      onClick={() => updateTaskStatus(project.id, task.id, status === 'Todo' ? 'In Progress' : 'Done')}
                    >
                      {status === 'Todo' ? 'Начать' : 'Завершить'}
                    </button>
                  )}
                  {status === 'Done' && <span className="text-success">✔ Готово</span>}
                  {isOwner && (
                    <button 
                      className="btn btn-danger btn-small" 
                      onClick={() => removeTask(project.id, task.id)} 
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
          <button className="btn btn-primary" onClick={() => setIsAddTaskModalOpen(true)}>
            Добавить задачу
          </button>
        )}
      </div>

      <h3>Комментарии и рейтинги ({safeComments.length})</h3>
      <div className="section-card">
        {safeComments.length > 0 ? (
          safeComments.map(comment => (
            <div key={comment.id} className="comment-card">
              <p>
                <strong>{comment.userId === currentUser.id ? 'Ты' : (teamMembers.find(m => m.id === comment.userId)?.name || comment.userId)}</strong> 
                ({comment.date || new Date().toLocaleDateString()}): {comment.text}
              </p>
              <p>Рейтинг: {'★'.repeat(comment.rating || 1)} ({comment.rating || 1}/5)</p>
            </div>
          ))
        ) : (
          <p>Нет комментариев. Добавь первый!</p>
        )}
        <button className="btn btn-info" onClick={() => setIsAddCommentModalOpen(true)}>
          Добавить комментарий
        </button>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setError(''); }}
        title="Редактировать проект"
        onSave={handleSaveEditModal}
      >
        <label htmlFor="editTitle">Название:</label>
        <input
          id="editTitle"
          type="text"
          value={editData.title}
          onChange={(e) => { setEditData({ ...editData, title: e.target.value }); clearError(); }}
          className="form-input"
        />
        <label htmlFor="editDesc">Описание:</label>
        <textarea
          id="editDesc"
          value={editData.description}
          onChange={(e) => { setEditData({ ...editData, description: e.target.value }); clearError(); }}
          rows="3"
          className="form-input"
        />
        <label htmlFor="editProgress">Прогресс (%):</label>
        <input
          id="editProgress"
          type="number"
          min="0"
          max="100"
          value={editData.progress}
          onChange={(e) => { setEditData({ ...editData, progress: Number(e.target.value) }); clearError(); }}
          className="form-input"
        />
      </Modal>

      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => { setIsInviteModalOpen(false); setError(''); setSelectedInviteUserId(''); }}
        title="Пригласить пользователя"
        onSave={handleInvite}
      >
        <select
          value={selectedInviteUserId}
          onChange={(e) => { setSelectedInviteUserId(e.target.value); clearError(); }}
          className="form-select"
        >
          <option value="">Выбери пользователя...</option>
          {mockUsers
            .filter(user => !safeTeam.includes(user.id) && user.id !== project.ownerId)
            .map(user => (
              <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
            ))}
        </select>
      </Modal>

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
          className="form-input"
        />
        <textarea
          placeholder="Описание"
          value={newTaskDesc}
          onChange={(e) => { setNewTaskDesc(e.target.value); clearError(); }}
          rows="3"
          className="form-input"
        />
        <select
          value={assignedTo}
          onChange={(e) => { setAssignedTo(e.target.value); clearError(); }}
          disabled={teamMembers.length === 0}
          className="form-select"
        >
          <option value="">Выбери исполнителя...</option>
          {teamMembers.map(member => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>
      </Modal>

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
          className="form-input"
        />
        <label>Рейтинг: {commentRating}/5 ★</label>
        <input
          type="range"
          min="1"
          max="5"
          value={commentRating}
          onChange={(e) => { setCommentRating(Number(e.target.value)); clearError(); }}
          className="form-range"
        />
      </Modal>
    </div>
  );
}

export default ProjectDetail;
