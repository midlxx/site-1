// Инициализация данных
let users = JSON.parse(localStorage.getItem('users')) || [];
let messages = JSON.parse(localStorage.getItem('messages')) || [];

function saveData() {
    localStorage.setItem('messages', JSON.stringify(messages));
}

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('userGreeting').textContent = currentUser;

    loadMessages();

    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
});

function sendMessage() {
    const messageText = document.getElementById('userMessage').value.trim();
    if (!messageText) {
        alert('Введите текст сообщения!');
        return;
    }

    const newMessage = {
        id: Date.now(),
        username: localStorage.getItem('currentUser'),
        message: messageText,
        timestamp: new Date().toLocaleString(),
        ip: '127.0.0.1',
        isAdmin: false,
        targetUser: 'admin'
    };

    messages.push(newMessage);
    saveData();
    document.getElementById('userMessage').value = '';
    loadMessages();
}

function loadMessages() {
    const messageList = document.getElementById('messageList');
    messageList.innerHTML = '';

    const userMessages = messages.filter(m =>
        (m.username === localStorage.getItem('currentUser') && m.targetUser === 'admin') ||
        (m.targetUser === localStorage.getItem('currentUser') && m.username === 'admin')
    );

    userMessages.forEach(msg => {
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
}
