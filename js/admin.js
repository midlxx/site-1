// Инициализация данных — однократно в начале файла
let users = JSON.parse(localStorage.getItem('users')) || [];
let messages = JSON.parse(localStorage.getItem('messages')) || [];

let selectedUser = null; // Единственное объявление переменной

function saveData() {
    localStorage.setItem('messages', JSON.stringify(messages));
}

document.addEventListener('DOMContentLoaded', function() {
    // Проверка авторизации
    if (localStorage.getItem('currentUser') !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    // Инициализация интерфейса
    initializeAdminPanel();

    // Обработчик выхода
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
    if (!usersList) return;

    usersList.innerHTML = '';

    const uniqueUsers = [...new Set(messages.filter(m => m.username !== 'admin').map(m => m.username))];

    uniqueUsers.forEach(username => {
        const userEl = document.createElement('div');
        userEl.className = 'user-item';
        userEl.textContent = username;
        userEl.addEventListener('click', () => selectUser(username));
        usersList.appendChild(userEl);
    });
}

function selectUser(username) {
    selectedUser = username;

    // Обновляем визуальное состояние списка пользователей
    document.querySelectorAll('.user-item').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');

    // Загружаем диалог с выбранным пользователем
    loadConversation(username);
}

function loadConversation(username) {
    const adminMessageList = document.getElementById('adminMessageList');
    if (!adminMessageList) return;

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

    // Обновляем интерфейс чата
    updateChatInterface(username);
}

function updateChatInterface(username) {
    const chatArea = document.getElementById('chatArea');
    if (!chatArea) return;

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

    // Перепривязываем обработчик отправки после пересоздания элементов
    document.getElementById('adminSendBtn').addEventListener('click', sendAdminMessage);
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

    // Удаляем все сообщения диалога
    messages = messages.filter(m =>
        !(m.username === selectedUser && m.targetUser === 'admin') &&
        !(m.username === 'admin' && m.targetUser === selectedUser)
    );
    saveData();

    // Обновляем список пользователей и очищаем область чата
    loadUsers();
    selectedUser = null;
    const chatArea = document.getElementById('chatArea');
    if (chatArea) {
        chatArea.innerHTML = '<div class="no-selection">Выберите пользователя для начала диалога</div>';
    }
}
