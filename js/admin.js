let selectedUser = null;

document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('currentUser') !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    loadUsers();

    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
});

function loadUsers() {
    const usersList = document.getElementById('usersList');
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

    document.querySelectorAll('.user-item').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');

    const chatArea = document.getElementById('chatArea');
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

    document.getElementById('adminSendBtn').addEventListener('click', sendAdminMessage);
}

function sendAdminMessage() {
    if (!selectedUser) return;

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
