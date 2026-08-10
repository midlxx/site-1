let users = [];
let tickets = [];
let selectedTicket = null;

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
  loadTickets();
  startAutoRefresh();
}

function loadTickets() {
  const ticketsList = document.getElementById('ticketsList');
  if (!ticketsList) {
    console.error('Элемент #ticketsList не найден');
    return;
  }

  ticketsList.innerHTML = '';

  tickets.forEach(ticket => {
    const ticketEl = document.createElement('div');
    ticketEl.className = 'ticket';
    ticketEl.innerHTML = `
      <div class="ticket-header">
        <span>${ticket.username}</span>
        <span class="status-${ticket.status}">${ticket.status}</span>
      </div>
      <small>Создан: ${ticket.createdAt}</small>
    `;
    ticketEl.addEventListener('click', () => selectTicket(ticket.id));
    ticketsList.appendChild(ticketEl);
  });
}

function selectTicket(ticketId) {
  selectedTicket = tickets.find(t => t.id === ticketId);

  document.querySelectorAll('.ticket').forEach(el => el.classList.remove('active'));
  event.currentTarget.classList.add('active');

  updateTicketInterface(selectedTicket);
}

function updateTicketInterface(ticket) {
  const ticketArea = document.getElementById('ticketArea');
  if (!ticketArea) {
    console.error('Элемент #ticketArea не найден');
    return;
  }

  ticketArea.innerHTML = `
    <div class="header">
      <div>
        <h2>Тикет пользователя: ${ticket.username}</h2>
        <small>Статус: <span class="status-${ticket.status}">${ticket.status}</span></small>
      </div>
      <button class="close-dialog" onclick="closeTicket()">Закрыть тикет</button>
    </div>
    <div class="message-list" id="adminMessageList"></div>
    <div class="message-input">
      <textarea id="adminMessage" placeholder="Ответьте пользователю..." rows="3"></textarea>
      <button id="adminSendBtn">Отправить</button>
    </div>`;

  loadTicketMessages(ticket);

  // Перепривязываем обработчик отправки после пересоздания элементов
  const sendBtn = document.getElementById('adminSendBtn');
  if (sendBtn) {
    sendBtn.removeEventListener('click', sendAdminMessage);
    sendBtn.addEventListener('click', sendAdminMessage);
  }
}

function loadTicketMessages(ticket) {
  const adminMessageList = document.getElementById('adminMessageList');
  if (!adminMessageList) {
    console.error('Элемент #adminMessageList не найден');
    return;
  }

  adminMessageList.innerHTML = '';

  ticket.messages.forEach(msg => {
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
  if (!selectedTicket) {
    alert('Сначала выберите тикет!');
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
    isAdmin: true
  };

  selectedTicket.messages.push(newMessage);
  await saveData();
  document.getElementById('adminMessage').value = '';
  loadTicketMessages(selectedTicket);
}

function closeTicket() {
  if (!selectedTicket) return;

  selectedTicket.status = 'closed';
  saveData();

  const ticketArea = document.getElementById('ticketArea');
  if (ticketArea) {
    ticketArea.innerHTML = '<div class="no-selection">Выберите тикет для просмотра</div>';
  }
  selectedTicket = null;
  loadTickets();
}

function startAutoRefresh() {
  setInterval(async () => {
    await loadData();
    loadTickets();
    if (selectedTicket) {
      loadTicketMessages(selectedTicket);
    }
  }, 5000); // Каждые 5 секунд проверяем обновления
}
