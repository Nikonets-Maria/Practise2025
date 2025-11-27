// src/data/mockData.js
export const mockUsers = [
  { id: '1', email: 'user@example.com', password: 'password123', name: 'Admin One', role: 'admin' },  // Хардкод для теста админа + логин
  { id: '2', email: 'user2@example.com', password: 'password123', name: 'Student Two', role: 'student' },  // Хардкод для теста студента
  { id: '3', email: 'user3@example.com', password: 'password123', name: 'Teacher Three', role: 'teacher' },  // Хардкод для теста учителя (может создавать проекты)
  { id: '4', email: 'student@example.com', password: 'password123', name: 'Student One', role: 'student' },

];

export const mockProjects = [
  {
    id: '1',
    title: 'Проект A',
    description: 'Описание проекта A',
    ownerId: '3',  // Установим teacher (id '3') как владельца — ролевая логика
    team: ['2'],  // Студент в команде
    status: 'В работе',  // Добавлено для consistency (из AppContext дефолт)
    progress: 0,  // Добавлено
    comments: [],  // Добавлено пустой массив
    createdAt: new Date().toISOString(),  // Добавлено
    tasks: [  // Tasks оставлены, но унифицированы ID
      {
        id: 'task1',
        title: 'Создать дизайны',
        description: 'Нарисовать макеты для нового UI',
        status: 'Todo',
        assignedTo: '2',  // Студент
        createdBy: '3'  // Teacher
      },
      {
        id: 'task2',
        title: 'Реализовать бэкенд',
        description: 'Написать API для задач',
        status: 'In Progress',
        assignedTo: '3',  // Teacher
        createdBy: '3'
      }
    ]
  },
  {
    id: '2',
    title: 'Образовательный чат-бот',
    description: 'Разработка бота для помощи в учебе, команда из 4 студентов.',
    ownerId: '3',
    team: ['1', '2'],  // Включая админа для теста
    status: 'Завершён',
    progress: 100,
    comments: [
      { id: 'c2', userId: '3', text: 'Готово!', rating: 4, date: new Date().toISOString().split('T')[0] }  // Убрал .toISOString() в date, оставил как string
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),  // Вчера
    tasks: [  // Tasks унифицированы (примерные, разнообразим немного)
      {
        id: 'task2_1',
        title: 'Проектирование диалогов',
        description: 'Создать сценарии разговоров для чат-бота',
        status: 'Done',
        assignedTo: '2',
        createdBy: '3'
      },
      {
        id: 'task2_2',
        title: 'Интеграция с AI',
        description: 'Настроить подключение к модели ИИ',
        status: 'In Progress',
        assignedTo: '3',
        createdBy: '3'
      }
    ]
  },
  {
    id: '3',
    title: 'Игра на JavaScript',  // Исправлено: убраны заглушки, сделано осмысленным
    description: 'Разработка простой веб-игры с командой из одного студента.',
    ownerId: '3',
    team: ['3'],  // IDs участников
    status: 'Завершён',
    progress: 100,
    comments: [
      { id: 'c1', userId: '3', text: 'Вау', rating: 5, date: new Date().toISOString().split('T')[0] }
    ],
    createdAt: new Date().toISOString(),
    tasks: [  // Tasks разнообразим немного
      {
        id: 'task3_1',
        title: 'Графика и анимации',
        description: 'Создать спрайты и анимации персонажей',
        status: 'Done',
        assignedTo: '3',
        createdBy: '3'
      },
      {
        id: 'task3_2',
        title: 'Звуки и эффекты',
        description: 'Добавить звуковые эффекты и музыку',
        status: 'Todo',
        assignedTo: '3',
        createdBy: '3'
      }
    ]
  },
];
export const getMockUsers = () => {
  const stored = localStorage.getItem('mockUsers');
  return stored ? JSON.parse(stored) : mockUsers;
};

export const saveMockUsers = (users) => {
  localStorage.setItem('mockUsers', JSON.stringify(users));
};

export const getProjects = () => {
  const stored = localStorage.getItem('projects');
  return stored ? JSON.parse(stored) : mockProjects;
};

export const saveProjects = (projects) => {
  localStorage.setItem('projects', JSON.stringify(projects));
};
