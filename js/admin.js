<!DOCTYPE html>
<html>
<head>
    <title>Чат пользователя</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .chat-container { display: flex; flex-direction: column; height: 90vh; max-width: 600px; margin: 0 auto; }
        #userGreeting { text-align: center; font-size: 18px; margin: 10px 0; }
        #messageList { flex: 1; overflow-y: auto; border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; }
        .message { margin: 10px 0; padding: 10px; border-radius: 5px; }
        .user-message { background: #e3f2fd; }
        .admin-message { background: #f3e5f5; }
        .message-input { display: flex; gap: 10px; }
        #userMessage { flex: 1; padding: 10px; }
        #sendBtn, #logoutBtn { padding: 10px; }
        #logoutBtn { background: #dc3545; color: white; border: none; cursor: pointer; }
    </style>
</head>
<body>
    <div class="chat-container">
        <h2 id="userGreeting"></h2>
        <div id="messageList"></div>
        <div class="message-input">
            <textarea id="userMessage" placeholder="Введите сообщение..." rows="3"></textarea>
            <button id="sendBtn">Отправить</button>
        </div>
        <button id="logoutBtn">Выйти</button>
    </div>

    <script src="js/user.js"></script>
</body>
</html>
