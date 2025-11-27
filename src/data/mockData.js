// src/data/mockData.js
export const mockUsers = [
  { id: '1', email: 'user@example.com', password: 'password123', name: 'Student One' },  // Хардкод для теста логина
  { id: '2', email: 'user2@example.com', password: 'password123', name: 'Student Two' },  // Хардкод для теста логина
  { id: '3', email: 'user3@example.com', password: 'password123', name: 'Student Three' },  // Исправлено: "Tree" -> "Three"
];

export const mockProjects = [
  {
    id: '1',
    title: 'Проект A',
    description: 'Описание проекта A',
    ownerId: '1',  // Исправлено: "user1" -> '1' (из mockUsers)
    team: ['2'],  // Исправлено: был массив объектов [{ id: "user2", ... }] -> массив ID ['2']
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
        assignedTo: '2',  // Исправлено: "user2" -> '2'
        createdBy: '1'  // Исправлено: "user1" -> '1'
      },
      {
        id: 'task2',
        title: 'Реализовать бэкенд',
        description: 'Написать API для задач',
        status: 'In Progress',
        assignedTo: '1',
        createdBy: '1'
      }
    ]
  },
  {
    id: '2',
    title: 'Образовательный чат-бот',
    description: 'Разработка бота для помощи в учебе, команда из 4 студентов.',
    ownerId: '1',
    team: ['1', '2'],  // Уже массив ID
    status: 'Завершён',
    progress: 100,
    comments: [
      { id: 'c2', userId: '1', text: 'Готово!', rating: 4, date: new Date().toISOString().split('T')[0] }  // Убрал .toISOString() в date, оставил как string
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),  // Вчера
    tasks: [  // Tasks унифицированы (примерные, разнообразим немного)
      {
        id: 'task2_1',
        title: 'Проектирование диалогов',
        description: 'Создать сценарии разговоров для чат-бота',
        status: 'Done',
        assignedTo: '2',
        createdBy: '1'
      },
      {
        id: 'task2_2',
        title: 'Интеграция с AI',
        description: 'Настроить подключение к модели ИИ',
        status: 'In Progress',
        assignedTo: '1',
        createdBy: '1'
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
      { id: 'c1', userId: '1', text: 'Вау', rating: 5, date: new Date().toISOString().split('T')[0] }
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