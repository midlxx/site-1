// Инициализация хранилищ (в реальном приложении используйте сервер)
let users = JSON.parse(localStorage.getItem('users')) || [
    { username: 'admin', password: 'admin', isAdmin: true }
];
let messages = JSON.parse(localStorage.getItem('messages')) || [];

// Сохранение данных
function saveData() {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('messages', JSON.stringify(messages));
}

// Регистрация
document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Пароли не совпадают!');
        return;
    }
    
    if (users.find(user => user.username === username)) {
        alert('Пользователь с таким никнеймом уже существует!');
        return;
    }
    
    users.push({ username, password, isAdmin: false });
    saveData();
    alert('Регистрация успешна! Теперь войдите в систему.');
    window.location.href = 'index.html';
});

// Вход
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', username);
        if (user.isAdmin) {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'user.html';
        }
    } else {
        alert('Неверный логин или пароль!');
    }
});
