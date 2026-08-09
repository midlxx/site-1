async function loadData() {
    try {
        const response = await fetch('https://swer1.vercel.app/data.json');
        const serverData = await response.json();
        window.users = serverData.users || [];
        window.messages = serverData.messages || [];
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        window.users = [{ username: 'admin', password: 'admin', isAdmin: true }];
        window.messages = [];
    }
}

async function saveData() {
    const data = { users: window.users, messages: window.messages };
    try {
        await fetch('https://ваш-хостинг/update-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error('Ошибка сохранения данных:', error);
    }
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    loadData().then(() => {
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            localStorage.setItem('currentUser', username);
            if (username === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'user.html';
            }
        } else {
            alert('Неверный логин или пароль!');
        }
    });
}
