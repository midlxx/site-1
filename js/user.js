let users = [];
let messages = [];

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
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      window.location.href = 'index.html';
      return;
    }

    document.getElementById('userGreeting').textContent = `Добро пожаловать, ${currentUser}!`;
    loadMessages();
    startAutoRefresh();

    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('currentUser');
      window.location.href = 'index.html';
    });
  });
});

async function sendMessage() {
  const targetUser = document.getElementById('targetUser').value.trim();
  const messageText = document.getElementById('userMessage').value.trim();

  if (!targetUser) {
    alert('Введите ник получателя!');
    return;
  }
  if (!messageText) {
    alert('Введите текст сообщения!');
    return;
  }

  // Проверяем существование получателя
  const recipient = users.find(u => u.username === targetUser);
  if (!recipient) {
    alert('Пользователь с таким ником не найден!');
    return;
  }

  const newMessage = {
    id: Date.now(),
    username: currentUser,
    message: messageText,
    timestamp: new Date().toLocaleString(),
    ip: '127.0.0.1',
    isAdmin: false,
    targetUser: targetUser
  };

  messages.push(newMessage);
  await saveData();
  document.getElementById('userMessage').value = '';
  loadMessages();
}

function loadMessages() {
  const messageList = document.getElementById('messageList');
  if (!messageList) {
    console.error('Элемент #messageList не найден');
    return;
  }

  messageList.innerHTML = '';

  const currentUser = localStorage.getItem('currentUser');
  const userMessages = messages.filter(m =>
    (m.username === currentUser) ||
    (m.targetUser === currentUser)
  );

  userMessages.forEach(msg => {
    const messageEl = document.createElement('div');
    messageEl.className = msg.isAdmin ? 'message admin-message' : 'message user-message';
    messageEl.innerHTML = `
      <strong>${msg.isAdmin ? 'Администратор' : msg.username}</strong>
      <span>${msg.timestamp}</span>
      ${msg.ip ? `<small>IP: ${msg.ip}</small>` : ''}
      <p>${msg.message}</p>
      <small>Кому: ${msg.targetUser}</small>
    `;
    messageList.appendChild(messageEl);
  });

  // Прокручиваем вниз к последнему сообщению
  messageList.scrollTop = messageList.scrollHeight;
}

function startAutoRefresh() {
  setInterval(async () => {
    await loadData();
    loadMessages();
  }, 5000); // Каждые 5 секунд проверяем обновления
}
