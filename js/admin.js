document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('currentUser') !== 'admin') {
        window.location.href = 'index.html';
        return;
    }
    
    loadUsers();
    loadConversations();
    
    // Выход
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
});

function loadUsers() {
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = '';
    
    const uniqueUsers = [...new Set(messages.map(m => m.username))];
    uniqueUsers.forEach(username => {
        const userEl = document.createElement('div');
        userEl.className = 'user-item';
        userEl.textContent = username;
        userEl.addEventListener('click', () => selectUser(username));
        usersList.appendChild(userEl);
    });
}

function selectUser(username) {
    document.querySelectorAll('.user-item').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');
    
    const chatArea = document.getElementById('chatArea');
    chatArea.innerHTML = `
        <div class="header">
            <h2>Диалог с ${username}</h2>
            <button class="close-dialog" onclick="closeDialog('${username}')">Закрыть диалог</button>
        </div>
        <div class="message-list" id="adminMessageList"></div>
        <div class="message-input">
            <textarea id="adminMessage" placeholder="Ответьте пользователю..." rows="3"></textarea>
            <button id="adminSendBtn">Отправить</button>
        </div>

function selectUser(username) {
    document.querySelectorAll('.user-item').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');

    const chatArea = document.getElementById('chatArea');
    chatArea.innerHTML = `
        <div class="header">
            <h2>Диалог с ${username}</h2>
            <button class="close-dialog" onclick="closeDialog('${username}')">Закрыть диалог</button>
        </div>
        <div class="message-list" id="adminMessageList"></div>
        <div class="message-input">
            <textarea id="adminMessage" placeholder="Ответьте пользователю..." rows="3"></textarea>
            <button id="adminSendBtn">Отправить</button>
        </div>`;

    loadConversation(username);

    // Обработчик отправки сообщения от администратора
    document.getElementById('adminSendBtn').addEventListener('click', function() {
        const messageText = document.getElementById('adminMessage').value.trim();
        if (!messageText) return;

        const newMessage = {
            id: Date.now(),
            username: 'admin',
            message: messageText,
            timestamp: new Date().toLocaleString(),
            ip: '127.0.0.1', // В реальном приложении получите реальный IP
            isAdmin: true,
            targetUser: username
        };

        messages.push(newMessage);
        saveData();
        document.getElementById('adminMessage').value = '';
        loadConversation(username);
    });
}

function loadConversation(username) {
    const adminMessageList = document.getElementById('adminMessageList');
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
}

function closeDialog(username) {
    // Удаляем все сообщения диалога
    messages = messages.filter(m =>
        !(m.username === username || m.targetUser === username) ||
        !(m.username === 'admin' || m.targetUser === 'admin')
    );
    saveData();

    // Обновляем список пользователей и очищаем область чата
    loadUsers();
    document.getElementById('chatArea').innerHTML = '<div class="no-selection">Выберите пользователя для начала диалога</div>';
}

// Вспомогательные функции
function saveData() {
    localStorage.setItem('messages', JSON.stringify(messages));
}

function loadConversations() {
    // Эта функция может быть расширена для отображения уведомлений о новых сообщениях
}
