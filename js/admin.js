<!DOCTYPE html>
<html>
<head>
    <title>Админ-панель чата</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .admin-container { display: flex; height: 90vh; }
        #usersList { width: 250px; border-right: 1px solid #ccc; overflow-y: auto; }
        .user-item { padding: 10px; cursor: pointer; border-bottom: 1px solid #eee; }
        .user-item.active { background: #e3f2fd; font-weight: bold; }
        #chatArea { flex: 1; display: flex; flex-direction: column; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #ccc; }
        .no-selection { text-align: center; padding: 20px; color: #666; }
        .message-list { flex: 1; overflow-y: auto; padding: 10px; }
        .close-dialog { background: #dc3545; color: white; border: none; padding: 5px 10px; cursor: pointer; }
        .message-input { display: flex; gap: 10px; padding: 10px; border-top: 1px solid #ccc; }
        #adminMessage { flex: 1; padding: 10px; }
        #adminSendBtn { padding: 10px; }
    </style>
</head>
<body>
    <div class="admin-container">
        <div id="usersList"></div>
        <div id="chatArea">
            <div class="no-selection">Выберите пользователя для начала диалога</div>
        </div>
    </div>
    <a href="#" id="logoutBtn">Выйти</a>

    <script src="js/admin.js"></script>
</body>
</html>
