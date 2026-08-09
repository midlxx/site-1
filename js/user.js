let users = [];
let messages = [];

document.addEventListener('DOMContentLoaded', function() {
    loadData().then(() => {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            window.location.href = 'index.html';
            return;
        }

        document.getElementById('userGreeting').textContent = currentUser;
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
    await saveData();
    document.getElementById('userMessage').value = '';
    loadMessages();
}

function loadMessages() {
    const messageList = document
