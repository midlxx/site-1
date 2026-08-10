let users = [];
let messages = [];
let selectedUser = null;

async function loadData() {
  try {
    const response = await fetch('data.json');
    const serverData = await response.json();
    window.users = serverData.users || [];
    window.messages = serverData.messages || [];
    users = window.users;
    messages = window.messages;
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    users = [];
    messages = [];
  }
}

async function saveData() {
  const data = { users: window.users, messages: window.messages };
  console.warn('Сохранение на облачный диск требует API‑доступа');
}

document.addEventListener('DOMContentLoaded', function() {
  loadData().then(() => {
    if (localStorage.getItem('currentUser') !== 'admin') {
      window.location.href = 'index.html';
      return;
    }

    initializeAdminPanel();

    document.getElementById('logoutLink').addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('currentUser');
      window.location.href = 'index.html';
    });
  });
});

function initializeAdminPanel() {
  loadUsers();
  startAutoRefresh();
}

function searchUser() {
  const searchTerm = document.getElementById('searchUser').value.trim().toLowerCase();
  loadUsers(searchTerm);
}

function loadUsers(searchTerm = '') {
  const usersList = document.getElementById('usersList');
  if (!usersList) {
    console.error('Элемент #usersList не найден');
    return;
  }
  function loadUsers(searchTerm = '') {
  const usersList = document.getElementById('usersList');
  if (!usersList) {
    console.error('Элемент #usersList не найден');
    return;
  }

  usersList.innerHTML = '';

  // Получаем всех пользователей из сообщений (исключая админа)
  const uniqueUsers = [...new Set(messages
    .filter(m => m.username !== 'admin' && m.targetUser !== 'admin')
    .map(m => m.username)
  )];

  // Фильтруем по поисковому запросу, если он есть
  const filteredUsers = searchTerm
    ? uniqueUsers.filter(username =>
        username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : uniqueUsers;

  filteredUsers.forEach(username => {
    const userEl = document.createElement('div');
    userEl.className = 'user-item';
    userEl.textContent = username;
    userEl.addEventListener('click', (e) => selectUser(username, e));
    usersList.appendChild(userEl);
  });

  if (filteredUsers.length === 0) {
    const noResults = document.createElement('div');
    noResults.textContent = 'Пользователи не найдены';
    noResults.style.padding = '15px';
    noResults.style.color = '#666';
    usersList.appendChild(noResults);
  }
}

function selectUser(username, event) {
  selectedUser = username;

  document.querySelectorAll('.user-item').forEach(el => el.classList.remove('active'));
  event.currentTarget.classList.add('active');

  updateChatInterface(username);
}

function updateChatInterface(username) {
  const chatArea = document.getElementById('chatArea');
  if (!chatArea) {
    console.error('Элемент #chatArea не найден');
    return;
  }

  chatArea.innerHTML = `
    <div class="header">
      <h2>Диалог с ${username}</h2>
      <button class="close-dialog" onclick="closeDialog()">Закрыть диалог</button>
    </div>
    <div class="message-list" id="adminMessageList"></div>
    <div class="message-input">
      <textarea id="adminMessage" placeholder="Ответьте пользователю..." rows="3"></textarea>
      <button id="adminSendBtn">Отправить</button>
    </div>`;

  loadConversation(username);

  // Перепривязываем обработчик отправки после пересоздания элементов
  const sendBtn = document.getElementById('adminSendBtn');
  if (sendBtn) {
    sendBtn.removeEventListener('click', sendAdminMessage);
    sendBtn.addEventListener('click', sendAdminMessage);
  }
}

function loadConversation(username) {
  const adminMessageList = document.getElementById('adminMessageList');
  if (!adminMessageList) {
    console.error('Элемент #adminMessageList не найден');
    return;
  }

  adminMessageList.innerHTML = '';

  const conversation = messages.filter(m =>
    (m.username === username && m.targetUser === 'admin') ||
    (m.username === 'admin' && m.targetUser === username)
  ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  conversation.forEach(msg => {
    const messageEl = document.createElement('div');
    messageEl.className = msg.isAdmin ? 'message admin-message' : 'message user-message';
    messageEl.innerHTML = `
      <strong>${msg.isAdmin ? 'Администратор' : msg.username}</strong>
      <span>${msg.timestamp}</span>
      ${msg.ip ? `<small>IP: ${msg.ip}</small>` : ''}
      <p>${msg.message}</p>
    `;
    adminMessageList.appendChild(messageEl);
  });

  // Прокручиваем вниз к последнему сообщению
  adminMessageList.scrollTop = adminMessageList.scrollHeight;
}

async function sendAdminMessage() {
  if (!selectedUser) {
    alert('Сначала выберите пользователя!');
    return;
  }

  const messageText = document.getElementById('adminMessage').value.trim();
  if (!messageText) {
    alert('Введите текст ответа!');
    return;
  }

  const newMessage = {
    id: Date.now(),
    username: 'admin',
    message: messageText,
    timestamp: new Date().toLocaleString(),
    ip: '127.0.0.1',
    isAdmin: true,
    targetUser: selectedUser
  };

  messages.push(newMessage);
  await saveData();
  document.getElementById('adminMessage').value = '';
  loadConversation(selectedUser);
}

function closeDialog() {
  selectedUser = null;
  const chatArea = document.getElementById('chatArea');
  if (chatArea) {
    chatArea.innerHTML = '<div class="no-selection">Выберите пользователя для начала диалога</div>';
  }
  loadUsers();
}

function startAutoRefresh() {
  setInterval(async () => {
    await loadData();
    loadUsers();
    if (selectedUser) {
      loadConversation(selectedUser);
    }
  }, 5000); // Каждые 5 секунд проверяем обновления
}
