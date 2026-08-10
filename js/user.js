let users = [];
let tickets = [];

async function loadData() {
  try {
    const response = await fetch('data.json');
    const serverData = await response.json();
    window.users = serverData.users || [];
    window.tickets = serverData.tickets || [];
    users = window.users;
    tickets = window.tickets;
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    users = [];
    tickets = [];
  }
}

async function saveData() {
  const data = { users: window.users, tickets: window.tickets };
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
    loadTicket();
    startAutoRefresh();

    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('currentUser');
      window.location.href = 'index.html';
    });
  });
});

function getCurrentTicket() {
  // Находим тикет пользователя (создаём, если не существует)
  let ticket = tickets.find(t => t.username === currentUser);
  if (!ticket) {
    ticket = {
      id: Date.now(),
      username: currentUser,
      status: 'open',
      messages: [],
      createdAt: new Date().toLocaleString()
    };
    tickets.push(ticket);
    saveData();
  }
  return ticket;
}

function loadTicket() {
  const messageList = document.getElementById('messageList');
  if (!messageList) {
    console.error('Элемент #messageList не найден');
    return;
  }

  messageList.innerHTML = '';

  const ticket = getCurrentTicket();

  ticket.messages.forEach(msg => {
    const messageEl = document.createElement('div');
    messageEl.className = msg.isAdmin ? 'message admin-message' : 'message user-message';
    messageEl.innerHTML = `
      <strong>${msg.isAdmin ? 'Администратор' : msg.username}</strong>
      <span>${msg.timestamp}</span>
      ${msg.ip ? `<small>IP: ${msg.ip}</small>` : ''}
      <p>${msg.message}</p>
    `;
    messageList.appendChild(messageEl);
  });

  // Прокручиваем вниз к последнему сообщению
  messageList.scrollTop = messageList.scrollHeight;
}

async function sendMessage() {
  const messageText = document.getElementById('userMessage').value.trim();
  if (!messageText) {
    alert('Введите текст сообщения!');
    return;
  }

  const ticket = getCurrentTicket();
  const newMessage = {
    id: Date.now(),
    username: currentUser,
    message: messageText,
    timestamp: new Date().toLocaleString(),
    ip: '127.0.0.1',
    isAdmin: false
  };

  ticket.messages.push(newMessage);
  await saveData();
  document.getElementById('userMessage').value = '';
  loadTicket();
}

function startAutoRefresh() {
  setInterval(async () => {
    await loadData();
    loadTicket();
  }, 5000); // Каждые 5 секунд проверяем обновления
}
