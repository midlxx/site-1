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
  );

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
  if (!selectedUser) return;

  selectedUser = null;
  const chatArea = document.getElementById('chatArea');
  if (chatArea) {
    chatArea.innerHTML = '<div class="no-selection">Выберите пользователя для начала диалога</div>';
  }
  loadUsers();
}

// Автообновление списка пользователей и сообщений каждые 5 секунд
function startAutoRefresh() {
  setInterval(async () => {
    await loadData();
    loadUsers();
    if (selectedUser) {
      loadConversation(selectedUser);
    }
  }, 5000);
}
