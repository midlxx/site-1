// Инициализация данных
let users = JSON.parse(localStorage.getItem('users')) || [];
let messages = JSON.parse(localStorage.getItem('messages')) || [];

let selectedUser = null;

function saveData() {
    localStorage.setItem('messages', JSON.stringify(messages));
}

document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('currentUser') !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    initializeAdminPanel();

    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
});

function initializeAdminPanel() {
    loadUsers();
}

function loadUsers() {
    const usersList = document.getElementById('usersList');
    if (!usersList) {
        console.error('Элемент #usersList не найден');
        return;
    }

    usersList.innerHTML = '';

    const uniqueUsers = [...new Set(messages.filter(m => m.username !== 'admin').map(m => m.username))];

    uniqueUsers.forEach(username => {
        const userEl = document.createElement('div');
        userEl.className = 'user-item';
        userEl.textContent = username;
        userEl.addEventListener('click', (e) => selectUser(username, e));
        usersList.appendChild(userEl);
    });
}

function selectUser(username, event) {
    // Обновляем состояние
    selectedUser = username;

    // Визуальное выделение
    document.querySelectorAll('.user-item').forEach(el => el.classList.remove('active'));
    event.currentTarget.classList.add('active');

    console.log('Выбран пользователь:', username);

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

    // Перепривязываем обработчик отправки после пересоздания элементов
    const sendBtn = document.getElementById('adminSendBtn');
    if (sendBtn) {
        sendBtn.removeEventListener('click', sendAdminMessage);
        sendBtn.addEventListener('click', sendAdminMessage);
    }
}

function sendAdminMessage() {
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
    saveData();
    document.getElementById('adminMessage').value = '';
    loadConversation(selectedUser);
}

function closeDialog() {
    if (!selectedUser) return;

    messages = messages.filter(m =>
        !(m.username === selectedUser && m.targetUser === 'admin') &&
        !(m.username === 'admin' && m.targetUser === selectedUser)
    );
    saveData();

    loadUsers();
    selectedUser = null;
    const chatArea = document.getElementById('chatArea');
    if (chatArea) {
        chatArea.innerHTML = '<div class="no-selection">Выберите пользователя для начала диалога</div>';
    }
}
