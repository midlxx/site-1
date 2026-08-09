<!DOCTYPE html>
<html>
<head>
    <title>Авторизация</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
        .form-group { margin: 10px 0; }
        input { padding: 8px; width: 200px; margin: 5px; }
        button { padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer; }
    </style>
</head>
<body>
    <h1>Авторизация чата</h1>
    <div class="form-group">
        <input type="text" id="username" placeholder="Логин">
    </div>
    <div class="form-group">
        <input type="password" id="password" placeholder="Пароль">
    </div>
    <button onclick="login()">Войти</button>

    <script src="js/auth.js"></script>
</body>
</html>

