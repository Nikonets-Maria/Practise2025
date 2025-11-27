// src/data/mockData.js

export const mockUsers = [
  { id: '1', email: 'user@example.com', password: 'password123', name: 'Admin One', role: 'admin' },
  { id: '2', email: 'user2@example.com', password: 'password123', name: 'Student Two', role: 'student' },
  { id: '3', email: 'user3@example.com', password: 'password123', name: 'Teacher Three', role: 'teacher' },
  { id: '4', email: 'student@example.com', password: 'password123', name: 'New Student', role: 'student' },  // Added new student
];

export const mockProjects = [
  {
    id: '1',
    title: 'Проект A',
    description: 'Описание проекта A',
    ownerId: '3',
    team: ['2'],
    status: 'В работе',
    progress: 0,
    comments: [],
    createdAt: new Date().toISOString(),
    tasks: [
      { id: 'task1', title: 'Создать дизайны', description: 'Нарисовать макеты для нового UI', status: 'Todo', assignedTo: '2', createdBy: '3' },
      { id: 'task2', title: 'Реализовать бэкенд', description: 'Написать API для задач', status: 'In Progress', assignedTo: '3', createdBy: '3' },
    ],
  },
  {
    id: '2',
    title: 'Образовательный чат-бот',
    description: 'Разработка бота для помощи в учебе, команда из 4 студентов.',
    ownerId: '3',
    team: ['1', '2'],
    status: 'Завершён',
    progress: 100,
    comments: [{ id: 'c2', userId: '3', text: 'Готово!', rating: 4, date: new Date().toISOString().split('T')[0] }],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    tasks: [
      { id: 'task2_1', title: 'Проектирование диалогов', description: 'Создать сценарии разговоров для чат-бота', status: 'Done', assignedTo: '2', createdBy: '3' },
      { id: 'task2_2', title: 'Интеграция с AI', description: 'Настроить подключение к модели ИИ', status: 'In Progress', assignedTo: '3', createdBy: '3' },
    ],
  },
  {
    id: '3',
    title: 'Игра на JavaScript',
    description: 'Разработка простой веб-игры с командой из одного студента.',
    ownerId: '3',
    team: ['3'],
    status: 'Завершён',
    progress: 100,
    comments: [{ id: 'c1', userId: '3', text: 'Вау', rating: 5, date: new Date().toISOString().split('T')[0] }],
    createdAt: new Date().toISOString(),
    tasks: [
      { id: 'task3_1', title: 'Графика и анимации', description: 'Создать спрайты и анимации персонажей', status: 'Done', assignedTo: '3', createdBy: '3' },
      { id: 'task3_2', title: 'Звуки и эффекты', description: 'Добавить звуковые эффекты и музыку', status: 'Todo', assignedTo: '3', createdBy: '3' },
    ],
  },
];

// FUNCTION: getMockUsers (Safe Loader)

export const getMockUsers = () => {
  try {
    const stored = localStorage.getItem('mockUsers');
    if (stored && stored !== 'undefined' && stored !== 'null') {
      const parsed = JSON.parse(stored);

      const unique = parsed.filter((user, index, arr) => arr.findIndex(u => u.id === user.id) === index);
      if (unique.length !== parsed.length) {
        console.warn('Removed duplicate user IDs from localStorage.');
        saveMockUsers(unique);  
      }
      return unique;
    }
  } catch (e) {
    console.error('Error loading users from localStorage:', e);
  }

  localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
  return mockUsers;
};

// FUNCTION: saveMockUsers (Safe Saver)

export const saveMockUsers = (users) => {
  try {
    localStorage.setItem('mockUsers', JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users to localStorage:', e);
  }
};

// FUNCTION: getProjects (Safe Loader)

export const getProjects = () => {
  try {
    const stored = localStorage.getItem('projects');
    if (stored && stored !== 'undefined' && stored !== 'null') {
      const parsed = JSON.parse(stored);

      const unique = parsed.filter((project, index, arr) => arr.findIndex(p => p.id === project.id) === index);
      if (unique.length !== parsed.length) {
        console.warn('Removed duplicate project IDs from localStorage.');
        saveProjects(unique); 
        
      }
      return unique;
    }
  } catch (e) {
    console.error('Error loading projects from localStorage:', e);
  }

  localStorage.setItem('projects', JSON.stringify(mockProjects));
  return mockProjects;
};

// FUNCTION: saveProjects (Safe Saver)
export const saveProjects = (projects) => {
  try {
    localStorage.setItem('projects', JSON.stringify(projects));
  } catch (e) {
    console.error('Error saving projects to localStorage:', e);
  }
};
